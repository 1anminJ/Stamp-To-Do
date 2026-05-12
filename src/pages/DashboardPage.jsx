import React, { useState, useEffect, useCallback } from 'react';
import { todoAPI, stampAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import TodoForm from '../components/todo/TodoForm';
import TodoItem from '../components/todo/TodoItem';
import StampProgress from '../components/stamps/StampProgress';
import CelebrationModal from '../components/stamps/CelebrationModal';

const today = () => new Date().toISOString().split('T')[0];

const DashboardPage = () => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [todos, setTodos] = useState([]);
  const [stamp, setStamp] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('createdAt');
  const [selectedDate, setSelectedDate] = useState(today());
  const [pageLoading, setPageLoading] = useState(true);
  const [celebration, setCelebration] = useState(false);

  const fetchTodos = useCallback(async () => {
    try {
      const params = { date: selectedDate };
      if (filter !== 'all') params.filter = filter;
      if (sort === 'priority') params.sort = 'priority';
      const { data } = await todoAPI.getAll(params);
      setTodos(data);
    } catch {
      addToast('할 일 목록을 불러오지 못했습니다.', 'error');
    }
  }, [selectedDate, filter, sort]);

  const fetchStamp = useCallback(async () => {
    try {
      const { data } = await stampAPI.getCurrent();
      setStamp(data);
    } catch {}
  }, []);

  useEffect(() => {
    setPageLoading(true);
    Promise.all([fetchTodos(), fetchStamp()]).finally(() => setPageLoading(false));
  }, [fetchTodos, fetchStamp]);

  const handleCreate = async (form) => {
    setFormLoading(true);
    try {
      const { data } = await todoAPI.create(form);
      setTodos(prev => [data, ...prev]);
      setShowForm(false);
      addToast('할 일이 추가되었습니다! ✅', 'success');
    } catch (err) {
      addToast(err.response?.data?.message || '추가에 실패했습니다.', 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdated = (updatedTodo) => {
    setTodos(prev => prev.map(t => t.id === updatedTodo.id ? updatedTodo : t));
    fetchStamp();
  };

  const handleDeleted = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleStampEarned = (stampResult) => {
    fetchStamp();
    if (stampResult.hallOfFame) {
      setCelebration(true);
    } else if (stampResult.earned) {
      addToast(stampResult.message, 'success');
    }
  };

  const completedCount = todos.filter(t => t.isCompleted).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* 인사 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">안녕하세요, {user?.displayName}님! 👋</h2>
          <p className="text-gray-500 text-sm mt-1">오늘도 할 일을 완료하고 스탬프를 모아보세요</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* 왼쪽: 스탬프 + 통계 */}
          <div className="lg:col-span-1 space-y-4">
            <StampProgress stampCount={stamp?.stampCount} />

            {/* 오늘의 진행률 */}
            {totalCount > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="text-xl">📊</span> 오늘의 진행률
                </h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-primary">{completedCount}</span>
                  <span className="text-gray-400 text-lg mb-0.5">/ {totalCount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div className="bg-success h-2 rounded-full transition-all duration-500"
                    style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }} />
                </div>
                <p className="text-xs text-gray-500 text-right">
                  {totalCount ? Math.round((completedCount / totalCount) * 100) : 0}% 완료
                </p>
              </div>
            )}
          </div>

          {/* 오른쪽: 할 일 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 헤더 + 컨트롤 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">날짜 선택</label>
                  <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full" />
                </div>
                <div className="flex gap-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">필터</label>
                    <select value={filter} onChange={e => setFilter(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="all">전체</option>
                      <option value="pending">미완료</option>
                      <option value="completed">완료</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">정렬</label>
                    <select value={sort} onChange={e => setSort(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="createdAt">최신순</option>
                      <option value="priority">우선순위</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 추가 버튼 */}
            {!showForm ? (
              <button onClick={() => setShowForm(true)}
                className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2">
                <span className="text-xl">+</span> 새 할 일 추가
              </button>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-700 mb-4">새 할 일</h3>
                <TodoForm
                  initial={{ dueDate: selectedDate }}
                  onSubmit={handleCreate}
                  onCancel={() => setShowForm(false)}
                  loading={formLoading}
                />
              </div>
            )}

            {/* 할 일 목록 */}
            {pageLoading ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">⏳</div>
                <p>불러오는 중...</p>
              </div>
            ) : todos.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-200">
                <div className="text-5xl mb-3">📝</div>
                <p className="font-medium text-gray-600">할 일이 없습니다</p>
                <p className="text-sm mt-1">새 할 일을 추가해보세요!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todos.map(todo => (
                  <TodoItem key={todo.id} todo={todo}
                    onUpdated={handleUpdated}
                    onDeleted={handleDeleted}
                    onStampEarned={handleStampEarned} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <CelebrationModal show={celebration} onClose={() => setCelebration(false)} />
    </div>
  );
};

export default DashboardPage;
