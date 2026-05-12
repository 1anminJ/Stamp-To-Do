import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      addToast('로그인 성공!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || '로그인에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏅</div>
          <h1 className="text-2xl font-bold text-gray-800">Stamp To-Do</h1>
          <p className="text-gray-500 text-sm mt-1">로그인하여 오늘의 할 일을 관리하세요</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="비밀번호 입력" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
          <p><Link to="/forgot-password" className="text-primary hover:underline">비밀번호를 잊으셨나요?</Link></p>
          <p>계정이 없으신가요? <Link to="/register" className="text-primary font-medium hover:underline">회원가입</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
