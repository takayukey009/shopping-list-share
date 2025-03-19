import { createContext, useContext, useState, useEffect } from 'react';
import { database, ref, set, onValue, push, serverTimestamp, defaultStores, roleTypes, initialListState } from '../services/firebase';

const ShoppingContext = createContext();

export const useShoppingContext = () => {
  return useContext(ShoppingContext);
};

export const ShoppingProvider = ({ children, listId }) => {
  const [items, setItems] = useState(initialListState.items);
  const [metadata, setMetadata] = useState(initialListState.metadata);
  const [currentStore, setCurrentStore] = useState('okstore');

  useEffect(() => {
    if (!listId) return;
    
    const listRef = ref(database, `lists/${listId}`);
    const unsubscribe = onValue(listRef, (snapshot) => {
      const data = snapshot.val() || {
        items: initialListState.items,
        metadata: {
          ...initialListState.metadata,
          createdAt: serverTimestamp()
        }
      };
      
      setItems(data.items || {});
      setMetadata(data.metadata || {
        ...initialListState.metadata,
        createdAt: serverTimestamp()
      });
    });

    return () => unsubscribe();
  }, [listId]);

  const addItem = async (item) => {
    if (!listId) return;
    
    const store = item.store || currentStore;
    const itemsRef = ref(database, `lists/${listId}/items/${store}`);
    const newItem = {
      name: item.name,
      quantity: item.quantity || 1,
      completed: false,
      timestamp: serverTimestamp()
    };

    try {
      const newItemRef = push(itemsRef, newItem);
      console.log('Item added successfully:', newItem);
      return newItemRef.key;
    } catch (error) {
      console.error('Error adding item:', error);
      return null;
    }
  };

  const updateItem = async (store, itemId, updates) => {
    if (!listId) return;
    
    const itemRef = ref(database, `lists/${listId}/items/${store}/${itemId}`);
    try {
      await set(itemRef, { ...items[store][itemId], ...updates });
      console.log('Item updated successfully:', updates);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const deleteItem = async (store, itemId) => {
    if (!listId) return;
    
    const itemRef = ref(database, `lists/${listId}/items/${store}/${itemId}`);
    try {
      await set(itemRef, null);
      console.log('Item deleted successfully:', itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const switchRole = async () => {
    if (!listId) return;
    
    const newRole = metadata?.currentRole === roleTypes.REQUESTER ? roleTypes.SHOPPER : roleTypes.REQUESTER;
    const metadataRef = ref(database, `lists/${listId}/metadata`);
    
    try {
      await set(metadataRef, { 
        ...metadata, 
        currentRole: newRole,
        status: metadata?.status || initialListState.metadata.status
      });
      console.log('Role switched successfully to:', newRole);
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };

  const updateListStatus = async (store, status) => {
    if (!listId) return;
    
    const statusRef = ref(database, `lists/${listId}/metadata/status/${store}`);
    try {
      await set(statusRef, status);
      console.log('Status updated successfully:', status);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStoreStatus = (store) => {
    const status = metadata?.status?.[store] || initialListState.metadata.status[store];
    if (status.completed) return '完了';
    if (status.shopping) return '買い物中';
    if (status.requested) return '依頼済み';
    return '準備中';
  };

  const value = {
    items,
    metadata,
    currentStore,
    setCurrentStore,
    addItem,
    updateItem,
    deleteItem,
    switchRole,
    updateListStatus,
    getStoreStatus,
    stores: defaultStores,
    isRequester: metadata?.currentRole === roleTypes.REQUESTER,
    isShopper: metadata?.currentRole === roleTypes.SHOPPER,
    currentRole: metadata?.currentRole || roleTypes.REQUESTER
  };

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
};
