import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ShoppingProvider } from '../contexts/ShoppingContext';
import Header from '../components/Header';
import StoreSelector from '../components/StoreSelector';
import ShoppingList from '../components/ShoppingList';
import QuickInput from '../components/QuickInput';
import TemplateItems from '../components/TemplateItems';
import TodayCheckList from '../components/TodayCheckList';

// ランダムなIDを生成する関数
const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 10);
};

export default function List() {
  const { listId } = useParams();
  const navigate = useNavigate();

  // listIdがない場合は新しいIDを生成してリダイレクト
  useEffect(() => {
    if (!listId) {
      const newListId = generateRandomId();
      console.log('No listId found, redirecting to new list:', newListId);
      navigate(`/${newListId}`, { replace: true });
    }
  }, [listId, navigate]);

  // listIdがない場合はローディング表示
  if (!listId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">リストを作成中...</p>
        </div>
      </div>
    );
  }

  return (
    <ShoppingProvider listId={listId}>
      <div className="min-h-screen bg-gray-50 pb-32">
        <Header />
        <main className="max-w-3xl mx-auto px-4">
          <TodayCheckList />
          <StoreSelector />
          <div className="mt-4">
            <ShoppingList />
            <TemplateItems />
          </div>
          <QuickInput />
        </main>
      </div>
    </ShoppingProvider>
  );
}
