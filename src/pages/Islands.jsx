import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { islandsAPI } from '../api/islands';
import IslandCard from '../components/IslandCard';
import { FaSpinner } from 'react-icons/fa';

const Islands = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(searchParams.get('group') || '');
  const [selectedVibe, setSelectedVibe] = useState(searchParams.get('vibe') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const islandGroups = ['All', 'Andaman', 'Nicobar', 'Lakshadweep', 'Arabian Sea', 'Offshore Mainland', 'River Island', 'Other'];
  const vibes = ['All', 'Scuba', 'Quiet', 'Historical', 'Bird Watching', 'Adventure', 'Romantic', 'Beach', 'Coral'];

  useEffect(() => {
    const fetchIslands = async () => {
      try {
        setLoading(true);
        const params = { limit: 200 };
        if (selectedGroup && selectedGroup !== 'All') params.group = selectedGroup;
        if (selectedVibe && selectedVibe !== 'All') params.vibe = selectedVibe;
        if (searchQuery) params.search = searchQuery;

        const response = await islandsAPI.getAllIslands(params);
        setIslands(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load islands. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIslands();
  }, [selectedGroup, selectedVibe, searchQuery]);

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
    if (group === 'All') {
      searchParams.delete('group');
    } else {
      searchParams.set('group', group);
    }
    setSearchParams(searchParams);
  };

  const handleVibeChange = (vibe) => {
    setSelectedVibe(vibe);
    if (vibe === 'All') {
      searchParams.delete('vibe');
    } else {
      searchParams.set('vibe', vibe);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24 animate-fade-in-up">
          <span className="text-sm font-medium tracking-wider text-slate-500 uppercase mb-3 block">Browse</span>
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-4 tracking-tight">
            {searchQuery ? (
              <>Search Results for <span className="font-semibold italic">"{searchQuery}"</span></>
            ) : (
              <>All <span className="font-semibold">Islands</span></>
            )}
          </h1>
          <p className="text-lg text-slate-600 font-light">
            {loading ? 'Loading...' : `${islands.length} destination${islands.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-10 mb-20 animate-fade-in-up-delayed border border-white/60">
          {/* Island Group Filter */}
          <div className="mb-12">
            <h3 className="text-sm font-medium text-slate-700 mb-4 tracking-wide uppercase">Location</h3>
            <div className="flex flex-wrap gap-2">
              {islandGroups.map((group) => (
                <button
                  key={group}
                  onClick={() => handleGroupChange(group)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    (selectedGroup === group || (group === 'All' && !selectedGroup))
                      ? 'bg-slate-800 text-white shadow-lg scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe Filter */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-4 tracking-wide uppercase">Experience</h3>
            <div className="flex flex-wrap gap-2">
              {vibes.map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => handleVibeChange(vibe)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    (selectedVibe === vibe || (vibe === 'All' && !selectedVibe))
                      ? 'bg-slate-700 text-white shadow-lg scale-105'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-40">
            <div className="w-20 h-20 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin mb-6"></div>
            <p className="text-slate-600 text-lg font-light">Finding perfect islands...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-32 bg-white/60 backdrop-blur-sm rounded-3xl">
            <p className="text-slate-700 text-xl font-light">{error}</p>
          </div>
        )}

        {/* Islands Grid */}
        {!loading && !error && (
          <>
            {islands.length === 0 ? (
              <div className="text-center py-32 bg-white/60 backdrop-blur-sm rounded-3xl">
                <p className="text-slate-700 text-xl font-light mb-6">
                  No islands match your criteria.
                </p>
                <p className="text-slate-500">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {islands.map((island, index) => (
                  <div
                    key={island._id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-fade-in-up"
                  >
                    <IslandCard island={island} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Islands;
