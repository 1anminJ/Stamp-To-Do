import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [displayName, setDisplayName] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    login(displayName);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
        <div className="text-6xl mb-4">🏅</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Stamp To-Do</h1>
        <p className="text-gray-500 text-sm mb-8">할 일을 완료하고 스탬프를 모아보세요!</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">닉네임</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              required
              maxLength={20}
              placeholder="이름 또는 닉네임 입력"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={!displayName.trim()}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed text-lg"
          >
            시작하기 🚀
          </button>
        </form>

        <p className="text-xs text-gray-400 mt-6">
          데이터는 이 브라우저에만 저장됩니다
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
