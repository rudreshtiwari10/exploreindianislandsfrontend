import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaCompass } from 'react-icons/fa';
import { islandsAPI } from '../api/islands';

const Hero = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Hardcoded groups that should show up in search
  const majorGroups = [
    { name: 'Andaman', type: 'group', icon: <FaCompass /> },
    { name: 'Nicobar', type: 'group', icon: <FaCompass /> },
    { name: 'Lakshadweep', type: 'group', icon: <FaCompass /> },
  ];

  // Debounced API fetch
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await islandsAPI.getAllIslands({ search: searchQuery, limit: 5 });
        const matchingIslands = res.data || [];
        
        // Find matching major groups
        const matchingGroups = majorGroups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));

        setSuggestions([...matchingGroups, ...matchingIslands]);
      } catch (err) {
        console.error('Error fetching search suggestions', err);
      }
    };

    const timer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // If exactly matches a major group, redirect to group page
      const groupMatch = majorGroups.find(g => g.name.toLowerCase() === searchQuery.trim().toLowerCase());
      if (groupMatch) {
        navigate(`/group/${encodeURIComponent(groupMatch.name)}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background with parallax effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[10000ms]"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.5), rgba(30, 41, 59, 0.6)), url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070')`,
        }}
      />

      {/* Overlay pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05),transparent_50%)]" />

      {/* Content - Centered with slight upward adjustment */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 -mt-16">
        {/* Main Heading */}
        <div className="text-center space-y-10 animate-fade-in-up">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-wider">
            Explore <span className="font-semibold italic">Indian</span> Islands
          </h1>
          <p className="text-slate-200 text-lg md:text-xl font-light max-w-2xl mx-auto tracking-wide">
            Discover paradise across India's stunning archipelagos
          </p>
        </div>

        {/* Search Bar - Elegant glassmorphism */}
        <div ref={dropdownRef} className="w-full max-w-2xl mt-12 animate-fade-in-up-delayed relative">
          <form onSubmit={handleSearch}>
            <div className={`relative group transition-all duration-500 ${isFocused ? 'scale-[1.02]' : ''}`}>
              <div className={`absolute inset-0 bg-gradient-to-r from-slate-200/20 to-slate-300/20 rounded-2xl blur-xl transition-opacity duration-500 ${isFocused ? 'opacity-100' : 'opacity-0'}`} />
              <div className="relative flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/15">
                <input
                  type="text"
                  placeholder="Search specific islands or big groups like 'Andaman'..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSuggestions(true); }}
                  onFocus={() => { setIsFocused(true); setShowSuggestions(true); }}
                  className="flex-1 px-6 md:px-8 py-4 md:py-5 text-base md:text-lg text-white placeholder-slate-300/80 bg-transparent focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 md:px-10 py-4 md:py-5 bg-slate-700/50 hover:bg-slate-600/60 text-white font-medium transition-all duration-300 flex items-center gap-2 group-hover:bg-emerald-600/60"
                >
                  <FaSearch className="text-sm md:text-base" />
                  <span className="hidden md:inline">Search</span>
                </button>
              </div>
            </div>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in-up">
              <ul className="py-2">
                {suggestions.map((suggestion, index) => {
                  const isGroup = suggestion.type === 'group';
                  return (
                    <li key={index}>
                      <Link
                        to={isGroup ? `/group/${encodeURIComponent(suggestion.name)}` : `/island/${suggestion._id}`}
                        className={`flex items-center gap-4 px-6 py-3 transition-colors ${
                          isGroup ? 'hover:bg-emerald-50 text-emerald-800' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${
                          isGroup ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isGroup ? <FaCompass /> : <FaMapMarkerAlt />}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <h4 className={`text-base font-semibold truncate ${isGroup ? 'text-emerald-700' : 'text-slate-800'}`}>
                            {suggestion.name} {isGroup && <span className="text-xs font-medium ml-2 px-2 py-0.5 bg-emerald-200/50 text-emerald-700 rounded-full">Island Group</span>}
                          </h4>
                          {!isGroup && (
                            <p className="text-sm text-slate-500 truncate">
                              {suggestion.location?.group} • {suggestion.location?.area}
                            </p>
                          )}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Animated Scroll Indicator */}
        <div
          onClick={scrollToContent}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 cursor-pointer group"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2 group-hover:border-white/60 transition-colors duration-300">
              <div className="w-1 h-2 bg-white/60 rounded-full animate-scroll-down" />
            </div>
            <span className="text-xs text-white/60 font-light tracking-widest uppercase group-hover:text-white/80 transition-colors duration-300">Scroll</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
