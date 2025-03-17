import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/solid';
import { useShoppingContext } from '../contexts/ShoppingContext';

export default function QuickInput() {
  const [input, setInput] = useState('');
  const { addItem, currentStore } = useShoppingContext();

  const handleQuickInput = (input) => {
    if (!input.trim()) return;
    
    const match = input.trim().match(/^(.+?)(?:\s+(\d+))?$/);
    
    if (match) {
      const itemName = match[1];
      const quantity = match[2] ? parseInt(match[2]) : 1;
      
      addItem({
        name: itemName,
        quantity,
        store: currentStore
      });
      setInput('');
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
        />
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </form>
      <div className="mt-2 text-xs text-gray-500 text-center">
        ヒント: 「商品名 数量」の形式で入力できます（例: 牛乳 2）
      </div>
    </div>
  );
}
