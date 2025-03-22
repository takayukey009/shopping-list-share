import { useShoppingContext } from '../contexts/ShoppingContext';
import { PencilIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { switchRole, isRequester, isShopper, currentRole } = useShoppingContext();

  const handleSwitchRole = async () => {
    try {
      const success = await switchRole();
      if (success) {
        console.log('Role switched successfully');
      } else {
        console.error('Failed to switch role');
      }
    } catch (error) {
      console.error('Error switching role:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            「門」買い出しリスト
          </h1>
          <button
            onClick={handleSwitchRole}
            className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isRequester
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            {isRequester ? (
              <>
                <PencilIcon className="w-5 h-5 mr-2" />
                依頼モード
              </>
            ) : (
              <>
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                買い物モード
              </>
            )}
          </button>
        </div>
        <div className={`mt-2 text-sm ${
          isRequester
            ? 'text-indigo-600'
            : 'text-emerald-600'
        }`}>
          {isRequester ? (
            '商品の追加・編集ができます'
          ) : (
            '商品を購入したらチェックを入れてください'
          )}
        </div>
      </div>
    </header>
  );
}
