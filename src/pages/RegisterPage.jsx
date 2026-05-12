import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const getPasswordStrength = (pw) => {
  if (!pw) return { level: 0, label: '' };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[@$!%*?&]/.test(pw)) score++;
  if (score <= 2) return { level: 1, label: '약함', color: 'bg-danger' };
  if (score <= 3) return { level: 2, label: '보통', color: 'bg-warning' };
  return { level: 3, label: '강함', color: 'bg-success' };
};

const RegisterPage = () => {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', displayName: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const strength = getPasswordStrength(form.password);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRegex.test(form.password)) return addToast('비밀번호는 최소 8자, 대소문자/숫자/특수문자를 포함해야 합니다.', 'error');
    if (form.password !== form.confirmPassword) return addToast('비밀번호가 일치하지 않습니다.', 'error');
    setLoading(true);
    try {
      await register(form.email, form.password, form.displayName);
      addToast('회원가입 성공! 환영합니다!', 'success');
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.message || '회원가입에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🏅</div>
          <h1 className="text-2xl font-bold text-gray-800">회원가입</h1>
          <p className="text-gray-500 text-sm mt-1">Stamp To-Do를 시작해보세요!</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
            <input name="displayName" value={form.displayName} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="홍길동" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="최소 8자, 대소문자/숫자/특수문자 포함" />
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />
                  ))}
                </div>
                <p className="text-xs mt-1 text-gray-500">비밀번호 강도: <span className="font-medium">{strength.label}</span></p>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호 확인</label>
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary" placeholder="비밀번호 재입력" />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-xs text-danger mt-1">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60">
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          이미 계정이 있으신가요? <Link to="/login" className="text-primary font-medium hover:underline">로그인</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
