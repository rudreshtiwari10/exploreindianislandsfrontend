import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { islandsAPI } from '../api/islands';
import IslandCard from './IslandCard';
import { FaSpinner, FaArrowRight } from 'react-icons/fa';

const FeaturedIslands = () => {
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIslands = async () => {
      try {
        setLoading(true);
        const response = await islandsAPI.getAllIslands();
        setIslands(response.data.slice(0, 6));
        setError(null);
      } catch (err) {
        setError('Failed to load islands. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIslands();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-40 bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50">
        <div className="w-20 h-20 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-600 text-lg font-light">Loading islands...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-32 bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50">
        <p className="text-slate-700 text-xl font-light">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-32 bg-gradient-to-br from-blue-50/50 via-slate-50 to-emerald-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-24 animate-fade-in-up">
          <span className="text-sm font-medium tracking-widest text-blue-600 uppercase mb-4 block">Discover</span>
          <h2 className="text-5xl md:text-6xl font-light text-slate-800 mb-6 tracking-tight">
            Featured <span className="font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Islands</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Handpicked destinations showcasing India's natural beauty
          </p>
        </div>

        {islands.length === 0 ? (
          <div className="text-center py-32 bg-white/60 backdrop-blur-sm rounded-3xl">
            <p className="text-slate-700 text-xl font-light">No islands found yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20 animate-fade-in-up-delayed">
              {islands.map((island, index) => (
                <div
                  key={island._id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-fade-in-up"
                >
                  <IslandCard island={island} />
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                to="/islands"
                className="inline-flex items-center gap-3 btn-primary text-base group"
              >
                Explore All Islands
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedIslands;
