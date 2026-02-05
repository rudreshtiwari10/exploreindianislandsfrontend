import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { islandsAPI } from '../api/islands';
import IslandCard from '../components/IslandCard';
import { FaSpinner, FaSearch, FaExclamationTriangle } from 'react-icons/fa';

// List of known Indian islands for validation
const KNOWN_ISLANDS = [
  'havelock', 'neil', 'ross', 'smith', 'long', 'barren', 'narcondam',
  'little andaman', 'great nicobar', 'car nicobar', 'katchal', 'camorta',
  'agatti', 'bangaram', 'kavaratti', 'kadmat', 'kalpeni', 'minicoy',
  'diu', 'elephanta', 'majuli', 'sriharikota', 'munroe', 'willingdon',
  'butcher', 'chorao', 'divar', 'swaraj', 'shaheed', 'rameswaram',
  'pamban', 'mannar', 'alibag', 'andaman', 'nicobar', 'lakshadweep'
];

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [islands, setIslands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValidIsland, setIsValidIsland] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setLoading(false);
        return;
      }

      // Validate if the search term seems like an island name
      const queryLower = searchQuery.toLowerCase();
      const looksLikeIsland = KNOWN_ISLANDS.some(island =>
        queryLower.includes(island) || island.includes(queryLower)
      ) || queryLower.includes('island') || queryLower.includes('dweep');

      setIsValidIsland(looksLikeIsland);

      try {
        setLoading(true);
        const response = await islandsAPI.searchIslands(searchQuery);
        setIslands(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to search islands. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-32 pb-12 flex justify-center items-center">
        <FaSpinner className="animate-spin text-ocean-600 text-5xl" />
      </div>
    );
  }

  if (!searchQuery.trim()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-32 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FaSearch className="text-6xl text-gray-400 mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Search Islands</h1>
          <p className="text-xl text-gray-600">Enter an island name to start searching</p>
          <Link to="/" className="inline-block mt-8 btn-primary">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  // Island not found but query seems valid
  if (islands.length === 0 && isValidIsland) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-ocean-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaSearch className="text-ocean-600 text-4xl" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {searchQuery}
            </h1>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 text-left">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-yellow-400 text-2xl mr-4 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Information Not Available Yet
                  </h3>
                  <p className="text-gray-700">
                    We don't have information about <strong>{searchQuery}</strong> yet, but we're constantly
                    updating our database with more islands. This island will be added soon!
                  </p>
                </div>
              </div>
            </div>

            <div className="text-gray-600 mb-8">
              <p className="mb-4">In the meantime, you can:</p>
              <ul className="space-y-2 text-left max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-ocean-600 mt-1">✓</span>
                  <span>Explore our featured islands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-600 mt-1">✓</span>
                  <span>Browse all available islands</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ocean-600 mt-1">✓</span>
                  <span>Contact us to request information about this island</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/islands" className="btn-primary">
                Browse All Islands
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact Us
              </Link>
              <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
                Go to Homepage
              </Link>
            </div>
          </div>

          {/* Suggestions */}
          <div className="mt-12 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Popular Islands You Might Like
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link to="/islands?group=Andaman" className="card p-6 hover:bg-ocean-50 transition-colors">
                <h4 className="font-semibold text-lg mb-2">Andaman Islands</h4>
                <p className="text-sm text-gray-600">Explore the Andaman archipelago</p>
              </Link>
              <Link to="/islands?group=Lakshadweep" className="card p-6 hover:bg-ocean-50 transition-colors">
                <h4 className="font-semibold text-lg mb-2">Lakshadweep Islands</h4>
                <p className="text-sm text-gray-600">Discover coral paradise</p>
              </Link>
              <Link to="/islands?vibe=Beach" className="card p-6 hover:bg-ocean-50 transition-colors">
                <h4 className="font-semibold text-lg mb-2">Beach Islands</h4>
                <p className="text-sm text-gray-600">Find the best beaches</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Invalid island name
  if (islands.length === 0 && !isValidIsland) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="bg-red-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-red-600 text-4xl" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Invalid Search
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              "<strong>{searchQuery}</strong>" doesn't appear to be a valid island name.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Search Tips:
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Make sure you're searching for an Indian island</li>
                <li>• Check the spelling of the island name</li>
                <li>• Try searching for island groups like "Andaman" or "Lakshadweep"</li>
                <li>• Use common island names like "Havelock", "Neil", or "Agatti"</li>
              </ul>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/islands" className="btn-primary">
                Browse All Islands
              </Link>
              <Link to="/" className="btn-secondary">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results found
  return (
    <div className="min-h-screen bg-gradient-to-b from-ocean-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Search Results for "{searchQuery}"
          </h1>
          <p className="text-xl text-gray-600">
            Found {islands.length} {islands.length === 1 ? 'island' : 'islands'}
          </p>
        </div>

        {error && (
          <div className="text-center mb-8">
            <p className="text-red-600 text-xl">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {islands.map((island) => (
            <IslandCard key={island._id} island={island} />
          ))}
        </div>

        <div className="text-center">
          <Link to="/islands" className="inline-block btn-primary">
            Browse All Islands
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
