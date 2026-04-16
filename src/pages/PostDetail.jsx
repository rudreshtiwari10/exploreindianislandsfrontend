import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaArrowLeft } from 'react-icons/fa';
import { postsAPI } from '../api/posts';
import PostCard from '../components/PostCard';

const getCurrentUserId = () => {
  try {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    return u._id || u.id || null;
  } catch { return null; }
};

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = getCurrentUserId();

  useEffect(() => {
    postsAPI.getById(id)
      .then(r => setPost(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><FaSpinner className="animate-spin text-3xl text-slate-400" /></div>;
  if (!post) return <div className="min-h-screen flex items-center justify-center text-slate-500">Post not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm">
          <FaArrowLeft /> Back
        </button>
        <PostCard post={post} currentUserId={currentUserId} onUpdate={setPost} />
      </div>
    </div>
  );
};

export default PostDetail;
