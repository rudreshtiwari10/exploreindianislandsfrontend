import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';
import { postsAPI, resolveImage } from '../api/posts';

const initials = (n) => (n ? n.split(' ').map(x => x[0]).join('').toUpperCase().slice(0, 2) : '?');

const PublicProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    postsAPI.getByUser(id)
      .then(r => setData(r.data))
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-3xl text-slate-400" /></div>;
  if (error || !data) return <div className="min-h-screen flex items-center justify-center text-slate-500">{error}</div>;

  const { user, posts } = data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600"></div>
          <div className="px-8 pb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg -mt-12">
              {initials(user.name)}
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mt-4">{user.name}</h1>
            {user.bio && <p className="text-slate-600 text-sm mt-2 max-w-md">{user.bio}</p>}
            {user.location && <p className="text-slate-500 text-sm mt-1 flex items-center gap-1"><FaMapMarkerAlt /> {user.location}</p>}
            <p className="text-slate-400 text-xs mt-3">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-slate-500 text-sm">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {posts.map(p => (
              <div key={p._id} className="relative group aspect-square overflow-hidden rounded-xl bg-slate-100">
                <img src={resolveImage(p.imageUrl)} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition" />
                {p.island && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs flex items-center gap-1"><FaMapMarkerAlt />{p.island.name}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
