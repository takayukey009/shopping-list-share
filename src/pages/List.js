import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingProvider } from '../contexts/ShoppingContext';
import Header from '../components/Header';
import StoreSelector from '../components/StoreSelector';
import ShoppingList from '../components/ShoppingList';
import QuickInput from '../components/QuickInput';
import TemplateItems from '../components/TemplateItems';

function ListContent() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 relative">
            <img 
              src={process.env.PUBLIC_URL + '/logo.png'}
              alt="門"
              className="absolute inset-0 w-full h-full object-contain"
              onError={(e) => {
                console.error('Image load error:', e);
                e.target.onerror = null;
                e.target.src = process.env.PUBLIC_URL + '/logo.svg';
              }}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            「門」買い出しリスト
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <Header />
      <main className="max-w-3xl mx-auto px-4">
        <StoreSelector />
        <div className="mt-4">
          <ShoppingList />
          <TemplateItems />
        </div>
        <QuickInput />
      </main>
    </div>
  );
}

export default function List() {
  const { listId } = useParams();

  return (
    <ShoppingProvider listId={listId}>
      <ListContent />
    </ShoppingProvider>
  );
}
