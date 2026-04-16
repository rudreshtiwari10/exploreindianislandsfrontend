import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PostUpload from '../components/PostUpload';

const NewPost = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 pt-28 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 text-sm">
          <FaArrowLeft /> Back
        </button>

        <div className="text-center mb-8">
          <span className="text-sm font-medium tracking-widest text-emerald-700 uppercase block mb-2">Create</span>
          <h1 className="text-4xl md:text-5xl font-light text-slate-800">
            New <span className="font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Post</span>
          </h1>
          <p className="text-slate-500 mt-3">Share your island moment with the community</p>
        </div>

        <PostUpload
          onPosted={() => navigate('/explore')}
          onCancel={() => navigate(-1)}
        />
      </div>
    </div>
  );
};

export default NewPost;
