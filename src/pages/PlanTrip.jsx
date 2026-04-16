import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { islandsAPI } from '../api/islands';
import { plannerAPI } from '../api/planner';
import ItineraryDisplay from '../components/ItineraryDisplay';
import {
  FaMapMarkerAlt, FaCrosshairs, FaCalendarAlt, FaUsers, FaChild,
  FaPlane, FaHotel, FaHiking, FaArrowRight, FaArrowLeft, FaCheck,
  FaSpinner, FaStar, FaCheckCircle, FaExclamationTriangle, FaInfoCircle,
  FaSearch, FaTimes, FaRoute, FaClock,
} from 'react-icons/fa';

const STEPS = [
  { id: 1, title: 'Journey Details', icon: <FaMapMarkerAlt /> },
  { id: 2, title: 'Transportation', icon: <FaPlane /> },
  { id: 3, title: 'Accommodation', icon: <FaHotel /> },
  { id: 4, title: 'Food & Activities', icon: <FaHiking /> },
  { id: 5, title: 'Your Itinerary', icon: <FaCheck /> },
];

// ─── Pre-built Island Circuits ──────────────────────────
const CIRCUITS = [
  {
    id: 'andaman-popular',
    name: 'Andaman Popular Circuit',
    emoji: '🏖️',
    description: 'The classic Andaman experience — pristine beaches, history & snorkeling',
    duration: '5-7 days recommended',
    islandNames: ['Havelock Island', 'Neil Island', 'Ross Island'],
    group: 'Andaman',
  },
  {
    id: 'andaman-adventure',
    name: 'Andaman Adventure Trail',
    emoji: '🌋',
    description: 'Caves, volcanoes, untouched beaches & jungle treks',
    duration: '6-8 days recommended',
    islandNames: ['Havelock Island', 'Baratang Island', 'Long Island', 'Barren Island'],
    group: 'Andaman',
  },
  {
    id: 'lakshadweep-samudram',
    name: 'Lakshadweep Samudram',
    emoji: '🐚',
    description: 'The classic SPORTS package — coral atolls & turquoise lagoons',
    duration: '5-6 days recommended',
    islandNames: ['Kavaratti Island', 'Kalpeni Island', 'Minicoy Island'],
    group: 'Lakshadweep',
  },
  {
    id: 'lakshadweep-bangaram',
    name: 'Bangaram Island Escape',
    emoji: '🏝️',
    description: 'Luxury uninhabited island experience with world-class snorkeling',
    duration: '3-5 days recommended',
    islandNames: ['Agatti Island', 'Bangaram Island', 'Tinnakara Island'],
    group: 'Lakshadweep',
  },
  {
    id: 'goa-islands',
    name: 'Goa Island Hopping',
    emoji: '🌊',
    description: 'River islands, bird sanctuaries & Goan heritage',
    duration: '2-3 days recommended',
    islandNames: ['Grande Island', 'Chorao Island', 'Divar Island'],
    group: 'Arabian Sea',
  },
  {
    id: 'sundarbans',
    name: 'Sundarbans Explorer',
    emoji: '🐅',
    description: 'Mangrove forests, Bengal tigers & delta villages',
    duration: '3-4 days recommended',
    islandNames: ['Gosaba Island', 'Bali Island', 'Sagar Island'],
    group: 'River Island',
  },
  {
    id: 'gulf-mannar',
    name: 'Gulf of Mannar Marine',
    emoji: '🐠',
    description: 'Marine biosphere, coral islands & Rameswaram temple',
    duration: '3-4 days recommended',
    islandNames: ['Pamban Island', 'Hare Island', 'Krusadai Island'],
    group: 'Offshore Mainland',
  },
];

