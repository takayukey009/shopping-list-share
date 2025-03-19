import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

export default function ListItem({ item, onUpdate, onDelete }) {
  const handleToggle = () => {
    onUpdate({ ...item, completed: !item.completed });
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    onUpdate({ ...item, quantity: newQuantity });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex items-center p-4 ${item.completed ? 'bg-gray-50' : 'bg-white'}`}
    >
      <button
        onClick={handleToggle}
        className={`flex-shrink-0 ${item.completed ? 'text-green-500' : 'text-gray-400'}`}
      >
        {item.completed ? (
          <CheckCircleSolidIcon className="h-6 w-6" />
        ) : (
          <CheckCircleIcon className="h-6 w-6" />
        )}
      </button>
      
      <div className="ml-4 flex-grow">
        <p className={`text-sm font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {item.name}
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleQuantityChange(item.quantity - 1)}
          className="rounded-full w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <span className="text-lg">-</span>
        </button>
        <span className="w-8 text-center text-sm font-medium text-gray-600">
          {item.quantity}
        </span>
        <button
          onClick={() => handleQuantityChange(item.quantity + 1)}
          className="rounded-full w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <span className="text-lg">+</span>
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="text-red-500 hover:text-red-700"
        >
          削除
        </button>
      </div>
    </motion.div>
  );
}
