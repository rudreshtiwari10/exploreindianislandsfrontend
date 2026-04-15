import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { resolveImage } from '../api/posts';

const initials = (name) => (name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?');

const PostCard = ({ post }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
    <img src={resolveImage(post.imageUrl)} alt={post.caption || 'post'} className="w-full aspect-square object-cover" />
    <div className="p-4">
      <div className="flex items-center gap-3 mb-2">
        {post.user && (
          <Link to={`/user/${post.user._id}`} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white text-xs font-bold flex items-center justify-center">
              {initials(post.user.name)}
            </div>
            <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{post.user.name}</span>
          </Link>
        )}
      </div>
      {post.caption && <p className="text-sm text-slate-600 mb-2">{post.caption}</p>}
      {post.island && (
        <Link to={`/island/${post.island._id}`} className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900">
          <FaMapMarkerAlt /> {post.island.name}
        </Link>
      )}
    </div>
  </div>
);

export default PostCard;
