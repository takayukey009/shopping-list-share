import { useShoppingContext } from '../contexts/ShoppingContext';
import { ShoppingBagIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function StoreSelector() {
  const { 
    currentStore, 
    setCurrentStore, 
    stores,
    metadata,
    updateListStatus
  } = useShoppingContext();

  const isStoreOpen = (store) => {
    const now = new Date();
    const hours = stores[store].hours;
    
    // 24時間営業の場合
    if (hours.open === '00:00' && hours.close === '24:00') {
      return true;
    }

    const [openHour, openMinute] = hours.open.split(':').map(Number);
    const [closeHour, closeMinute] = hours.close.split(':').map(Number);
    
    const storeOpenTime = new Date(now);
    storeOpenTime.setHours(openHour, openMinute, 0);
    
    const storeCloseTime = new Date(now);
    storeCloseTime.setHours(closeHour, closeMinute, 0);
    
    return now >= storeOpenTime && now <= storeCloseTime;
  };

  const getStatusIcon = (store) => {
    const status = metadata.status[store];
    if (status.completed) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    }
    if (status.shopping) {
      return <ShoppingBagIcon className="h-5 w-5 text-blue-500" />;
    }
    if (isStoreOpen(store)) {
      return <ClockIcon className="h-5 w-5 text-green-500" />;
    }
    return <ClockIcon className="h-5 w-5 text-gray-400" />;
  };

  const getStatusColor = (store) => {
    const status = metadata.status[store];
    if (status.completed) {
      return 'bg-green-50 text-green-700 border-green-200';
    }
    if (status.shopping) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (isStoreOpen(store)) {
      return 'bg-green-50 text-green-700 border-green-200';
    }
    return 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusText = (store) => {
    const status = metadata.status[store];
    if (status.completed) {
      return '完了';
    }
    if (status.shopping) {
      return '買い物中';
    }
    if (isStoreOpen(store)) {
      return '営業中';
    }
    return '準備中';
  };

  return (
    <div className="bg-white shadow-sm">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-2 p-4">
          {Object.entries(stores).map(([key, store]) => (
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
                <span className="font-medium">{store.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const status = metadata.status[key];
                    if (status.completed) {
                      updateListStatus(key, { requested: false, shopping: false, completed: false });
                    } else if (status.shopping) {
                      updateListStatus(key, { requested: true, shopping: false, completed: true });
                    } else if (status.requested) {
                      updateListStatus(key, { requested: true, shopping: true, completed: false });
                    } else {
                      updateListStatus(key, { requested: true, shopping: false, completed: false });
                    }
                  }}
                  className={`ml-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(key)} flex items-center gap-1`}
                >
                  {getStatusIcon(key)}
                  <span>{getStatusText(key)}</span>
                </button>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
