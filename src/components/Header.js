import { useShoppingContext } from '../contexts/ShoppingContext';
import { PencilIcon, ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { status, updateStatus } = useShoppingContext();

  const statusIcons = {
    '準備中': <PencilIcon className="h-6 w-6" />,
    '買い物中': <ShoppingCartIcon className="h-6 w-6" />,
    '完了': <CheckIcon className="h-6 w-6" />
  };

  const statusColors = {
    '準備中': 'bg-yellow-100 text-yellow-800',
    '買い物中': 'bg-blue-100 text-blue-800',
    '完了': 'bg-green-100 text-green-800'
  };

  const handleStatusChange = (newStatus) => {
    updateStatus(newStatus);
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">買い物リスト</h1>
          
          <div className="flex space-x-2">
            {Object.keys(statusIcons).map((statusOption) => (
              <button
                key={statusOption}
                onClick={() => handleStatusChange(statusOption)}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                  ${status === statusOption ? statusColors[statusOption] : 'bg-gray-100 text-gray-800'}
                  transition-colors duration-200`}
              >
                {statusIcons[statusOption]}
                <span className="ml-2">{statusOption}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
