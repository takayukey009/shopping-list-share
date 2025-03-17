import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database, ref, set, serverTimestamp, generateListId, defaultListData } from '../services/firebase';
import { ShareIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const createNewList = async () => {
    setIsCreating(true);
    try {
      const listId = generateListId();
      const listRef = ref(database, `lists/${listId}`);
      
      await set(listRef, {
        ...defaultListData,
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: '買い物リスト共有アプリ',
        text: '簡単に買い物リストを共有できるアプリです',
        url: window.location.origin
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            買い物リスト共有
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            簡単に買い物リストを作成・共有できます
          </p>
        </div>

        <div className="mt-8 space-y-6">
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
                <ShareIcon className="h-5 w-5 mr-2" />
                新しいリストを作成
              </>
            )}
          </button>

          {navigator.share && (
            <button
              onClick={handleShare}
              className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ShareIcon className="h-5 w-5 mr-2" />
              アプリを共有
            </button>
          )}
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                または
              </span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              URLを持っている場合は、そのままブラウザのアドレスバーに貼り付けてください
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
