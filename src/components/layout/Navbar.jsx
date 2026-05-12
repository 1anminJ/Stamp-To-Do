import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-primary shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-white font-bold text-xl flex items-center gap-2">
          <span className="text-2xl">🏅</span> Stamp To-Do
        </Link>
        {user && (
          <div className="flex items-center gap-4">
            <Link to="/" className={`text-sm font-medium px-3 py-1 rounded-full transition ${isActive('/') ? 'bg-white text-primary' : 'text-white hover:bg-white/20'}`}>할 일</Link>
            <Link to="/hall-of-fame" className={`text-sm font-medium px-3 py-1 rounded-full transition ${isActive('/hall-of-fame') ? 'bg-white text-primary' : 'text-white hover:bg-white/20'}`}>명예의 전당</Link>
            <span className="text-white/70 text-sm hidden sm:block">{user.displayName}님</span>
            <button onClick={handleLogout} className="text-sm text-white/80 hover:text-white underline">로그아웃</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
