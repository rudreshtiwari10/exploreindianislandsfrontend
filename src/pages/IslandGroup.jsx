import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { islandsAPI } from '../api/islands';
import IslandCard from '../components/IslandCard';
import { FaSpinner, FaMapMarkerAlt, FaCompass } from 'react-icons/fa';

// Static metadata for huge archipelagos
const groupMetadata = {
  'Andaman': {
    title: 'Andaman Islands',
    subtitle: 'The emerald jewels of the Bay of Bengal',
    description: 'The Andaman Islands are an Indian archipelago in the Bay of Bengal known for their palm-lined, white-sand beaches, mangroves, and tropical rainforests. Rich in colonial history and marine biodiversity, these islands offer everything from world-class scuba diving to historical tours of cellular jail.',
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600'],
    facts: ['Over 300 islands', 'Home to the Sentinelese', 'Active Volcano at Barren Island'],
  },
  'Nicobar': {
    title: 'Nicobar Islands',
    subtitle: 'India\'s unspoiled southern frontier',
    description: 'A deeply secluded chain of islands south of the Andamans. Due to strict government protection to preserve indigenous tribes and pristine biosphere reserves, most of the Nicobar islands are restricted to tourists, rendering it a mysterious and untouched paradise.',
    images: ['https://images.unsplash.com/photo-1590740685935-802525492d5c?w=1600'],
    facts: ['Great Nicobar Biosphere Reserve', 'Restricted access', 'Indira Point (Southernmost tip of India)'],
  },
  'Lakshadweep': {
    title: 'Lakshadweep',
    subtitle: 'A hundred thousand islands in the Laccadive Sea',
    description: 'Lakshadweep is a tropical archipelago of 36 atolls and coral reefs in the Laccadive Sea, off the coast of Kerala. It is renowned for its shallow, crystal-clear lagoons, stunning coral reefs, and tranquil, slow-paced island life.',
    images: ['https://images.unsplash.com/photo-1589710300187-25e4c02da82b?w=1600'],
    facts: ['Only 36 major islands', 'Coral Atolls', 'Strict permit system'],
  },
  'Offshore Mainland': {
    title: 'Offshore Mainland Islands',
    subtitle: 'Islands nestled closely to the Indian peninsula',
    description: 'These islands are scattered closely along India\'s vast coastline or within its massive river deltas. From the spiritual shores of Rameswaram to the majestic river island of Majuli, these accessible islands are deeply woven into India\'s culture.',
    images: ['https://images.unsplash.com/photo-1621886361864-1c21015f62f3?w=1600'],
    facts: ['Riverine & Coastal', 'Culturally significant', 'Highly accessible'],
  }
};

const defaultGroup = {
  title: 'Island Group',
  subtitle: 'A beautiful collective of Indian islands',
  description: 'Explore the diverse environments, vibrant communities, and natural wonders of this island group.',
  images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600'],
  facts: ['Hidden Gem', 'Diverse Ecosystem', 'Beautiful coastlines'],
};

const IslandGroup = () => {
  const { groupName } = useParams();
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Normalize groupname (e.g. "andaman" -> "Andaman")
  const normalizedGroup = Object.keys(groupMetadata).find(
    (key) => key.toLowerCase() === groupName.toLowerCase()
  ) || groupName;

  const metadata = groupMetadata[normalizedGroup] || { ...defaultGroup, title: `${groupName} Island Group` };

  useEffect(() => {
    const fetchGroupIslands = async () => {
      try {
        setLoading(true);
        // We use exact group matching filter if the API supports it
        const res = await islandsAPI.getAllIslands({ group: normalizedGroup, limit: 100 });
        setIslands(res.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch islands for this group.');
      } finally {
        setLoading(false);
      }
    };
    fetchGroupIslands();
  }, [normalizedGroup]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Hero */}
      <section className="relative h-[60vh] w-full overflow-hidden flex items-center justify-center pt-20">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url('${metadata.images[0]}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl animate-fade-in-up">
          <Link to="/islands" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 font-medium tracking-wide uppercase text-sm transition-colors">
            ← Back to All Islands
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4 text-emerald-400">
            <FaCompass className="text-2xl" />
            <span className="font-semibold tracking-[0.3em] uppercase text-sm">Island Archipelago</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {metadata.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto">
            {metadata.subtitle}
          </p>
        </div>
      </section>

      {/* Info Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center py-6 gap-6">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 text-slate-700">
                <FaMapMarkerAlt className="text-ocean-500 text-xl" />
                <span className="font-medium">{islands.length} {islands.length === 1 ? 'Island' : 'Islands'} Discovered</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {metadata.facts.map((fact, i) => (
                <span key={i} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-medium border border-slate-200 shadow-sm">
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Description */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-3xl font-light text-slate-800 mb-6">About the <span className="font-semibold">{metadata.title}</span></h2>
          <p className="text-lg text-slate-600 leading-relaxed font-light">
            {metadata.description}
          </p>
        </div>

        {/* Islands Grid */}
        <div className="mb-12 flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-bold text-slate-800">Explore Individual Islands</h2>
          <span className="text-slate-500">{islands.length} destinations</span>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-24">
            <FaSpinner className="animate-spin text-emerald-600 text-4xl mb-4" />
            <p className="text-slate-600 text-lg">Charting the islands...</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
            <p className="text-rose-600 text-xl">{error}</p>
          </div>
        ) : islands.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-2xl text-slate-800 font-medium mb-3">No islands documented yet!</h3>
            <p className="text-slate-500">Check back later as we expand our database of the {metadata.title}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {islands.map((island, index) => (
              <div 
                key={island._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <IslandCard island={island} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default IslandGroup;
