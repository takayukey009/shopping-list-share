import { useParams } from 'react-router-dom';
import { ShoppingProvider } from '../contexts/ShoppingContext';
import Header from '../components/Header';
import StoreSelector from '../components/StoreSelector';
import ShoppingStatus from '../components/ShoppingStatus';
import ShoppingList from '../components/ShoppingList';
import TemplateItems from '../components/TemplateItems';
import QuickInput from '../components/QuickInput';

export default function ShoppingListPage() {
  const { listId } = useParams();

  return (
    <ShoppingProvider listId={listId}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-3xl mx-auto pb-24">
          <StoreSelector />
          <div className="p-4">
            <ShoppingStatus />
            <TemplateItems />
            <ShoppingList />
          </div>
        </main>
        <QuickInput />
      </div>
    </ShoppingProvider>
  );
}
