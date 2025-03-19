import { useShoppingContext } from '../contexts/ShoppingContext';
import { ClockIcon } from '@heroicons/react/24/outline';

export default function StoreSelector() {
  const { 
    currentStore, 
    setCurrentStore, 
    stores,
    isRequester
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
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                  isStoreOpen(key)
                    ? 'bg-green-50 text-green-700'
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  <ClockIcon className="w-4 h-4" />
                  <span>{isStoreOpen(key) ? '営業中' : '準備中'}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
