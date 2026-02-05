import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';

const IslandCard = ({ island }) => {
  const defaultImage = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800';
  const imageUrl = island.images && island.images.length > 0
    ? island.images[0].url
    : defaultImage;

  return (
    <Link to={`/island/${island._id}`} className="group block">
      <div className="card h-full flex flex-col">
        {/* Image with overlay */}
        <div className="relative h-72 overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={island.name}
            className="w-full h-full object-cover image-hover-zoom"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Permit badge */}
          {island.status?.permitRequired !== 'None' && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20">
              Permit Required
            </div>
          )}

          {/* Location badge */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200">
            <FaMapMarkerAlt className="text-slate-600 text-xs" />
            <span className="text-xs font-medium text-slate-700">{island.location?.group || 'Unknown'}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-800 mb-1 group-hover:text-slate-600 transition-colors duration-300">
              {island.name}
            </h3>

            {island.nativeName && (
              <p className="text-sm text-slate-500 italic mb-3 font-light">{island.nativeName}</p>
            )}

            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
              {island.description?.summary || 'Discover this beautiful island...'}
            </p>
          </div>

          {/* Tags */}
          {island.vibeTags && island.vibeTags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
              {island.vibeTags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-slate-50 text-slate-600 rounded-md text-xs font-medium border border-slate-200 transition-colors hover:bg-slate-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default IslandCard;
