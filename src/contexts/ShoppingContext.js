import { createContext, useContext, useState, useEffect } from 'react';
import { database, ref, set, onValue, push, serverTimestamp, defaultStores, roleTypes, initialListState, templateItems } from '../services/firebase';

const ShoppingContext = createContext();

export const useShoppingContext = () => {
  const context = useContext(ShoppingContext);
  if (!context) {
    throw new Error('useShoppingContext must be used within a ShoppingProvider');
  }
  return context;
};

export const ShoppingProvider = ({ children, listId }) => {
  const [items, setItems] = useState(initialListState.items);
  const [metadata, setMetadata] = useState(initialListState.metadata);
  const [currentStore, setCurrentStore] = useState('okstore');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listId) {
      console.error('No listId provided');
      return;
    }

    console.log('Initializing list with ID:', listId);
    const listRef = ref(database, `lists/${listId}`);
    
    const unsubscribe = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      console.log('Received data from Firebase:', data);

      if (!data) {
        console.log('Creating new list with initial state');
        const initialData = {
          items: initialListState.items,
          metadata: {
            ...initialListState.metadata,
            createdAt: serverTimestamp()
          }
        };
        set(listRef, initialData)
          .then(() => {
            console.log('Initial data set successfully');
            setItems(initialData.items);
            setMetadata(initialData.metadata);
          })
          .catch(error => {
            console.error('Error setting initial data:', error);
          });
      } else {
        console.log('Updating state with existing data');
        setItems(data.items || initialListState.items);
        setMetadata(data.metadata || initialListState.metadata);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error loading data:', error);
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up Firebase listener');
      unsubscribe();
    };
  }, [listId]);

  const addItem = async (item) => {
    if (!listId || !item.name) {
      console.error('Cannot add item: invalid input', { listId, item });
      return;
    }

    const store = item.store || currentStore;
    const newItem = {
      name: item.name.trim(),
      quantity: parseInt(item.quantity) || 1,
      completed: false,
      timestamp: serverTimestamp()
    };

    try {
      console.log('Adding new item:', { store, ...newItem });
      const itemsRef = ref(database, `lists/${listId}/items/${store}`);
      const newItemRef = push(itemsRef);
      await set(newItemRef, newItem);
      console.log('Item added successfully:', { id: newItemRef.key, ...newItem });
      return true;
    } catch (error) {
      console.error('Error adding item:', error);
      return false;
    }
  };

  const updateItem = async (store, itemId, updates) => {
    if (!listId) {
      console.error('Cannot update item: no listId');
      return false;
    }
    
    const itemRef = ref(database, `lists/${listId}/items/${store}/${itemId}`);
    const currentItem = items[store]?.[itemId];
    
    if (currentItem) {
      try {
        console.log('Updating item:', { store, itemId, updates });
        await set(itemRef, { ...currentItem, ...updates });
        console.log('Item updated successfully');
        return true;
      } catch (error) {
        console.error('Error updating item:', error);
        return false;
      }
    } else {
      console.error('Cannot update item: item not found', { store, itemId });
      return false;
    }
  };

  const deleteItem = async (store, itemId) => {
    if (!listId) {
      console.error('Cannot delete item: no listId');
      return false;
    }
    
    try {
      console.log('Deleting item:', { store, itemId });
      const itemRef = ref(database, `lists/${listId}/items/${store}/${itemId}`);
      await set(itemRef, null);
      console.log('Item deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting item:', error);
      return false;
    }
  };

  const switchRole = async () => {
    if (!listId) {
      console.error('Cannot switch role: no listId');
      return false;
    }
    
    const newRole = metadata.currentRole === roleTypes.REQUESTER ? roleTypes.SHOPPER : roleTypes.REQUESTER;
    console.log('Switching role to:', newRole);
    
    try {
      const metadataRef = ref(database, `lists/${listId}/metadata`);
      await set(metadataRef, {
        ...metadata,
        currentRole: newRole
      });
      console.log('Role switched successfully');
      return true;
    } catch (error) {
      console.error('Error switching role:', error);
      return false;
    }
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
    stores: defaultStores,
    templates: templateItems,
    isRequester: metadata?.currentRole === roleTypes.REQUESTER,
    isShopper: metadata?.currentRole === roleTypes.SHOPPER,
    currentRole: metadata?.currentRole || roleTypes.REQUESTER,
    loading
  };

  if (loading) {
    console.log('Context is still loading...');
  }

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
};
