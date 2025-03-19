import { useShoppingContext } from '../contexts/ShoppingContext';
import { PencilIcon, ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { roleTypes } from '../services/firebase';

export default function Header() {
  const { status, updateStatus, metadata, switchRole } = useShoppingContext();

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
    <header className="bg-white shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">買い物リスト</h1>
        <div className="flex space-x-2">
          {Object.keys(statusIcons).map((statusOption) => (
            <button
              key={statusOption}
              onClick={() => handleStatusChange(statusOption)}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                ${status === statusOption ? statusColors[statusOption] : 'bg-gray-100 text-gray-800'}
                transition-colors duration-200`}
            >
              {statusIcons[statusOption]}
              <span className="ml-2">{statusOption}</span>
            </button>
          ))}
        </div>
        <button
          onClick={switchRole}
          className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {metadata.currentRole === roleTypes.REQUESTER ? '購入側に切替' : '依頼側に切替'}
        </button>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-1 bg-indigo-50 text-sm text-indigo-700 text-center">
        現在の役割: {metadata.currentRole === roleTypes.REQUESTER ? '依頼側' : '購入側'}
      </div>
    </header>
  );
}
