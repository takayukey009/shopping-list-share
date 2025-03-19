import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, ref, set, onValue, serverTimestamp, generateListId, initialListStatus, defaultStores } from '../services/firebase';
import { ClipboardDocumentListIcon, ShoppingCartIcon, CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [recentLists, setRecentLists] = useState([]);

  useEffect(() => {
    const listsRef = ref(database, 'lists');
    const unsubscribe = onValue(listsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lists = Object.entries(data)
          .map(([id, list]) => ({
            id,
            createdAt: list.createdAt,
            status: list.status,
            items: list.items
          }))
          .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
          .slice(0, 5); // 最新5件のみ表示
        setRecentLists(lists);
      }
    });

    return () => unsubscribe();
  }, []);

  const createNewList = async () => {
    setIsCreating(true);
    try {
      const listId = generateListId();
      const listRef = ref(database, `lists/${listId}`);
      
      await set(listRef, {
        items: {
          okstore: {},
          hanamasa: {}
        },
        status: initialListStatus,
        createdAt: serverTimestamp()
      });

      navigate(`/list/${listId}`);
    } catch (error) {
      console.error('Error creating list:', error);
      alert('リストの作成に失敗しました');
    } finally {
      setIsCreating(false);
    }
  };

  const getStoreStatus = (storeStatus) => {
    if (!storeStatus) return '準備中';
    if (storeStatus.inProgress) return '買い物中';
    if (storeStatus.completedAt) return '完了';
    return '準備中';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case '買い物中':
        return <ShoppingCartIcon className="h-4 w-4" />;
      case '完了':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case '買い物中':
        return 'text-yellow-600 bg-yellow-100';
      case '完了':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getItemCount = (items) => {
    if (!items) return 0;
    return Object.values(items).reduce((total, storeItems) => {
      return total + Object.keys(storeItems).length;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            買い物リスト共有
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            簡単に買い物リストを作成・共有できます
          </p>
        </div>

        <button
          onClick={createNewList}
          disabled={isCreating}
          className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              作成中...
            </div>
          ) : (
            <>
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              新しいリストを作成
            </>
          )}
        </button>

        {recentLists.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">最近のリスト</h3>
            <div className="space-y-3">
              {recentLists.map((list) => (
                <button
                  key={list.id}
                  onClick={() => navigate(`/list/${list.id}`)}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="font-medium text-gray-900">
                        {new Date(list.createdAt).toLocaleString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}のリスト
                      </div>
                      <div className="text-gray-500 mt-1 space-y-1">
                        {Object.entries(defaultStores).map(([key, name]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(getStoreStatus(list.status?.[key]))}`}>
                              {getStatusIcon(getStoreStatus(list.status?.[key]))}
                              <span>{name}</span>
                            </span>
                            <span className="text-xs text-gray-500">
                              {getItemCount(list.items?.[key])}個
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
