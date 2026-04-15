import { useEffect, useState } from 'react';
import { postsAPI } from '../api/posts';
import PostCard from '../components/PostCard';
import { FaSpinner } from 'react-icons/fa';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-sm font-medium tracking-widest text-emerald-700 uppercase block mb-2">Community</span>
          <h1 className="text-4xl md:text-5xl font-light text-slate-800">
            Explore <span className="font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Moments</span>
          </h1>
          <p className="text-slate-500 mt-3">Travel stories shared by our community</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-slate-400" /></div>
        ) : posts.length === 0 ? (
          <p className="text-center text-slate-500">No posts yet. Be the first to share!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(p => <PostCard key={p._id} post={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
