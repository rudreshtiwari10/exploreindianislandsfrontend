import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCompass, FaPlus, FaTimes, FaImage } from 'react-icons/fa';

const HIDDEN_PATHS = ['/login', '/signup', '/forgot-password'];

const FloatingActions = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  const isLoggedIn = !!localStorage.getItem('token');

  const goExplore = () => { setOpen(false); navigate('/explore'); };
  const goPost = () => {
    setOpen(false);
    navigate(isLoggedIn ? '/new-post' : '/login');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Action buttons */}
      <div
        className={`flex flex-col items-end gap-3 transition-all duration-300 ${
          open ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        <button
          onClick={goPost}
          className="group flex items-center gap-3 bg-white text-slate-800 pl-5 pr-6 py-3 rounded-full shadow-xl hover:shadow-2xl border border-slate-100 hover:scale-105 transition"
        >
          <FaImage className="text-emerald-600" />
          <span className="text-sm font-semibold">New Post</span>
        </button>
        <button
          onClick={goExplore}
          className="group flex items-center gap-3 bg-white text-slate-800 pl-5 pr-6 py-3 rounded-full shadow-xl hover:shadow-2xl border border-slate-100 hover:scale-105 transition"
        >
          <FaCompass className="text-blue-600" />
          <span className="text-sm font-semibold">Explore Feed</span>
        </button>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open quick actions"
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl transition-all duration-300 ${
          open ? 'bg-slate-800 rotate-45' : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:scale-110'
        }`}
        style={{ boxShadow: '0 10px 30px rgba(16,185,129,0.45)' }}
      >
        {open ? <FaTimes /> : <FaPlus />}
      </button>
    </div>
  );
};

export default FloatingActions;
