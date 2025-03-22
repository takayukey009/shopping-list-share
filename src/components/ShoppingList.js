import { useState, useEffect } from 'react';
import { useShoppingContext } from '../contexts/ShoppingContext';
import { TrashIcon, MinusIcon, PlusIcon, CheckIcon, PencilIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// ソータブルアイテムコンポーネント
function SortableItem({ id, item, itemId, store, isRequester, isShopper, onToggleComplete, onQuantityChange, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className={`bg-white rounded-lg shadow-sm border transition-all duration-200 ${
        item.completed ? 'border-green-200' : 'border-gray-200'
      }`}
    >
      <div className="p-4 flex items-center gap-3">
        {isRequester && !item.completed && (
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>
        )}

        {(isShopper || item.completed) && (
          <button
            onClick={() => onToggleComplete(itemId, item.completed)}
            className={`flex-none w-6 h-6 rounded-full border-2 transition-colors duration-200 flex items-center justify-center ${
              item.completed 
                ? 'border-green-500 bg-green-500 text-white' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {item.completed && <CheckIcon className="w-4 h-4" />}
          </button>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-lg font-medium truncate ${
            item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {item.name}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isRequester && !item.completed && (
            <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200">
              <button
                onClick={() => onQuantityChange(itemId, item.quantity, -1)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-medium text-gray-900">
                {item.quantity}
              </span>
              <button
                onClick={() => onQuantityChange(itemId, item.quantity, 1)}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
          )}
          {(!isRequester || item.completed) && (
            <span className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-200 font-medium text-gray-900">
              {item.quantity}
            </span>
          )}
          
          {isRequester && !item.completed && (
            <>
              <button
                onClick={() => onEdit(store, itemId, item)}
                className="p-2 text-gray-400 hover:text-blue-500 transition-colors duration-200"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(itemId)}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// 編集モーダル
function EditItemModal({ item, onSave, onCancel }) {
  const [name, setName] = useState(item?.name || '');

  useEffect(() => {
    if (item) {
      setName(item.name);
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name);
    }
  };

  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-medium text-gray-900 mb-4">アイテムを編集</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 mb-4"
            placeholder="商品名"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ShoppingList() {
  const { 
    items, 
    currentStore, 
    updateItem, 
    deleteItem,
    reorderItems,
    isRequester,
    isShopper,
    stores,
    editingItem,
    editItem,
    cancelEdit,
    saveEdit
  } = useShoppingContext();

  const storeItems = items[currentStore] || {};
  const storeName = stores[currentStore]?.name || '';

  // ソート済みアイテムの状態
  const [sortedItems, setSortedItems] = useState([]);

  // DnDセンサー
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // アイテムのソート
  useEffect(() => {
    const itemEntries = Object.entries(storeItems);
    
    // 完了状態と順序でソート
    const sorted = itemEntries.sort((a, b) => {
      // 完了していないアイテムを先に表示
      if (a[1].completed !== b[1].completed) {
        return a[1].completed ? 1 : -1;
      }
      // 順序でソート（小さい順）
      return (a[1].order || 0) - (b[1].order || 0);
    });
    
    setSortedItems(sorted);
  }, [storeItems]);

  const handleQuantityChange = (itemId, currentQuantity, increment) => {
    const newQuantity = Math.max(1, currentQuantity + increment);
    updateItem(currentStore, itemId, { quantity: newQuantity });
  };

  const handleToggleComplete = (itemId, currentCompleted) => {
    updateItem(currentStore, itemId, { completed: !currentCompleted });
  };

  const handleDelete = (itemId) => {
    deleteItem(currentStore, itemId);
  };

  const handleEdit = (store, itemId, item) => {
    editItem(store, itemId, item);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      // ドラッグ&ドロップされたアイテムのインデックスを取得
      const activeIndex = sortedItems.findIndex(([id]) => id === active.id);
      const overIndex = sortedItems.findIndex(([id]) => id === over.id);
      
      // 未完了アイテムのみを対象にする
      const incompleteItems = sortedItems.filter(([_, item]) => !item.completed);
      const activeIncompleteIndex = incompleteItems.findIndex(([id]) => id === active.id);
      const overIncompleteIndex = incompleteItems.findIndex(([id]) => id === over.id);
      
      if (activeIncompleteIndex !== -1 && overIncompleteIndex !== -1) {
        // ローカルの状態を更新
        const newItems = arrayMove(sortedItems, activeIndex, overIndex);
        setSortedItems(newItems);
        
        // Firebaseの状態を更新
        reorderItems(currentStore, activeIncompleteIndex, overIncompleteIndex);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 py-2">
        <h2 className="text-lg font-medium text-gray-900">
          {storeName}の買い物リスト
        </h2>
        <span className="text-sm text-gray-500">
          {Object.keys(storeItems).length}個のアイテム
        </span>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortedItems.map(([id]) => id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {sortedItems.map(([id, item]) => (
              <SortableItem
                key={id}
                id={id}
                item={item}
                itemId={id}
                store={currentStore}
                isRequester={isRequester}
                isShopper={isShopper}
                onToggleComplete={handleToggleComplete}
                onQuantityChange={handleQuantityChange}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </AnimatePresence>
        </SortableContext>
      </DndContext>
      
      {Object.keys(storeItems).length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            まだアイテムがありません
          </p>
          {isRequester && (
            <p className="text-sm text-gray-400 mt-1">
              下のフォームから商品を追加してください
            </p>
          )}
        </div>
      )}

      {/* 編集モーダル */}
      {editingItem && (
        <EditItemModal
          item={editingItem.item}
          onSave={saveEdit}
          onCancel={cancelEdit}
        />
      )}
    </div>
  );
}
