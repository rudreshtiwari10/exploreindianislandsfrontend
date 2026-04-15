import { useEffect, useState } from 'react';
import { FaImage, FaUpload } from 'react-icons/fa';
import { islandsAPI } from '../api/islands';
import { postsAPI } from '../api/posts';

const PostUpload = ({ onPosted }) => {
  const [islands, setIslands] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [islandId, setIslandId] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    islandsAPI.getAllIslands().then(r => setIslands(r.data || [])).catch(() => {});
  }, []);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!image) return setError('Please choose an image');
    setBusy(true);
    try {
      await postsAPI.create({ image, caption, island: islandId });
      setImage(null); setPreview(''); setCaption(''); setIslandId('');
      onPosted && onPosted();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <FaImage className="text-slate-500" /> Share a moment
      </h2>

      <label className="block">
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center cursor-pointer hover:border-slate-400 transition">
          {preview ? (
            <img src={preview} alt="preview" className="max-h-64 mx-auto rounded-lg" />
          ) : (
            <div className="text-slate-400 text-sm">Click to choose an image (max 5MB)</div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </label>

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write a caption..."
        rows={2}
        maxLength={500}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none text-sm resize-none"
      />

      <select
        value={islandId}
        onChange={(e) => setIslandId(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none text-sm"
      >
        <option value="">Tag an island (optional)</option>
        {islands.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
      </select>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 disabled:opacity-50"
      >
        <FaUpload /> {busy ? 'Posting...' : 'Post'}
      </button>
    </form>
  );
};

export default PostUpload;
