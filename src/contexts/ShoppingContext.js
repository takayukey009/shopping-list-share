import { createContext, useContext, useState, useEffect } from 'react';
import { database, ref, set, onValue, push, serverTimestamp, defaultStores, initialListStatus } from '../services/firebase';

const ShoppingContext = createContext();

export const useShoppingContext = () => {
  return useContext(ShoppingContext);
};

export const ShoppingProvider = ({ children, listId }) => {
  const [items, setItems] = useState({
    okstore: {},
    hanamasa: {}
  });
  const [listStatus, setListStatus] = useState(initialListStatus);
  const [currentStore, setCurrentStore] = useState('okstore');
  const [listDate, setListDate] = useState(null);

  useEffect(() => {
    if (!listId) return;
    
    const listRef = ref(database, `lists/${listId}`);
    const unsubscribe = onValue(listRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setItems(data.items || {
          okstore: {},
          hanamasa: {}
        });
        setListStatus(data.status || initialListStatus);
        setListDate(data.createdAt ? new Date(data.createdAt) : null);
      }
    });

    return () => unsubscribe();
  }, [listId]);

  const addItem = async (item) => {
    if (!listId) return;
    const store = item.store || currentStore;
    const listRef = ref(database, `lists/${listId}/items/${store}`);
    const newItem = {
      name: item.name,
      quantity: item.quantity || 1,
      completed: false,
      timestamp: serverTimestamp()
    };
    await push(listRef, newItem);
  };

  const updateItem = async (store, itemId, updates) => {
    if (!listId) return;
    const itemRef = ref(database, `lists/${listId}/items/${store}/${itemId}`);
    await set(itemRef, { ...items[store][itemId], ...updates });
  };

  const toggleShoppingProgress = async (store) => {
    if (!listId) return;
    const currentStatus = listStatus[store];
    const statusRef = ref(database, `lists/${listId}/status/${store}`);
    
    if (!currentStatus.inProgress && !currentStatus.completedAt) {
      // 買い物開始
      await set(statusRef, { inProgress: true, completedAt: null });
    } else if (currentStatus.inProgress) {
      // 買い物完了
      await set(statusRef, { inProgress: false, completedAt: serverTimestamp() });
    } else if (currentStatus.completedAt) {
      // 再開
      await set(statusRef, { inProgress: true, completedAt: null });
    }
  };

  const getStoreStatus = (store) => {
    const status = listStatus[store];
    if (status.inProgress) return '買い物中';
    if (status.completedAt) return '完了';
    return '準備中';
  };

  const value = {
    items,
    listStatus,
    currentStore,
    setCurrentStore,
    listDate,
    addItem,
    updateItem,
    toggleShoppingProgress,
    getStoreStatus,
    stores: defaultStores
  };

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
};
