import { useEffect, useMemo, useRef, useState } from 'react';
import { FaImage, FaUpload, FaTimes, FaSearch, FaMapMarkerAlt, FaCheck } from 'react-icons/fa';
import { islandsAPI } from '../api/islands';
import { postsAPI } from '../api/posts';

const PostUpload = ({ onPosted, onCancel }) => {
  const [islands, setIslands] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedIsland, setSelectedIsland] = useState(null);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    islandsAPI.getAllIslands({ limit: 2000 }).then(r => setIslands(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return islands.slice(0, 30);
    return islands.filter(i =>
      i.name?.toLowerCase().includes(q) ||
      i.nativeName?.toLowerCase().includes(q) ||
      i.location?.group?.toLowerCase().includes(q)
    ).slice(0, 30);
  }, [search, islands]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const pickIsland = (i) => {
    setSelectedIsland(i);
    setSearch('');
    setShowDropdown(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!image) return setError('Please choose an image');
    setBusy(true);
    try {
      await postsAPI.create({ image, caption, island: selectedIsland?._id || '' });
      setImage(null); setPreview(''); setCaption(''); setSelectedIsland(null); setSearch('');
      onPosted && onPosted();
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <FaImage className="text-emerald-600" /> Share a moment
        </h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-700 p-1">
            <FaTimes />
          </button>
        )}
      </div>

      <label className="block">
        <div className="border-2 border-dashed border-emerald-200 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition">
          {preview ? (
            <img src={preview} alt="preview" className="max-h-72 mx-auto rounded-lg" />
          ) : (
            <div className="text-slate-500 text-sm">
              <FaUpload className="mx-auto text-2xl text-emerald-500 mb-2" />
              Click to choose an image (max 5MB)
            </div>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </label>

      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Write a caption..."
        rows={3}
        maxLength={500}
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm resize-none"
      />

      {/* Island search combobox */}
      <div ref={dropdownRef} className="relative">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Tag an Island (optional)
        </label>

        {selectedIsland ? (
          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-emerald-200 bg-emerald-50">
            <div className="flex items-center gap-2 text-emerald-800">
              <FaMapMarkerAlt />
              <div>
                <p className="text-sm font-semibold">{selectedIsland.name}</p>
                <p className="text-xs text-emerald-600/70">{selectedIsland.location?.group}</p>
              </div>
            </div>
            <button type="button" onClick={() => setSelectedIsland(null)} className="text-emerald-700 hover:text-emerald-900 p-1">
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Search islands by name..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none text-sm"
            />
          </div>
        )}

        {showDropdown && !selectedIsland && (
          <div className="absolute z-20 left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-72 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-slate-500">No islands found</div>
            ) : (
              filtered.map(i => (
                <button
                  key={i._id}
                  type="button"
                  onClick={() => pickIsland(i)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-emerald-50 transition text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-800">{i.name}</p>
                    <p className="text-xs text-slate-500">{i.location?.group}</p>
                  </div>
                  <FaCheck className="text-emerald-500 opacity-0" />
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl hover:shadow-lg disabled:opacity-50 transition"
      >
        <FaUpload /> {busy ? 'Posting...' : 'Share Post'}
      </button>
    </form>
  );
};

export default PostUpload;
