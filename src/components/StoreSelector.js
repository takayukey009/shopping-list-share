import { useShoppingContext } from '../contexts/ShoppingContext';
import { ShoppingBagIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function StoreSelector() {
  const { 
    currentStore, 
    setCurrentStore, 
    stores, 
    listStatus,
    toggleShoppingProgress,
    getStoreStatus
  } = useShoppingContext();

  const getStatusIcon = (store) => {
    const status = getStoreStatus(store);
    switch (status) {
      case '買い物中':
        return <ShoppingBagIcon className="h-5 w-5 text-blue-500" />;
      case '完了':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (store) => {
    const status = getStoreStatus(store);
    switch (status) {
      case '買い物中':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '完了':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2 p-4">
          {Object.entries(stores).map(([key, name]) => (
            <button
              key={key}
              onClick={() => setCurrentStore(key)}
              className={`flex-1 p-4 rounded-lg border ${
                currentStore === key 
                  ? 'border-indigo-500 ring-2 ring-indigo-200'
                  : 'border-gray-200 hover:border-gray-300'
              } transition-all duration-200`}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleShoppingProgress(key);
                  }}
                  className={`ml-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(key)} flex items-center gap-1`}
                >
                  {getStatusIcon(key)}
                  <span>{getStoreStatus(key)}</span>
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
