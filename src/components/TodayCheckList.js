import React, { useState, useEffect } from 'react';
import { getTodayCheckItems, weekdays } from '../services/firebase';
import { useShoppingContext } from '../contexts/ShoppingContext';

const TodayCheckList = () => {
  const [todayItems, setTodayItems] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [addedItems, setAddedItems] = useState({});
  const { addItem } = useShoppingContext();
  
  useEffect(() => {
    // 今日チェックすべきアイテムを取得
    const items = getTodayCheckItems();
    setTodayItems(items);
  }, []);

  // 今日の曜日を取得
  const today = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayOfWeek = dayNames[today.getDay()];
  const dayOfMonth = today.getDate();
  const japaneseWeekday = weekdays[dayOfWeek] || '不明';

  // ストア名の日本語表示
  const storeNames = {
    okstore: 'オーケーストア',
    hanamasa: 'ハナマサ',
    seijoishin: '成城石井'
  };

  // カテゴリ名の日本語表示
  const categoryNames = {
    vegetable: '野菜',
    food: '食材',
    rice: 'お米',
    household: '日用品'
  };

  // アイテムを買い物リストに追加
  const handleAddItem = (item) => {
    addItem({
      name: item.name,
      quantity: item.defaultQuantity || 1,
      store: item.store
    });
    
    // 追加済みアイテムを記録
    setAddedItems(prev => ({
      ...prev,
      [`${item.store}-${item.name}`]: true
    }));
  };

  if (todayItems.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 mb-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="flex justify-between items-center p-3 bg-blue-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-semibold text-blue-800">
          今日（{dayOfMonth}日・{japaneseWeekday}）のチェックリスト
        </h2>
        <span className="text-blue-500">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
        </span>
      </div>
      
      {isOpen && (
        <div className="p-3">
          <p className="text-sm text-gray-600 mb-2">以下のアイテムを確認してください：</p>
          
          {/* ストアごとにグループ化 */}
          {Object.keys(storeNames).map(storeKey => {
            const storeItems = todayItems.filter(item => item.store === storeKey);
            
            if (storeItems.length === 0) return null;
            
            return (
              <div key={storeKey} className="mb-4">
                <h3 className="text-md font-medium text-gray-700 mb-1">{storeNames[storeKey]}</h3>
                <ul className="pl-4">
                  {storeItems.map((item, index) => {
                    const itemKey = `${item.store}-${item.name}`;
                    const isAdded = addedItems[itemKey];
                    
                    return (
                      <li key={index} className="text-sm py-1 flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full mr-2 text-xs">
                            {categoryNames[item.category]?.charAt(0) || '?'}
                          </span>
                          {item.name}
                          {item.defaultQuantity > 1 && 
                            <span className="ml-2 text-xs text-gray-500">×{item.defaultQuantity}</span>
                          }
                        </div>
                        <button
                          onClick={() => handleAddItem(item)}
                          disabled={isAdded}
                          className={`ml-2 px-2 py-1 text-xs rounded ${
                            isAdded 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {isAdded ? '追加済み' : '追加'}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          
          <div className="mt-3 text-xs text-gray-500">
            <p>※ 週次チェック: 月・木・土曜日</p>
            <p>※ 月2回チェック: 10日・20日</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayCheckList;
