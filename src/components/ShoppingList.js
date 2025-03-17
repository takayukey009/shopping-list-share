import { useShoppingContext } from '../contexts/ShoppingContext';
import ListItem from './ListItem';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShoppingList() {
  const { items, currentStore, updateItem } = useShoppingContext();

  const currentItems = items[currentStore] || [];
  
  const sortedItems = Object.entries(currentItems).sort(([, a], [, b]) => {
    // 未完了のアイテムを先に表示
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // 同じステータス内では新しい順に表示
    return b.timestamp - a.timestamp;
  });

  const handleItemUpdate = (itemId, updates) => {
    updateItem(currentStore, itemId, updates);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <div className="max-w-3xl mx-auto py-4">
        <AnimatePresence>
          {sortedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 text-center text-gray-500 bg-white rounded-lg shadow"
            >
              <p className="text-lg font-medium mb-2">アイテムがありません</p>
              <p className="text-sm">
                下部の入力フォームからアイテムを追加してください
              </p>
            </motion.div>
          ) : (
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {sortedItems.map(([itemId, item]) => (
                <motion.div
                  key={itemId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem
                    item={item}
                    onUpdate={(updates) => handleItemUpdate(itemId, updates)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
