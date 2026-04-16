import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaPlane } from 'react-icons/fa';

const IslandCard = ({ island }) => {
  const navigate = useNavigate();
  const defaultImage = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800';
  const imageUrl = island.images && island.images.length > 0
    ? island.images[0].url
    : defaultImage;

  const handleCardClick = () => {
    navigate(`/island/${island._id}`);
  };

  const handlePlanTripClick = (e) => {
    e.stopPropagation();
    navigate(`/plan-trip?islandId=${island._id}`);
  };

  return (
    <div onClick={handleCardClick} className="group block cursor-pointer">
      <div className="card h-full flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100">
        {/* Image with overlay */}
        <div className="relative h-72 overflow-hidden bg-slate-100">
          <img
            src={imageUrl}
            alt={island.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Permit badge */}
          {island.status?.permitRequired !== 'None' && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-800/80 backdrop-blur-sm text-white text-xs font-medium rounded-full border border-white/20 shadow-sm">
              Permit Required
            </div>
          )}

          {/* Location badge */}
          <button 
            onClick={(e) => { e.stopPropagation(); navigate(`/group/${encodeURIComponent(island.location?.group || '')}`); }}
            className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full border border-slate-200 shadow-sm transition-colors group/badge"
          >
            <FaMapMarkerAlt className="text-slate-600 text-xs group-hover/badge:text-emerald-600 transition-colors" />
            <span className="text-xs font-medium text-slate-700 group-hover/badge:text-emerald-700">{island.location?.group || 'Unknown'}</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-800 mb-1 group-hover:text-ocean-600 transition-colors duration-300">
              {island.name}
            </h3>

            {island.nativeName && (
              <p className="text-sm text-slate-500 italic mb-3 font-light">{island.nativeName}</p>
            )}

            <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4">
              {island.description?.summary || 'Discover this beautiful island...'}
            </p>
          </div>

          {/* Tags & Action */}
          <div className="pt-4 border-t border-slate-100 mt-auto">
            {island.vibeTags && island.vibeTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {island.vibeTags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-md text-[11px] font-medium border border-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <button 
              onClick={handlePlanTripClick}
              className="w-full py-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-700 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all duration-300 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 group-hover:shadow-md"
            >
              <FaPlane /> Plan a Trip Here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IslandCard;
