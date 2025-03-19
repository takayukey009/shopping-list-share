import { useShoppingContext } from '../contexts/ShoppingContext';
import { UserIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { switchRole, isRequester } = useShoppingContext();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">
          買い物リスト
        </h1>
        <button
          onClick={switchRole}
          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
            isRequester
              ? 'bg-indigo-50 text-indigo-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          <UserIcon className="w-4 h-4 mr-1.5" />
          {isRequester ? '依頼側' : '購入側'}
        </button>
      </div>
    </header>
  );
}
