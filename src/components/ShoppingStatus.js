import { useShoppingContext } from '../contexts/ShoppingContext';

export default function ShoppingStatus() {
  const { items, status } = useShoppingContext();

  const completedItems = items.filter(item => item.completed).length;
  const totalItems = items.length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  const statusColors = {
    '準備中': 'bg-yellow-500',
    '買い物中': 'bg-blue-500',
    '完了': 'bg-green-500'
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm font-medium text-gray-700">
          進捗状況: {completedItems} / {totalItems} アイテム
        </div>
        <div className={`px-2 py-1 rounded text-white text-sm ${statusColors[status]}`}>
          {status}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${statusColors[status]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
