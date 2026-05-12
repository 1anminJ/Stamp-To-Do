import React, { useState, useEffect } from 'react';

const today = () => new Date().toISOString().split('T')[0];

const TodoForm = ({ initial, onSubmit, onCancel, loading }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: today(),
    ...initial,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initial) setForm(f => ({ ...f, ...initial }));
  }, [initial]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = '제목을 입력하세요.';
    else if (form.title.length > 100) e.title = '제목은 100자 이내여야 합니다.';
    if (form.description && form.description.length > 500) e.description = '설명은 500자 이내여야 합니다.';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) return setErrors(e2);
    onSubmit(form);
  };

  const priorityLabels = { HIGH: '높음', MEDIUM: '보통', LOW: '낮음' };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
        <input name="title" value={form.title} onChange={handleChange} maxLength={100}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? 'border-danger' : 'border-gray-300'}`}
          placeholder="할 일을 입력하세요" />
        {errors.title && <p className="text-xs text-danger mt-1">{errors.title}</p>}
        <p className="text-xs text-gray-400 mt-1 text-right">{form.title.length}/100</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3} maxLength={500}
          className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none ${errors.description ? 'border-danger' : 'border-gray-300'}`}
          placeholder="상세 내용을 입력하세요 (선택)" />
        {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
        <p className="text-xs text-gray-400 text-right">{(form.description || '').length}/500</p>
      </div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
          <select name="priority" value={form.priority} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
            {Object.entries(priorityLabels).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">날짜</label>
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="flex-1 bg-primary text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
          {loading ? '저장 중...' : (initial?.id ? '수정하기' : '추가하기')}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-200 transition">
            취소
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
