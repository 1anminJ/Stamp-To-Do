import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const ResetPasswordPage = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return addToast('유효하지 않은 링크입니다.', 'error');
    if (!passwordRegex.test(password)) return addToast('비밀번호는 최소 8자, 대소문자/숫자/특수문자를 포함해야 합니다.', 'error');
    if (password !== confirm) return addToast('비밀번호가 일치하지 않습니다.', 'error');
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      addToast('비밀번호가 변경되었습니다.', 'success');
      navigate('/login');
    } catch (err) {
      addToast(err.response?.data?.message || '오류가 발생했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🔑</div>
          <h1 className="text-2xl font-bold text-gray-800">새 비밀번호 설정</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="최소 8자, 대소문자/숫자/특수문자 포함" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm"><Link to="/login" className="text-primary hover:underline">로그인으로 돌아가기</Link></p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
