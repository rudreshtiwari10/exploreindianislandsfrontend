import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { islandsAPI } from '../api/islands';
import { plannerAPI } from '../api/planner';
import { FaSpinner, FaArrowLeft, FaStar, FaMapMarkerAlt, FaTag, FaPlus } from 'react-icons/fa';

const formatFeatureTitle = (type) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

const IslandFeature = () => {
  const { id, featureType } = useParams();
  const [island, setIsland] = useState(null);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchInitial = async () => {
      try {
        setLoading(true);
        setFeatures([]);
        setError(null);

        const islandRes = await islandsAPI.getIslandById(id);
        const fetchedIsland = islandRes.data;
        if (cancelled) return;
        setIsland(fetchedIsland);

        const aiRes = await plannerAPI.getFeatureData({
          islandName: fetchedIsland.name,
          featureType: formatFeatureTitle(featureType),
          offset: 0,
          limit: 4,
        });
        if (cancelled) return;

        if (aiRes.success && aiRes.data && aiRes.data.length > 0) {
          setFeatures(aiRes.data);
          setHasMore(aiRes.hasMore !== false);
        } else {
          throw new Error(aiRes.message || 'No results returned');
        }
      } catch (err) {
        if (cancelled) return;
        console.error(err);
        const msg = err?.response?.data?.message || err.message || `Failed to fetch data for ${formatFeatureTitle(featureType)}.`;
        setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchInitial();
    return () => { cancelled = true; };
  }, [id, featureType]);

  const handleShowMore = async () => {
    if (!island || loadingMore) return;
    try {
      setLoadingMore(true);
      const aiRes = await plannerAPI.getFeatureData({
        islandName: island.name,
        featureType: formatFeatureTitle(featureType),
        offset: features.length,
        limit: 2,
      });
      if (aiRes.success && aiRes.data && aiRes.data.length > 0) {
        setFeatures(prev => [...prev, ...aiRes.data]);
        setHasMore(aiRes.hasMore !== false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Could not load more. Please try again.';
      setError(msg);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <FaSpinner className="text-emerald-500 text-2xl animate-pulse" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-slate-800 mb-4">
          Consulting our Travel Guide...
        </h2>
        <p className="text-slate-500 font-medium max-w-md animate-pulse">
          We are researching real, authentic data for {formatFeatureTitle(featureType)} 
          {island ? ` on ${island.name}` : ''}. This usually takes 4-6 seconds.
        </p>
      </div>
    );
  }

  if (error || !island) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center pt-32 px-4 text-center">
        <p className="text-rose-600 text-2xl mb-4 font-light">{error || 'Island not found'}</p>
        <Link to={`/island/${id}`} className="px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors">
          Back to Island
        </Link>
      </div>
    );
  }

  const title = formatFeatureTitle(featureType);

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Dynamic Header */}
      <div className="bg-slate-900 text-white pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <Link to={`/island/${id}`} className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8 font-medium text-sm border border-slate-700 rounded-full px-4 py-1.5">
            <FaArrowLeft /> Back to {island.name}
          </Link>
          <div className="flex items-center gap-4 text-emerald-400 mb-4">
            <FaMapMarkerAlt className="text-xl" />
            <span className="font-semibold tracking-widest uppercase text-sm">{island.name}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Authentic {title}
          </h1>
          <p className="mt-6 text-xl text-slate-300 font-light max-w-2xl leading-relaxed">
            Discover {features.length} highly recommended {title.toLowerCase()} on {island.name}, carefully curated by our travel engine.
          </p>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {features.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row group animate-fade-in-up hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              {/* Image Section */}
              <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-slate-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 via-teal-50 to-blue-100 text-emerald-700 text-4xl font-light">
                    {item.name?.charAt(0) || '?'}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-slate-900 shadow-sm">
                    {item.priceRange}
                  </span>
                  <div className="flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-white text-xs font-semibold">{item.rating}</span>
                  </div>
                </div>
              </div>

              {/* Data Section */}
              <div className="p-6 md:w-3/5 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-emerald-700 transition-colors">
                  {item.name}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-light">
                  {item.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {item.tags?.slice(0, 3).map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-600"
                    >
                      <FaTag className="text-slate-400" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show more */}
        {hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleShowMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-xl shadow-emerald-500/25 hover:scale-105 transition disabled:opacity-60 disabled:hover:scale-100"
            >
              {loadingMore ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Fetching more {title.toLowerCase()}...</span>
                </>
              ) : (
                <>
                  <FaPlus />
                  <span>Show More {title}</span>
                </>
              )}
            </button>
          </div>
        )}

        {!hasMore && features.length > 0 && (
          <p className="mt-12 text-center text-sm text-slate-400 font-light">
            You've seen everything our guide has for {title.toLowerCase()} on {island.name}.
          </p>
        )}
      </div>
    </div>
  );
};

export default IslandFeature;
