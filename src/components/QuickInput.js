import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useShoppingContext } from '../contexts/ShoppingContext';

export default function QuickInput() {
  const [input, setInput] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { addItem, currentStore, isRequester } = useShoppingContext();

  const handleQuickInput = async (input) => {
    if (!input.trim()) return;
    
    const match = input.trim().match(/^(.+?)(?:\s+(\d+))?$/);
    
    if (match) {
      setIsAdding(true);
      
      const itemName = match[1];
      const quantity = match[2] ? parseInt(match[2]) : 1;
      
      console.log('Adding item:', { name: itemName, quantity, store: currentStore });
      
      try {
        const success = await addItem({
          name: itemName,
          quantity,
          store: currentStore
        });
        
        if (success) {
          setInput('');
          console.log('Item added successfully');
        } else {
          console.error('Failed to add item');
        }
      } catch (error) {
        console.error('Error adding item:', error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleQuickInput(input);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuickInput(input);
    }
  };

  if (!isRequester) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="商品名と数量を入力（例: 牛乳 2）"
          className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isAdding}
        />
        <button
          type="submit"
          className={`inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white ${
            isAdding 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
          disabled={isAdding}
        >
          {isAdding ? (
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <PlusIcon className="h-5 w-5" />
          )}
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-500 text-center">
        ヒント: 「商品名 数量」の形式で入力できます（例: 牛乳 2）
      </div>
    </div>
  );
}
