import { createContext, useContext, useState, useEffect } from 'react';
import { database, ref, set, onValue, push, serverTimestamp, get, defaultStores, roleTypes, initialListState, templateItems } from '../services/firebase';

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
  const [editingItem, setEditingItem] = useState(null);

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
        // 初期データに空のオブジェクトを確実に設定
        const initialData = {
          items: {
            okstore: {},
            hanamasa: {}
          },
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
        // データが存在しない場合は空のオブジェクトを設定
        const updatedItems = data.items || { okstore: {}, hanamasa: {} };
        // 各ストアが存在することを確認
        if (!updatedItems.okstore) updatedItems.okstore = {};
        if (!updatedItems.hanamasa) updatedItems.hanamasa = {};
        
        setItems(updatedItems);
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
    if (!listId) {
      console.error('Cannot add item: no listId');
      return false;
    }
    
    if (!item || !item.name) {
      console.error('Cannot add item: invalid item data', item);
      return false;
    }

    const store = item.store || currentStore;
    const newItem = {
      name: item.name.trim(),
      quantity: parseInt(item.quantity) || 1,
      completed: false,
      timestamp: serverTimestamp(),
      order: Date.now() // 追加：アイテムの順序を保存
    };

    try {
      console.log('Adding new item:', { store, ...newItem });
      
      // 確実にパスが存在することを確認
      const storeRef = ref(database, `lists/${listId}/items/${store}`);
      
      // まずストアのパスが存在することを確認
      const storeSnapshot = await get(storeRef);
      if (!storeSnapshot.exists()) {
        await set(storeRef, {});
      }
      
      // アイテムを追加
      const newItemRef = push(storeRef);
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
        
        // チェック状態が変更された場合、順序も更新
        if (updates.completed !== undefined && updates.completed !== currentItem.completed) {
          updates.order = updates.completed ? 
            Date.now() + 1000000000 : // 完了したアイテムは大きな値を設定して下に移動
            Date.now();              // 未完了に戻したアイテムは現在時刻を設定
        }
        
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

  const reorderItems = async (store, startIndex, endIndex) => {
    if (!listId) {
      console.error('Cannot reorder items: no listId');
      return false;
    }

    try {
      const storeItems = items[store] || {};
      const itemEntries = Object.entries(storeItems);
      
      // 完了状態でグループ分け
      const completedItems = itemEntries.filter(([_, item]) => item.completed);
      const incompleteItems = itemEntries.filter(([_, item]) => !item.completed);
      
      // ドラッグ&ドロップは未完了アイテム内でのみ行う
      if (startIndex >= 0 && endIndex >= 0 && startIndex < incompleteItems.length && endIndex < incompleteItems.length) {
        const [movedItem] = incompleteItems.splice(startIndex, 1);
        incompleteItems.splice(endIndex, 0, movedItem);
        
        // 順序を更新（個別に更新）
        const promises = incompleteItems.map(([id, item], index) => {
          const itemRef = ref(database, `lists/${listId}/items/${store}/${id}`);
          return set(itemRef, {
            ...item,
            order: Date.now() + index
          });
        });
        
        await Promise.all(promises);
        console.log('Items reordered successfully');
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error reordering items:', error);
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
      // メタデータを更新
      const metadataRef = ref(database, `lists/${listId}/metadata`);
      
      // 現在のメタデータを取得
      const metadataSnapshot = await get(metadataRef);
      const currentMetadata = metadataSnapshot.exists() ? metadataSnapshot.val() : { ...initialListState.metadata };
      
      // 役割を更新
      const updatedMetadata = {
        ...currentMetadata,
        currentRole: newRole
      };
      
      // Firebaseに保存
      await set(metadataRef, updatedMetadata);
      
      // ローカルの状態を更新
      setMetadata(updatedMetadata);
      
      console.log('Role switched successfully to:', newRole);
      return true;
    } catch (error) {
      console.error('Error switching role:', error);
      return false;
    }
  };

  const editItem = (store, itemId, item) => {
    setEditingItem({ store, itemId, item });
  };

  const cancelEdit = () => {
    setEditingItem(null);
  };

  const saveEdit = async (name) => {
    if (!editingItem) return false;
    
    const { store, itemId, item } = editingItem;
    const result = await updateItem(store, itemId, { name: name.trim() });
    
    if (result) {
      setEditingItem(null);
      return true;
    }
    
    return false;
  };

  const value = {
    items,
    metadata,
    currentStore,
    setCurrentStore,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    switchRole,
    stores: defaultStores,
    templates: templateItems,
    isRequester: metadata?.currentRole === roleTypes.REQUESTER,
    isShopper: metadata?.currentRole === roleTypes.SHOPPER,
    currentRole: metadata?.currentRole || roleTypes.REQUESTER,
    loading,
    editingItem,
    editItem,
    cancelEdit,
    saveEdit
  };

  return (
    <ShoppingContext.Provider value={value}>
      {children}
    </ShoppingContext.Provider>
  );
};
