import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaRegComment, FaMapMarkerAlt, FaPaperPlane, FaTrash, FaReply } from 'react-icons/fa';
import { postsAPI, resolveImage } from '../api/posts';
import Avatar from './Avatar';

const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(d).toLocaleDateString();
};

const PostCard = ({ post: initial, onUpdate, currentUserId }) => {
  const [post, setPost] = useState(initial);
  const [commentText, setCommentText] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [busy, setBusy] = useState(false);

  const liked = currentUserId && post.likes?.some(l => (l._id || l).toString() === currentUserId);
  const visibleComments = showAll ? post.comments : (post.comments || []).slice(-2);

  const update = (p) => { setPost(p); onUpdate && onUpdate(p); };

  const onLike = async () => {
    if (!currentUserId) return alert('Please log in to like posts');
    try {
      await postsAPI.toggleLike(post._id);
      const fresh = await postsAPI.getById(post._id);
      update(fresh.data);
    } catch (e) { console.error(e); }
  };

  const onComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!currentUserId) return alert('Please log in to comment');
    setBusy(true);
    try {
      const r = await postsAPI.addComment(post._id, commentText);
      update(r.data);
      setCommentText('');
    } finally { setBusy(false); }
  };

  const onReply = async (commentId) => {
    if (!replyText.trim()) return;
    setBusy(true);
    try {
      const r = await postsAPI.addReply(post._id, commentId, replyText);
      update(r.data);
      setReplyText(''); setReplyTo(null);
    } finally { setBusy(false); }
  };

  const onDeleteComment = async (cid) => {
    if (!confirm('Delete this comment?')) return;
    await postsAPI.deleteComment(post._id, cid);
    const fresh = await postsAPI.getById(post._id);
    update(fresh.data);
  };

  const onDeleteReply = async (cid, rid) => {
    if (!confirm('Delete this reply?')) return;
    await postsAPI.deleteReply(post._id, cid, rid);
    const fresh = await postsAPI.getById(post._id);
    update(fresh.data);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {post.user && (
          <Link to={`/user/${post.user._id}`} className="flex items-center gap-3 group">
            <Avatar user={post.user} size="sm" />
            <div>
              <p className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700">{post.user.name}</p>
              <p className="text-xs text-slate-400">{timeAgo(post.createdAt)}</p>
            </div>
          </Link>
        )}
        {post.island && (
          <Link to={`/island/${post.island._id}`} className="text-xs flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium">
            <FaMapMarkerAlt /> {post.island.name}
          </Link>
        )}
      </div>

      {/* Image */}
      <img src={resolveImage(post.imageUrl)} alt={post.caption || 'post'} className="w-full aspect-square object-cover bg-slate-100" />

      {/* Actions */}
      <div className="px-4 pt-3 pb-2 flex items-center gap-4">
        <button onClick={onLike} className="flex items-center gap-1.5 text-slate-700 hover:text-rose-600 transition">
          {liked ? <FaHeart className="text-rose-600 text-lg" /> : <FaRegHeart className="text-lg" />}
          <span className="text-sm font-medium">{post.likes?.length || 0}</span>
        </button>
        <div className="flex items-center gap-1.5 text-slate-700">
          <FaRegComment className="text-lg" />
          <span className="text-sm font-medium">{post.comments?.length || 0}</span>
        </div>
      </div>

      {/* Caption */}
      {post.caption && (
        <div className="px-4 pb-2">
          <p className="text-sm text-slate-700">
            <Link to={`/user/${post.user?._id}`} className="font-semibold text-slate-900 mr-2">{post.user?.name}</Link>
            {post.caption}
          </p>
        </div>
      )}

      {/* Comments preview */}
      <div className="px-4 pb-3 space-y-2">
        {(post.comments || []).length > 2 && !showAll && (
          <button onClick={() => setShowAll(true)} className="text-xs text-slate-500 hover:text-slate-700">
            View all {post.comments.length} comments
          </button>
        )}
        {visibleComments.map(c => (
          <div key={c._id} className="text-sm">
            <div className="flex items-start gap-2 group">
              <Avatar user={c.user} size="xs" />
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 break-words">
                  <Link to={`/user/${c.user?._id}`} className="font-semibold text-slate-900 mr-1.5">{c.user?.name}</Link>
                  {c.text}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
                  <button onClick={() => { setReplyTo(c._id); setReplyText(''); }} className="text-[10px] text-slate-500 hover:text-slate-700 flex items-center gap-1">
                    <FaReply size={8} /> Reply
                  </button>
                  {(c.user?._id === currentUserId || post.user?._id === currentUserId) && (
                    <button onClick={() => onDeleteComment(c._id)} className="text-[10px] text-rose-500 hover:text-rose-700 opacity-0 group-hover:opacity-100">
                      <FaTrash size={9} />
                    </button>
                  )}
                </div>
                {/* Replies */}
                {c.replies?.length > 0 && (
                  <div className="mt-2 ml-2 space-y-1.5 border-l-2 border-slate-100 pl-3">
                    {c.replies.map(r => (
                      <div key={r._id} className="text-sm flex items-start gap-2 group/r">
                        <Avatar user={r.user} size="xs" />
                        <div className="flex-1">
                          <p className="text-slate-700 break-words">
                            <Link to={`/user/${r.user?._id}`} className="font-semibold text-slate-900 mr-1.5">{r.user?.name}</Link>
                            {r.text}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-[10px] text-slate-400">{timeAgo(r.createdAt)}</span>
                            {(r.user?._id === currentUserId || post.user?._id === currentUserId) && (
                              <button onClick={() => onDeleteReply(c._id, r._id)} className="text-[10px] text-rose-500 hover:text-rose-700 opacity-0 group-hover/r:opacity-100">
                                <FaTrash size={9} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {replyTo === c._id && (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      autoFocus
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder={`Reply to ${c.user?.name}...`}
                      className="flex-1 text-xs px-3 py-1.5 rounded-full border border-slate-200 focus:border-emerald-400 outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && onReply(c._id)}
                    />
                    <button disabled={busy} onClick={() => onReply(c._id)} className="text-emerald-600 text-xs font-semibold disabled:opacity-50">Post</button>
                    <button onClick={() => setReplyTo(null)} className="text-slate-400 text-xs">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add comment */}
      <form onSubmit={onComment} className="border-t border-slate-100 px-4 py-3 flex items-center gap-2">
        <input
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 text-sm outline-none placeholder:text-slate-400"
        />
        <button type="submit" disabled={busy || !commentText.trim()} className="text-emerald-600 disabled:text-slate-300">
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default PostCard;
