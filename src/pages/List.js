import { useParams } from 'react-router-dom';
import { ShoppingProvider } from '../contexts/ShoppingContext';
import Header from '../components/Header';
import StoreSelector from '../components/StoreSelector';
import ShoppingList from '../components/ShoppingList';
import QuickInput from '../components/QuickInput';
import TemplateItems from '../components/TemplateItems';

export default function List() {
  const { listId } = useParams();

  return (
    <ShoppingProvider listId={listId}>
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
    </ShoppingProvider>
  );
}
