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
      const data = snapshot.val();
      if (data) {
        setItems(data.items || initialListState.items);
        setMetadata(data.metadata || {
          ...initialListState.metadata,
          createdAt: serverTimestamp()
        });
      }
    });

    return () => unsubscribe();
  }, [listId]);

  const addItem = async (item) => {
    if (!listId || metadata.currentRole !== roleTypes.REQUESTER) return;
    const store = item.store || currentStore;
    const listRef = ref(database, `lists/${listId}/items/${store}`);
    const newItem = {
      name: item.name,
      quantity: item.quantity || 1,
      completed: false,
      timestamp: serverTimestamp(),
      addedBy: roleTypes.REQUESTER
    };
    await push(listRef, newItem);
  };

  const updateItem = async (store, itemId, updates) => {
    if (!listId) return;
    
    // 購入側のみがcompletedを更新可能
    if (updates.completed !== undefined && metadata.currentRole !== roleTypes.SHOPPER) {
      return;
    }
    
    // 依頼側のみが商品情報を更新可能
    if ((updates.name !== undefined || updates.quantity !== undefined) && 
        metadata.currentRole !== roleTypes.REQUESTER) {
      return;
    }

    const itemRef = ref(database, `lists/${listId}/items/${store}/${itemId}`);
    await set(itemRef, { ...items[store][itemId], ...updates });
  };

  const switchRole = async () => {
    if (!listId) return;
    const newRole = metadata.currentRole === roleTypes.REQUESTER ? roleTypes.SHOPPER : roleTypes.REQUESTER;
    const metadataRef = ref(database, `lists/${listId}/metadata`);
    await set(metadataRef, { ...metadata, currentRole: newRole });
  };

  const updateListStatus = async (store, status) => {
    if (!listId) return;
    const statusRef = ref(database, `lists/${listId}/metadata/status/${store}`);
    await set(statusRef, status);
  };

  const getStoreStatus = (store) => {
    const status = metadata.status[store];
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
    switchRole,
    updateListStatus,
    getStoreStatus,
    stores: defaultStores,
    isRequester: metadata.currentRole === roleTypes.REQUESTER,
    isShopper: metadata.currentRole === roleTypes.SHOPPER
  };

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
};
