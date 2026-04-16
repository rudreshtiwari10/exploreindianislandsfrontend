import { resolveImage } from '../api/posts';

const colors = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-violet-500 to-purple-600',
];

const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const colorFor = (name) => {
  if (!name) return colors[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return colors[h % colors.length];
};

const sizes = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-9 h-9 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-xl',
  xl: 'w-28 h-28 text-3xl',
};

const Avatar = ({ user, size = 'md', className = '' }) => {
  const sz = sizes[size] || sizes.md;
  if (user?.avatar) {
    return (
      <img
        src={resolveImage(user.avatar)}
        alt={user.name || 'user'}
        className={`${sz} rounded-full object-cover border-2 border-white shadow ${className}`}
      />
    );
  }
  return (
    <div
      className={`${sz} rounded-full bg-gradient-to-br ${colorFor(user?.name)} text-white font-bold flex items-center justify-center border-2 border-white shadow ${className}`}
    >
      {getInitials(user?.name)}
    </div>
  );
};

export default Avatar;
