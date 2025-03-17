import { useShoppingContext } from '../contexts/ShoppingContext';
import { defaultTemplates } from '../services/firebase';
import { motion } from 'framer-motion';

const templateItems = {
  'スーパー': [
    '牛乳', '卵', 'パン', '野菜', '果物', '肉', '魚'
  ],
  'ドラッグストア': [
    'シャンプー', '歯磨き粉', 'ボディソープ', 'ティッシュ'
  ],
  'コンビニ': [
    'おにぎり', 'お弁当', '飲み物', 'パン'
  ],
  '100均': [
    '文具', '掃除用品', '収納用品', 'キッチン用品'
  ]
};

export default function TemplateItems() {
  const { currentStore, addItem } = useShoppingContext();
  const templates = defaultTemplates[currentStore] || {};

  const handleAddTemplateItem = (item) => {
    addItem({
      name: item.name,
      quantity: item.defaultQuantity,
      store: currentStore
    });
  };

  if (Object.keys(templates).length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm mt-4">
      <div className="max-w-3xl mx-auto p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-4">よく買う商品</h2>
        <div className="space-y-6">
          {Object.entries(templates).map(([categoryId, category]) => (
            <motion.div
              key={categoryId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                {category.name}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {category.items.map((item, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAddTemplateItem(item)}
                    className="text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-500">
                      デフォルト数量: {item.defaultQuantity}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
