import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaSpinner, FaMapMarkerAlt, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { postsAPI, resolveImage, usersAPI } from '../api/posts';
import Avatar from '../components/Avatar';

const getCurrentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u._id || u.id || null;
  } catch { return null; }
};

const PublicProfile = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [following, setFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const currentUserId = getCurrentUserId();
  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    postsAPI.getByUser(id)
      .then(r => {
        setData(r.data);
        const u = r.data.user;
        setFollowers((u.followers || []).length);
        setFollowingCount((u.following || []).length);
        if (currentUserId) {
          setFollowing((u.followers || []).some(f => (f._id || f).toString() === currentUserId));
        }
      })
      .catch(() => setError('User not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const onFollow = async () => {
    if (!isLoggedIn) return alert('Please log in to follow');
    setBusy(true);
    try {
      const r = await usersAPI.toggleFollow(id);
      setFollowing(r.data.following);
      setFollowers(r.data.followersCount);
    } finally { setBusy(false); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-3xl text-slate-400" /></div>;
  if (error || !data) return <div className="min-h-screen flex items-center justify-center text-slate-500">{error}</div>;

  const { user, posts } = data;
  const isMe = currentUserId === user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-emerald-600 via-teal-700 to-blue-700"></div>
          <div className="px-8 pb-8">
            <div className="-mt-12">
              <Avatar user={user} size="xl" />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
                {user.bio && <p className="text-slate-600 text-sm mt-2 max-w-md">{user.bio}</p>}
                {user.location && <p className="text-slate-500 text-sm mt-1 flex items-center gap-1"><FaMapMarkerAlt /> {user.location}</p>}
              </div>
              {!isMe && (
                <button
                  onClick={onFollow}
                  disabled={busy}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition shadow ${
                    following
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg'
                  } disabled:opacity-50`}
                >
                  {following ? <><FaUserCheck /> Following</> : <><FaUserPlus /> Follow</>}
                </button>
              )}
            </div>

            <div className="flex gap-8 mt-6 pt-6 border-t border-slate-100">
              <div><span className="text-xl font-bold text-slate-800">{posts.length}</span> <span className="text-sm text-slate-500">posts</span></div>
              <div><span className="text-xl font-bold text-slate-800">{followers}</span> <span className="text-sm text-slate-500">followers</span></div>
              <div><span className="text-xl font-bold text-slate-800">{followingCount}</span> <span className="text-sm text-slate-500">following</span></div>
            </div>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-slate-800 mb-4">Posts</h2>
        {posts.length === 0 ? (
          <p className="text-slate-500 text-sm">No posts yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {posts.map(p => (
              <Link to={`/post/${p._id}`} key={p._id} className="relative group aspect-square overflow-hidden rounded-xl bg-slate-100 block">
                <img src={resolveImage(p.imageUrl)} alt={p.caption} className="w-full h-full object-cover group-hover:scale-105 transition" />
                {p.island && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs flex items-center gap-1"><FaMapMarkerAlt />{p.island.name}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProfile;
