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
    <div className="pb-4">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence>
          {sortedItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-sm"
            >
              <p className="text-base font-medium mb-1">アイテムがありません</p>
              <p className="text-sm">
                下部の入力フォームからアイテムを追加してください
              </p>
            </motion.div>
          ) : (
            <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
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
