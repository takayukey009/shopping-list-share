import { useShoppingContext } from '../contexts/ShoppingContext';
import { TrashIcon, MinusIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';

export default function ShoppingList() {
  const { 
    items, 
    currentStore, 
    updateItem, 
    deleteItem,
    isRequester,
    isShopper,
    stores
  } = useShoppingContext();

  const storeItems = items[currentStore] || {};
  const storeName = stores[currentStore]?.name || '';

  const handleQuantityChange = (itemId, currentQuantity, increment) => {
    const newQuantity = Math.max(1, currentQuantity + increment);
    updateItem(currentStore, itemId, { quantity: newQuantity });
  };

  const handleToggleComplete = (itemId, currentCompleted) => {
    updateItem(currentStore, itemId, { completed: !currentCompleted });
  };

  const handleDelete = (itemId) => {
    deleteItem(currentStore, itemId);
  };

  const sortedItems = Object.entries(storeItems).sort((a, b) => {
    // 完了していないアイテムを先に表示
    if (a[1].completed !== b[1].completed) {
      return a[1].completed ? 1 : -1;
    }
    // タイムスタンプで並び替え（新しい順）
    return (b[1].timestamp || 0) - (a[1].timestamp || 0);
  });

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 py-2">
        <h2 className="text-lg font-medium text-gray-900">
          {storeName}の買い物リスト
        </h2>
        <span className="text-sm text-gray-500">
          {Object.keys(storeItems).length}個のアイテム
        </span>
      </div>

      <AnimatePresence>
        {sortedItems.map(([id, item]) => (
          <motion.div
            key={id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
              item.completed ? 'border-green-200' : 'border-gray-200'
            }`}
          >
            <div className="p-4 flex items-center gap-3">
              {isShopper && (
                <button
                  onClick={() => handleToggleComplete(id, item.completed)}
                  className={`flex-none w-6 h-6 rounded-full border-2 transition-colors duration-200 flex items-center justify-center ${
                    item.completed 
                      ? 'border-green-500 bg-green-500 text-white' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {item.completed && <CheckIcon className="w-4 h-4" />}
                </button>
              )}
              
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-medium truncate ${
                  item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                }`}>
                  {item.name}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {isRequester && (
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
                    <button
                      onClick={() => handleQuantityChange(id, item.quantity, -1)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(id, item.quantity, 1)}
                      className="p-1 text-gray-500 hover:text-gray-700"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {!isRequester && (
                  <span className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-200 font-medium text-gray-900">
                    {item.quantity}
                  </span>
                )}
                
                {isRequester && (
                  <button
                    onClick={() => handleDelete(id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {Object.keys(storeItems).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            まだアイテムがありません
          </p>
          {isRequester && (
            <p className="text-sm text-gray-400 mt-1">
              下のフォームから商品を追加してください
            </p>
          )}
        </div>
      )}
    </div>
  );
}