const PlanTrip = () => {
  const [searchParams] = useSearchParams();
  const preselectedIslandId = searchParams.get('island') || searchParams.get('islandId');

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Islands
  const [allIslands, setAllIslands] = useState([]);
  const [islandSearch, setIslandSearch] = useState('');
  const [selectedIslands, setSelectedIslands] = useState([]);
  const [selectionMode, setSelectionMode] = useState('circuit'); // 'circuit' or 'manual'

  // Step 1
  const [originCity, setOriginCity] = useState('');
  const [originCoords, setOriginCoords] = useState(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Step 2
  const [routeData, setRouteData] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [selectedTransportCost, setSelectedTransportCost] = useState(0);
  const [transportBudgetLimit, setTransportBudgetLimit] = useState(50000);

  // Step 3
  const [accommodationData, setAccommodationData] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [accFilter, setAccFilter] = useState('all');
  const [hotelSearchQuery, setHotelSearchQuery] = useState('');
  const [hotelSearchResults, setHotelSearchResults] = useState(null);
  const [searchingHotel, setSearchingHotel] = useState(false);

  // Step 4
  const [activitiesData, setActivitiesData] = useState(null);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [foodTier, setFoodTier] = useState('standard');

  // Step 5
  const [finalPlan, setFinalPlan] = useState(null);

  // ─── Load Islands ──────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await islandsAPI.getAllIslands({ limit: 200 });
        setAllIslands(res.data || []);
        if (preselectedIslandId) {
          const found = (res.data || []).find(i => i._id === preselectedIslandId);
          if (found) { setSelectedIslands([found]); setSelectionMode('manual'); }
        }
      } catch (e) { console.error(e); }
    };
    load();
  }, [preselectedIslandId]);

  // ─── Select Circuit ────────────────────────────
  const selectCircuit = (circuit) => {
    const matched = circuit.islandNames
      .map(name => allIslands.find(i => i.name === name))
      .filter(Boolean);
    setSelectedIslands(matched);
  };

  // ─── Toggle Individual Island ──────────────────
  const toggleIsland = (island) => {
    setSelectedIslands(prev => {
      const exists = prev.find(i => i._id === island._id);
      if (exists) return prev.filter(i => i._id !== island._id);
      return [...prev, island];
    });
  };

  // ─── Detect Location ──────────────────────────
  const detectLocation = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); return; }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setOriginCoords(coords);
        try {
          const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`);
          const data = await resp.json();
          setOriginCity(data.address?.city || data.address?.town || data.address?.state_district || 'Your Location');
        } catch { setOriginCity(`${coords.lat.toFixed(2)}, ${coords.lng.toFixed(2)}`); }
        setDetectingLocation(false);
      },
      () => { setError('Could not detect location.'); setDetectingLocation(false); }
    );
  };

  // ─── Hotel Search ─────────────────────────────
  const handleHotelSearch = async () => {
    if (!hotelSearchQuery.trim()) return;
    setSearchingHotel(true);
    try {
      const res = await plannerAPI.searchHotel({
        query: hotelSearchQuery,
        islandIds: selectedIslands.map(i => i._id),
        dates: { start: startDate, end: endDate },
        travelers: { adults, children },
      });
      setHotelSearchResults(res.data);
    } catch (e) {
      setError('Hotel search failed. Try again.');
    } finally {
      setSearchingHotel(false);
    }
  };

  // ─── Step Handlers ─────────────────────────────
  const handleStep1Next = () => {
    if (!originCity && !originCoords) { setError('Please enter your starting location'); return; }
    if (selectedIslands.length === 0) { setError('Please select at least one destination island'); return; }
    if (!startDate || !endDate) { setError('Please select travel dates'); return; }
    if (new Date(endDate) <= new Date(startDate)) { setError('Return date must be after departure'); return; }
    setError(null);
    fetchRoutes();
  };

  const fetchRoutes = async () => {
    setLoading(true); setError(null);
    try {
      const res = await plannerAPI.getRoutes({
        originCity, originLat: originCoords?.lat, originLng: originCoords?.lng,
        islandIds: selectedIslands.map(i => i._id),
      });
      setRouteData(res.data);
      setCurrentStep(2);
    } catch (err) { setError(err.response?.data?.error || 'Failed to fetch routes.'); }
    finally { setLoading(false); }
  };

  const handleStep2Next = () => {
    if (!selectedRoute) { setError('Select a transportation option'); return; }
    setError(null); fetchAccommodations();
  };

  const fetchAccommodations = async () => {
    setLoading(true); setError(null);
    try {
      const res = await plannerAPI.getAccommodations({
        islandIds: selectedIslands.map(i => i._id),
        dates: { start: startDate, end: endDate },
        travelers: { adults, children },
      });
      setAccommodationData(res.data);
      setCurrentStep(3);
    } catch (err) { setError(err.response?.data?.error || 'Failed to fetch accommodations.'); }
    finally { setLoading(false); }
  };

  const handleStep3Next = () => {
    if (!selectedAccommodation) { setError('Select an accommodation'); return; }
    setError(null); fetchActivities();
  };

  const fetchActivities = async () => {
    setLoading(true); setError(null);
    try {
      const res = await plannerAPI.getActivities({
        islandIds: selectedIslands.map(i => i._id),
        dates: { start: startDate, end: endDate },
        mealsNeeded: {
          breakfast: !selectedAccommodation?.mealsIncluded?.breakfast,
          lunch: !selectedAccommodation?.mealsIncluded?.lunch,
          dinner: !selectedAccommodation?.mealsIncluded?.dinner,
        },
      });
      setActivitiesData(res.data);
      setCurrentStep(4);
    } catch (err) { setError(err.response?.data?.error || 'Failed to fetch activities.'); }
    finally { setLoading(false); }
  };

  const handleStep4Next = () => { setError(null); finalizeTrip(); };

  const finalizeTrip = async () => {
    setLoading(true); setError(null);
    try {
      const nights = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      const dailyFoodCost = activitiesData?.estimatedDailyFoodCost?.[foodTier] || 1200;
      const res = await plannerAPI.finalize({
        origin: { city: originCity, coordinates: originCoords },
        islandIds: selectedIslands.map(i => i._id),
        dates: { start: startDate, end: endDate },
        travelers: { adults, children },
        selectedTransport: { ...selectedRoute, estimatedCost: selectedTransportCost },
        selectedAccommodation,
        selectedActivities: selectedActivities.map(a => ({ ...a, totalCost: a.pricePerPerson * (adults + children) })),
        foodPlan: {
          breakfastNeeded: !selectedAccommodation?.mealsIncluded?.breakfast,
          lunchNeeded: !selectedAccommodation?.mealsIncluded?.lunch,
          dinnerNeeded: !selectedAccommodation?.mealsIncluded?.dinner,
          estimatedDailyCost: dailyFoodCost,
          totalCost: dailyFoodCost * nights * (adults + children),
        },
      });
      setFinalPlan(res.data);
      setCurrentStep(5);
    } catch (err) { setError(err.response?.data?.error || 'Failed to generate itinerary.'); }
    finally { setLoading(false); }
  };

  // ─── Helpers ──────────────────────────────────
  const nights = startDate && endDate ? Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) : 0;
  const formatPrice = (n) => (!n && n !== 0) ? '—' : '₹' + n.toLocaleString('en-IN');

  const filteredIslands = allIslands.filter(i =>
    i.name.toLowerCase().includes(islandSearch.toLowerCase()) ||
    i.location?.group?.toLowerCase().includes(islandSearch.toLowerCase())
  ).slice(0, 20);

  // Group islands by region for manual selection
  const islandsByGroup = {};
  filteredIslands.forEach(i => {
    const g = i.location?.group || 'Other';
    if (!islandsByGroup[g]) islandsByGroup[g] = [];
    islandsByGroup[g].push(i);
  });

  // Filter accommodations
  const filteredAccommodations = (accommodationData?.accommodations || []).filter(acc => {
    if (accFilter === 'all') return true;
    if (accFilter === 'luxury') return ['Ultra Luxury', 'Luxury'].includes(acc.category);
    if (accFilter === 'premium') return acc.category === 'Premium';
    if (accFilter === 'standard') return acc.category === 'Standard';
    if (accFilter === 'budget') return ['Budget', 'Backpacker'].includes(acc.category);
    if (accFilter === 'villa') return ['Villa', 'Private Villa', 'Cottage', 'Eco Hut'].includes(acc.type);
    if (accFilter === 'homestay') return ['Homestay', 'Guesthouse', 'Airbnb'].includes(acc.type);
    return true;
  });

  // ═══════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20 pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <span className="text-sm font-medium tracking-widest text-emerald-700 uppercase mb-2 block">AI Powered</span>
          <h1 className="text-4xl md:text-5xl font-light text-slate-800 mb-3 tracking-tight">
            Plan Your <span className="font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Trip</span>
          </h1>
          <p className="text-lg text-slate-500 font-light">Multi-island itineraries crafted just for you</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 gap-0">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-500 cursor-default ${currentStep === step.id ? 'bg-slate-800 text-white shadow-lg scale-105' : currentStep > step.id ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                <span className="text-base">{currentStep > step.id ? <FaCheckCircle /> : step.icon}</span>
                <span className="hidden md:inline">{step.title}</span>
              </div>
              {idx < STEPS.length - 1 && <div className={`w-8 lg:w-16 h-0.5 mx-1 transition-colors duration-500 ${currentStep > step.id ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 animate-fade-in">
            <FaExclamationTriangle className="text-red-500 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600 text-lg">&times;</button>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-2xl">🏝️</span></div>
            </div>
            <p className="mt-6 text-slate-600 text-lg font-light animate-pulse">
              {currentStep === 1 && 'Finding the best routes...'}
              {currentStep === 2 && 'Searching accommodations...'}
              {currentStep === 3 && 'Discovering activities...'}
              {currentStep === 4 && 'Crafting your perfect itinerary...'}
            </p>
          </div>
        )}

        {/* ══════ STEP 1 ══════ */}
        {!loading && currentStep === 1 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-white/80 animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-slate-800 mb-8 flex items-center gap-3">
              <FaMapMarkerAlt className="text-emerald-600" /> Journey Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Origin */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Starting Location</label>
                <div className="flex gap-2">
                  <input type="text" value={originCity} onChange={(e) => { setOriginCity(e.target.value); setOriginCoords(null); }} placeholder="e.g. Mumbai, Delhi..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white text-slate-800" />
                  <button onClick={detectLocation} disabled={detectingLocation} className="px-4 py-3 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl border border-slate-200 transition-all flex items-center gap-2 whitespace-nowrap" title="Detect my location">
                    {detectingLocation ? <FaSpinner className="animate-spin" /> : <FaCrosshairs />}
                    <span className="hidden sm:inline">{detectingLocation ? 'Detecting...' : 'Detect'}</span>
                  </button>
                </div>
                {originCoords && <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1"><FaCheckCircle /> Location detected</p>}
              </div>
              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Departure</label>
                  <input type="date" value={startDate} min={new Date().toISOString().split('T')[0]} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Return</label>
                  <input type="date" value={endDate} min={startDate || new Date().toISOString().split('T')[0]} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white text-slate-800" />
                </div>
              </div>
              {/* Travelers */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><FaUsers className="text-slate-400" /> Adults</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setAdults(Math.max(1, adults - 1))} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg font-medium transition-colors">−</button>
                    <span className="text-xl font-semibold text-slate-800 w-8 text-center">{adults}</span>
                    <button onClick={() => setAdults(Math.min(10, adults + 1))} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg font-medium transition-colors">+</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><FaChild className="text-slate-400" /> Children</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setChildren(Math.max(0, children - 1))} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg font-medium transition-colors">−</button>
                    <span className="text-xl font-semibold text-slate-800 w-8 text-center">{children}</span>
                    <button onClick={() => setChildren(Math.min(8, children + 1))} className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg font-medium transition-colors">+</button>
                  </div>
                </div>
              </div>
              {nights > 0 && (
                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3 self-end">
                  <FaCalendarAlt className="text-emerald-500" />
                  <strong>{nights}</strong> night{nights !== 1 ? 's' : ''} • <strong>{adults + children}</strong> traveler{adults + children !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* ─── Island Selection ──────────────────── */}
            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-slate-700">Destination Islands</label>
                <div className="flex gap-2">
                  <button onClick={() => setSelectionMode('circuit')} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${selectionMode === 'circuit' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    🗺️ Circuits
                  </button>
                  <button onClick={() => setSelectionMode('manual')} className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${selectionMode === 'manual' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                    ✋ Pick Islands
                  </button>
                </div>
              </div>

              {/* Selected islands badge bar */}
              {selectedIslands.length > 0 && (
                <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-emerald-800">
                      <FaRoute className="inline mr-1" /> {selectedIslands.length} island{selectedIslands.length > 1 ? 's' : ''} selected
                    </p>
                    <button onClick={() => setSelectedIslands([])} className="text-xs text-red-400 hover:text-red-600">Clear all</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedIslands.map(island => (
                      <span key={island._id} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-sm text-slate-700 border border-emerald-200 shadow-sm">
                        {island.name}
                        <button onClick={() => toggleIsland(island)} className="text-slate-400 hover:text-red-500"><FaTimes className="text-xs" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Circuit Selection */}
              {selectionMode === 'circuit' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {CIRCUITS.map(circuit => {
                    const isActive = circuit.islandNames.every(name => selectedIslands.some(i => i.name === name));
                    return (
                      <button key={circuit.id} onClick={() => selectCircuit(circuit)}
                        className={`text-left p-5 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${isActive ? 'border-emerald-400 bg-emerald-50/50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{circuit.emoji}</span>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-800">{circuit.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{circuit.description}</p>
                            <p className="text-xs text-emerald-600 mt-1 font-medium">{circuit.duration}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {circuit.islandNames.map(name => (
                                <span key={name} className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">{name}</span>
                              ))}
                            </div>
                          </div>
                          {isActive && <FaCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Manual Island Selection */}
              {selectionMode === 'manual' && (
                <div>
                  <input type="text" value={islandSearch} onChange={(e) => setIslandSearch(e.target.value)} placeholder="Search islands... (e.g. Havelock, Lakshadweep)" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white text-slate-800 mb-4" />
                  <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                    {Object.entries(islandsByGroup).map(([group, groupIslands]) => (
                      <div key={group}>
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{group}</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                          {groupIslands.map(island => {
                            const isSelected = selectedIslands.some(i => i._id === island._id);
                            return (
                              <button key={island._id} onClick={() => toggleIsland(island)}
                                className={`text-left p-2.5 rounded-xl border transition-all text-sm ${isSelected ? 'border-emerald-400 bg-emerald-50 shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'}`}>
                                    {isSelected && <FaCheck className="text-white text-[8px]" />}
                                  </div>
                                  <span className="truncate font-medium text-slate-700">{island.name}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-10 flex justify-end">
              <button onClick={handleStep1Next} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
                Find Routes <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* ══════ STEP 2 ══════ */}
        {!loading && currentStep === 2 && routeData && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-white/80 animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2 flex items-center gap-3"><FaPlane className="text-blue-600" /> Choose Your Transport</h2>
            <p className="text-slate-500 mb-2">{routeData.origin} → <span className="font-medium text-slate-700">{routeData.destination}</span>{routeData.hub && <span className="text-sm"> (via {routeData.hub})</span>}</p>
            {routeData.isMultiIsland && (
              <p className="text-sm text-emerald-600 mb-4 flex items-center gap-1"><FaRoute /> Multi-island: {routeData.islands?.map(i => i.name).join(' → ')}</p>
            )}

            {routeData.warnings && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <FaInfoCircle className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-amber-800 text-sm">{routeData.warnings}</p>
              </div>
            )}

            {/* Inter-island routes */}
            {routeData.interIslandRoutes?.length > 0 && (
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <p className="text-sm font-semibold text-blue-800 mb-2">🚢 Inter-Island Connections</p>
                {routeData.interIslandRoutes.map((r, idx) => (
                  <div key={idx} className="text-sm text-blue-700 flex items-center gap-2 py-1">
                    <span>{r.from} → {r.to}</span>
                    <span className="text-xs text-blue-500">({r.distance} km • Ferry ~{formatPrice(r.ferry?.govt || 500)})</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-6">
              {routeData.routes.map((route, idx) => (
                <div key={idx} onClick={() => { 
                  setSelectedRoute(route); 
                  setSelectedTransportCost(route.totalEstimate?.low || 0);
                  setTransportBudgetLimit(route.totalEstimate?.high * 1.2 || 50000); 
                }}
                  className={`p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedRoute === route ? 'border-emerald-400 bg-emerald-50/50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${route.category === 'Fastest' ? 'bg-blue-100 text-blue-700' : route.category === 'Standard' ? 'bg-emerald-100 text-emerald-700' : route.category === 'Budget' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'}`}>{route.category}</span>
                      <h3 className="text-lg font-semibold text-slate-800">{route.tag}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500">Per person</p>
                      <p className="text-xl font-bold text-slate-800">{formatPrice(route.totalEstimate?.low)} — {formatPrice(route.totalEstimate?.high)}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {route.legs.map((leg, lIdx) => (
                      <div key={lIdx} className="flex items-center gap-3 bg-slate-50 rounded-xl p-3 text-sm">
                        <span className="text-lg">{leg.type === 'flight' ? '✈️' : leg.type === 'train' ? '🚂' : leg.type === 'ship' ? '🚢' : leg.type === 'ferry' ? '⛴️' : leg.type === 'bus' ? '🚌' : '🚗'}</span>
                        <div className="flex-1">
                          <p className="font-medium text-slate-700">{leg.from} → {leg.to}</p>
                          {leg.duration && <p className="text-slate-400 text-xs">{leg.duration}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedRoute === route && (
                    <div className="mt-4 pt-4 border-t border-slate-200" onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()}>
                      <label className="text-sm font-semibold text-slate-800 mb-3 block">Select Transport Option (Per Person):</label>
                      
                      {route.mockOptions && route.mockOptions.length > 0 ? (
                        <>
                          <div className="mb-5 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="text-sm font-semibold text-slate-700 flex justify-between mb-2">
                              <span>Set Max Budget: <span className="text-emerald-700">{formatPrice(transportBudgetLimit)}</span></span>
                            </label>
                            <input 
                              type="range" 
                              min={route.totalEstimate?.low * 0.8 || 0} 
                              max={route.totalEstimate?.high * 1.5 || 50000} 
                              value={transportBudgetLimit} 
                              onChange={(e) => setTransportBudgetLimit(parseInt(e.target.value))} 
                              className="w-full accent-blue-600" 
                            />
                            <p className="text-xs text-slate-500 mt-2">Adjust the slider to filter the available transport options below.</p>
                          </div>

                          {route.mockOptions.filter(opt => opt.price <= transportBudgetLimit).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              {route.mockOptions.filter(opt => opt.price <= transportBudgetLimit).map((opt) => (
                                <div 
                                  key={opt.id}
                                  onClick={() => setSelectedTransportCost(opt.price)}
                                  className={`p-3 rounded-xl border-2 cursor-pointer transition-all hover:-translate-y-1 ${selectedTransportCost === opt.price ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200 ring-opacity-50' : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow'}`}
                                >
                                  <p className="font-bold text-slate-800 text-sm flex items-center justify-between">
                                    {opt.provider}
                                    {selectedTransportCost === opt.price && <FaCheckCircle className="text-emerald-500" />}
                                  </p>
                                  <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium">{opt.number}</span>
                                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{opt.classType}</span>
                                  </div>
                                  <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
                                    <FaClock className="text-slate-400" /> {opt.timeString}
                                  </div>
                                  <div className="mt-3 text-lg font-bold text-slate-900 border-t border-slate-100 pt-2 flex justify-between items-end">
                                    <span className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">Total/Pax</span>
                                    {formatPrice(opt.price)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-6 bg-slate-50 rounded-xl text-center border-2 border-dashed border-slate-300">
                              <p className="text-slate-600 font-medium">No options available within this budget.</p>
                              <p className="text-slate-500 text-sm mt-1">Please increase your budget slider to see available flights and trains.</p>
                            </div>
                          )}
                        </>
                      ) : (
                        // Fallback in case old routes don't have mockOptions
                        <div>
                          <input type="range" min={route.totalEstimate?.low || 0} max={route.totalEstimate?.high || 50000} value={selectedTransportCost} onChange={(e) => setSelectedTransportCost(parseInt(e.target.value))} className="w-full accent-emerald-600" />
                          <p className="text-center font-bold text-emerald-700 mt-1">{formatPrice(selectedTransportCost)}</p>
                        </div>
                      )}
                      
                      <div className="mt-4 flex items-start gap-2 bg-slate-50 p-3 rounded-lg text-xs text-slate-500 italic">
                        <FaInfoCircle className="text-slate-400 mt-0.5 flex-shrink-0" />
                        <p>These are simulated live prices based on real-time Indian transport trends. Final availability and exact fares may vary. Please verify with operators (e.g., MakeMyTrip, IRCTC, Airlines) before booking.</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
              <button onClick={() => setCurrentStep(1)} className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all"><FaArrowLeft /> Back</button>
              <button onClick={handleStep2Next} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">Find Stays <FaArrowRight /></button>
            </div>
          </div>
        )}

        {/* ══════ STEP 3: ACCOMMODATION ══════ */}
        {!loading && currentStep === 3 && accommodationData && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-white/80 animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2 flex items-center gap-3"><FaHotel className="text-purple-600" /> Where to Stay</h2>
            <p className="text-slate-500 mb-6">{accommodationData.islands} • {accommodationData.nights} nights</p>

            {/* Hotel Search */}
            <div className="mb-6 bg-slate-50 rounded-2xl p-4">
              <p className="text-sm font-medium text-slate-700 mb-2 flex items-center gap-2"><FaSearch className="text-slate-400" /> Know a specific hotel? Search for it:</p>
              <div className="flex gap-2">
                <input type="text" value={hotelSearchQuery} onChange={(e) => setHotelSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleHotelSearch()} placeholder="e.g. Taj Exotica, Barefoot Resort, Symphony Palms..." className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 focus:border-purple-400 outline-none text-sm bg-white text-slate-800" />
                <button onClick={handleHotelSearch} disabled={searchingHotel} className="px-5 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center gap-2">
                  {searchingHotel ? <FaSpinner className="animate-spin" /> : <FaSearch />} Search
                </button>
              </div>
              {/* Search results */}
              {hotelSearchResults?.results?.length > 0 && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">Search Results</p>
                  {hotelSearchResults.results.map((acc, idx) => (
                    <div key={idx} onClick={() => { setSelectedAccommodation({ ...acc, totalCost: acc.pricePerNight * accommodationData.nights, nights: accommodationData.nights }); setHotelSearchResults(null); }}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAccommodation?.name === acc.name ? 'border-emerald-400 bg-emerald-50' : 'border-purple-200 bg-purple-50/30 hover:border-purple-300'}`}>
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-semibold text-slate-800 text-sm">{acc.name}</h4>
                          <p className="text-xs text-slate-500">{acc.type} • {acc.island}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-800">{formatPrice(acc.pricePerNight)}/night</p>
                          <p className="text-xs text-emerald-600">{formatPrice(acc.pricePerNight * accommodationData.nights)} total</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {hotelSearchResults.note && <p className="text-xs text-slate-400 italic">{hotelSearchResults.note}</p>}
                </div>
              )}
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                { key: 'all', label: 'All' },
                { key: 'luxury', label: '⭐ Luxury' },
                { key: 'premium', label: '✨ Premium' },
                { key: 'standard', label: '🏨 Standard' },
                { key: 'budget', label: '💰 Budget' },
                { key: 'villa', label: '🏡 Villas & Cottages' },
                { key: 'homestay', label: '🏠 Homestays' },
              ].map(f => (
                <button key={f.key} onClick={() => setAccFilter(f.key)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${accFilter === f.key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{f.label}</button>
              ))}
            </div>

            {/* Accommodation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredAccommodations.map((acc, idx) => (
                <div key={idx} onClick={() => setSelectedAccommodation(acc)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedAccommodation === acc ? 'border-emerald-400 bg-emerald-50/50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${acc.category === 'Ultra Luxury' || acc.category === 'Luxury' ? 'bg-purple-100 text-purple-700' : acc.category === 'Premium' ? 'bg-blue-100 text-blue-700' : acc.category === 'Standard' ? 'bg-slate-100 text-slate-700' : 'bg-green-100 text-green-700'}`}>{acc.category}</span>
                        {acc.starRating && <span className="text-xs text-amber-500">{'★'.repeat(acc.starRating)}</span>}
                      </div>
                      <h3 className="font-semibold text-slate-800 text-sm">{acc.name}</h3>
                      <p className="text-xs text-slate-400">{acc.type}{acc.island ? ` • ${acc.island}` : ''}{acc.location ? ` • ${acc.location}` : ''}</p>
                    </div>
                    {acc.rating && <div className="flex items-center gap-1 text-amber-500 text-sm"><FaStar /> {acc.rating}</div>}
                  </div>
                  {acc.description && <p className="text-xs text-slate-600 mb-2">{acc.description}</p>}
                  {acc.amenities && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {acc.amenities.slice(0, 6).map((a, i) => <span key={i} className="text-xs px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{a}</span>)}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs text-slate-500">Per night</p>
                      <p className="text-lg font-bold text-slate-800">{formatPrice(acc.pricePerNight)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">{accommodationData.nights} nights</p>
                      <p className="text-lg font-bold text-emerald-700">{formatPrice(acc.totalCost)}</p>
                    </div>
                  </div>
                  {acc.mealsIncluded && (
                    <div className="mt-2 flex gap-3 text-xs">
                      <span className={acc.mealsIncluded.breakfast ? 'text-emerald-600' : 'text-slate-300'}>🍳 B {acc.mealsIncluded.breakfast ? '✓' : '✗'}</span>
                      <span className={acc.mealsIncluded.lunch ? 'text-emerald-600' : 'text-slate-300'}>🍽️ L {acc.mealsIncluded.lunch ? '✓' : '✗'}</span>
                      <span className={acc.mealsIncluded.dinner ? 'text-emerald-600' : 'text-slate-300'}>🌙 D {acc.mealsIncluded.dinner ? '✓' : '✗'}</span>
                    </div>
                  )}
                  {acc.bookingTip && <p className="mt-2 text-xs text-blue-600 italic">💡 {acc.bookingTip}</p>}
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
              <button onClick={() => setCurrentStep(2)} className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all"><FaArrowLeft /> Back</button>
              <button onClick={handleStep3Next} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">Activities & Food <FaArrowRight /></button>
            </div>
          </div>
        )}

        {/* ══════ STEP 4: ACTIVITIES ══════ */}
        {!loading && currentStep === 4 && activitiesData && (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 border border-white/80 animate-fade-in-up">
            <h2 className="text-2xl font-semibold text-slate-800 mb-8 flex items-center gap-3"><FaHiking className="text-orange-600" /> Activities & Dining</h2>

            {/* Activities */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">🎯 Select Activities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(activitiesData.activities || []).map((act, idx) => {
                  const isSelected = selectedActivities.some(a => a.name === act.name && a.island === act.island);
                  return (
                    <div key={idx} onClick={() => isSelected ? setSelectedActivities(selectedActivities.filter(a => !(a.name === act.name && a.island === act.island))) : setSelectedActivities([...selectedActivities, act])}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${isSelected ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-slate-800 text-sm">{act.name}</h4>
                            {act.mustDo && <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold">Must Do</span>}
                            {isSelected && <FaCheckCircle className="text-emerald-500 text-sm" />}
                          </div>
                          {act.island && <p className="text-xs text-blue-500 mb-0.5">📍 {act.island}</p>}
                          <p className="text-xs text-slate-500">{act.description}</p>
                          <div className="flex gap-2 text-xs text-slate-400 mt-1">
                            <span>⏱ {act.duration}</span>
                            <span>• {act.difficulty || 'Easy'}</span>
                          </div>
                        </div>
                        <div className="text-right ml-3">
                          <p className="font-bold text-slate-800">{act.pricePerPerson === 0 ? 'FREE' : formatPrice(act.pricePerPerson)}</p>
                          <p className="text-xs text-slate-400">/person</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {selectedActivities.length > 0 && (
                <div className="mt-4 bg-emerald-50 rounded-xl p-3 text-sm text-emerald-700 flex items-center justify-between">
                  <span>{selectedActivities.length} selected</span>
                  <span className="font-bold">Total: {formatPrice(selectedActivities.reduce((s, a) => s + a.pricePerPerson, 0))} × {adults + children} pax</span>
                </div>
              )}
            </div>

            {/* Food Tier */}
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">🍽️ Food Budget</h3>
              <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-sm space-y-1">
                <p>🍳 Breakfast: {selectedAccommodation?.mealsIncluded?.breakfast ? <span className="text-emerald-600 font-medium">Included</span> : <span className="text-amber-600 font-medium">Needs budget</span>}</p>
                <p>🍽️ Lunch: {selectedAccommodation?.mealsIncluded?.lunch ? <span className="text-emerald-600 font-medium">Included</span> : <span className="text-amber-600 font-medium">Needs budget</span>}</p>
                <p>🌙 Dinner: {selectedAccommodation?.mealsIncluded?.dinner ? <span className="text-emerald-600 font-medium">Included</span> : <span className="text-amber-600 font-medium">Needs budget</span>}</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: 'budget', label: 'Budget', desc: 'Local eateries', emoji: '🥘' },
                  { key: 'standard', label: 'Standard', desc: 'Good restaurants', emoji: '🍲' },
                  { key: 'luxury', label: 'Premium', desc: 'Fine dining', emoji: '🍱' },
                ].map(tier => (
                  <button key={tier.key} onClick={() => setFoodTier(tier.key)} className={`p-4 rounded-2xl border-2 text-center transition-all ${foodTier === tier.key ? 'border-emerald-400 bg-emerald-50/50' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <p className="text-2xl mb-2">{tier.emoji}</p>
                    <p className="font-semibold text-slate-800 text-sm">{tier.label}</p>
                    <p className="text-xs text-slate-400 mt-1">{tier.desc}</p>
                    <p className="font-bold text-emerald-700 mt-2">{formatPrice(activitiesData.estimatedDailyFoodCost?.[tier.key] || 1000)}/day</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Dining recommendations */}
            {activitiesData.dining?.length > 0 && (
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-700 mb-4">🍴 Recommended Restaurants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activitiesData.dining.map((d, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-4 text-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-slate-800">{d.name}</h4>
                            {d.mustTry && <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded-full font-semibold">Must Try</span>}
                          </div>
                          <p className="text-xs text-slate-400">{d.type} • {d.cuisine}{d.island ? ` • 📍 ${d.island}` : ''}</p>
                          {d.specialty && <p className="text-xs text-amber-600 mt-1">⭐ {d.specialty}</p>}
                        </div>
                        <p className="font-bold text-slate-700">{formatPrice(d.avgMealCost)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex justify-between">
              <button onClick={() => setCurrentStep(3)} className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 font-medium rounded-xl hover:bg-slate-100 transition-all"><FaArrowLeft /> Back</button>
              <button onClick={handleStep4Next} className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">Generate My Itinerary ✨ <FaArrowRight /></button>
            </div>
          </div>
        )}

        {/* ══════ STEP 5 ══════ */}
        {!loading && currentStep === 5 && finalPlan && (
          <ItineraryDisplay
            plan={finalPlan}
            origin={originCity}
            islands={selectedIslands}
            dates={{ start: startDate, end: endDate }}
            travelers={{ adults, children }}
            onRestart={() => { setCurrentStep(1); setRouteData(null); setAccommodationData(null); setActivitiesData(null); setSelectedRoute(null); setSelectedAccommodation(null); setSelectedActivities([]); setFinalPlan(null); setHotelSearchResults(null); }}
          />
        )}
      </div>
    </div>
  );
};

export default PlanTrip;
