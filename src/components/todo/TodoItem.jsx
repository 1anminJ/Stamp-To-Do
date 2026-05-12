import React, { useState } from 'react';
import TodoForm from './TodoForm';
import { todoService, stampService } from '../../services/storage';
import { useToast } from '../../context/ToastContext';

const priorityBadge = { HIGH: 'bg-red-100 text-danger', MEDIUM: 'bg-yellow-100 text-warning', LOW: 'bg-green-100 text-success' };
const priorityLabel = { HIGH: '높음', MEDIUM: '보통', LOW: '낮음' };

const TodoItem = ({ todo, onUpdated, onDeleted, onStampEarned }) => {
  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { addToast } = useToast();

  const handleComplete = () => {
    const updated = todoService.toggle(todo.id);
    if (updated.isCompleted) {
      const stampResult = stampService.checkAndEarn(updated.dueDate);
      if (stampResult) onStampEarned(stampResult);
    }
    onUpdated();
  };

  const handleEdit = (form) => {
    todoService.update(todo.id, form);
    onUpdated();
    setEditing(false);
    addToast('수정되었습니다.', 'success');
  };

  const handleDelete = () => {
    onDeleted(todo.id);
  };

  if (editing) return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <TodoForm
        initial={{ title: todo.title, description: todo.description || '', priority: todo.priority, dueDate: todo.dueDate, id: todo.id }}
        onSubmit={handleEdit}
        onCancel={() => setEditing(false)}
      />
    </div>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm border transition ${todo.isCompleted ? 'border-gray-100 opacity-70' : 'border-gray-200 hover:shadow-md'}`}>
      <div className="p-4 flex items-start gap-3">
        <button
          onClick={handleComplete}
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${todo.isCompleted ? 'bg-success border-success text-white' : 'border-gray-300 hover:border-primary'}`}
        >
          {todo.isCompleted && <span className="text-xs">✓</span>}
        </button>
        <div className="flex-1 min-w-0">
          <p className={`font-medium text-gray-800 ${todo.isCompleted ? 'line-through text-gray-400' : ''}`}>{todo.title}</p>
          {todo.description && <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{todo.description}</p>}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge[todo.priority]}`}>{priorityLabel[todo.priority]}</span>
            <span className="text-xs text-gray-400">{todo.dueDate}</span>
            {todo.isCompleted && <span className="text-xs text-success font-medium">✓ 완료</span>}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          {!todo.isCompleted && (
            <button onClick={() => setEditing(true)} className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-indigo-50 transition" title="수정">
              ✏️
            </button>
          )}
          <button onClick={() => setConfirmDelete(true)} className="p-1.5 text-gray-400 hover:text-danger rounded-lg hover:bg-red-50 transition" title="삭제">
            🗑️
          </button>
        </div>
      </div>
      {confirmDelete && (
        <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-between bg-red-50 rounded-b-xl">
          <p className="text-sm text-gray-700">정말 삭제하시겠습니까?</p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmDelete(false)} className="text-sm px-3 py-1 rounded-lg bg-white border border-gray-300 text-gray-600 hover:bg-gray-50">취소</button>
            <button onClick={handleDelete} className="text-sm px-3 py-1 rounded-lg bg-danger text-white hover:bg-red-600">삭제</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
