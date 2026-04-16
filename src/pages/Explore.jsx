import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { postsAPI } from '../api/posts';
import PostCard from '../components/PostCard';
import { FaSpinner, FaPlus } from 'react-icons/fa';

const getCurrentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u._id || u.id || null;
  } catch { return null; }
};

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem('token');
  const currentUserId = getCurrentUserId();

  const load = () => {
    postsAPI.getAll().then(r => setPosts(r.data || [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-32 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-sm font-medium tracking-widest text-emerald-700 uppercase block mb-2">Community Feed</span>
          <h1 className="text-4xl md:text-5xl font-light text-slate-800">
            Explore <span className="font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Moments</span>
          </h1>
          <p className="text-slate-500 mt-3">Travel stories shared by our community</p>
        </div>

        {/* Share CTA */}
        <Link
          to={isLoggedIn ? '/new-post' : '/login'}
          className="mb-6 w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl py-4 px-6 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.01] transition font-semibold"
        >
          <FaPlus /> {isLoggedIn ? 'Share your island moment' : 'Log in to share your moments'}
        </Link>

        {loading ? (
          <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-slate-400" /></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-500">No posts yet. Be the first to share!</p>
        ) : (
          <div className="space-y-6">
            {posts.map(p => (
              <PostCard
                key={p._id}
                post={p}
                currentUserId={currentUserId}
                onUpdate={(updated) => setPosts(posts.map(x => x._id === updated._id ? updated : x))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
