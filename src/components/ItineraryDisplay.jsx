import {
  FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaPlane, FaHotel,
  FaUtensils, FaHiking, FaMoneyBillWave, FaStar, FaRedo,
  FaPrint, FaSun, FaCloudSun, FaMoon, FaLightbulb, FaExclamationTriangle,
  FaHeart, FaLandmark, FaBookOpen, FaRoute, FaShip, FaDownload,
  FaGlobe,
} from 'react-icons/fa';

const ItineraryDisplay = ({ plan, origin, islands, dates, travelers, onRestart }) => {
  if (!plan) return null;

  const { budget, itinerary } = plan;
  const nights = Math.ceil((new Date(dates.end) - new Date(dates.start)) / (1000 * 60 * 60 * 24));
  const totalPax = travelers.adults + travelers.children;
  const islandNames = (plan.islands || islands || []).map(i => i.name).join(', ');
  const startDateFormatted = new Date(dates.start).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  const endDateFormatted = new Date(dates.end).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  const formatPrice = (n) => (!n && n !== 0) ? '—' : '₹' + n.toLocaleString('en-IN');

  const budgetItems = [
    { label: 'Transport', value: budget?.transport || 0, color: 'bg-blue-500', icon: <FaPlane /> },
    { label: 'Accommodation', value: budget?.accommodation || 0, color: 'bg-purple-500', icon: <FaHotel /> },
    { label: 'Food', value: budget?.food || 0, color: 'bg-orange-500', icon: <FaUtensils /> },
    { label: 'Activities', value: budget?.activities || 0, color: 'bg-emerald-500', icon: <FaHiking /> },
    { label: 'Miscellaneous', value: budget?.miscellaneous || 0, color: 'bg-slate-400', icon: <FaMoneyBillWave /> },
  ];
  const maxBudgetItem = Math.max(...budgetItems.map(b => b.value), 1);

  const islandColorMap = {};
  const gradients = ['from-emerald-500 to-emerald-600', 'from-blue-500 to-blue-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600', 'from-pink-500 to-pink-600', 'from-teal-500 to-teal-600'];
  const badges = ['bg-emerald-100 text-emerald-700', 'bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700', 'bg-teal-100 text-teal-700'];
  let cIdx = 0;
  if (itinerary?.dayPlan) {
    itinerary.dayPlan.forEach(day => {
      if (day.island && !islandColorMap[day.island]) {
        islandColorMap[day.island] = { gradient: gradients[cIdx % gradients.length], badge: badges[cIdx % badges.length] };
        cIdx++;
      }
    });
  }

  return (
    <div className="animate-fade-in-up space-y-8">

      {/* ═══ Print-only Branded Header ═══ */}
      <div className="hidden print:block print:mb-8">
        <div style={{ borderBottom: '3px solid #10b981', paddingBottom: '16px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '300', color: '#1e293b', margin: 0 }}>
                EXPLORE <strong>ISLANDS</strong> <span style={{ fontSize: '12px', color: '#64748b' }}>INDIA</span>
              </h1>
              <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>www.exploreindianislands.com</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '14px', color: '#475569', fontWeight: '600' }}>Travel Itinerary</p>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>Generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
        <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>{islandNames}</h2>
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
            {startDateFormatted} — {endDateFormatted} &nbsp;•&nbsp; {nights} nights &nbsp;•&nbsp; {totalPax} traveler{totalPax > 1 ? 's' : ''} &nbsp;•&nbsp; From {origin} &nbsp;•&nbsp; Total: {formatPrice(budget?.total)}
          </p>
        </div>
      </div>

      {/* ═══ Screen Hero Header ═══ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-900 text-white p-10 md:p-14 shadow-2xl print:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(16,185,129,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="relative z-10">
          <p className="text-emerald-300 text-sm font-medium tracking-widest uppercase mb-3">Your Personalized Itinerary</p>
          <h1 className="text-3xl md:text-5xl font-light mb-4 tracking-tight">{islandNames}</h1>
          <div className="flex flex-wrap gap-6 text-sm text-slate-300 mb-8">
            <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-emerald-400" /> From {origin}</span>
            <span className="flex items-center gap-2"><FaCalendarAlt className="text-emerald-400" /> {startDateFormatted} — {endDateFormatted}</span>
            <span className="flex items-center gap-2"><FaUsers className="text-emerald-400" /> {totalPax} traveler{totalPax > 1 ? 's' : ''}</span>
            {(plan.islands || islands || []).length > 1 && <span className="flex items-center gap-2"><FaRoute className="text-emerald-400" /> {(plan.islands || islands || []).length} islands</span>}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <p className="text-slate-300 text-xs uppercase tracking-wider mb-1">Total Trip Cost</p>
              <p className="text-3xl font-bold">{formatPrice(budget?.total)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
              <p className="text-slate-300 text-xs uppercase tracking-wider mb-1">Per Person</p>
              <p className="text-3xl font-bold text-emerald-300">{formatPrice(budget?.perPerson)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/10 col-span-2 md:col-span-1">
              <p className="text-slate-300 text-xs uppercase tracking-wider mb-1">Per Night (avg)</p>
              <p className="text-3xl font-bold text-blue-300">{formatPrice(Math.round((budget?.total || 0) / Math.max(nights, 1)))}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Island Distribution */}
      {itinerary?.islandDistribution?.length > 1 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/80 print:shadow-none print:border print:rounded-xl">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
            <FaRoute className="text-blue-600 print:hidden" /> Island-wise Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:grid-cols-3">
            {itinerary.islandDistribution.map((d, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-5 border border-slate-100 print:rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradients[idx % gradients.length]} print:bg-slate-600`} />
                  <h3 className="font-semibold text-slate-800">{d.island}</h3>
                </div>
                <p className="text-2xl font-bold text-slate-700 mb-1">{d.days} day{d.days > 1 ? 's' : ''}</p>
                <p className="text-xs text-slate-500">{d.highlights}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Breakdown */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 border border-white/80 print:shadow-none print:border print:rounded-xl print:p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2"><FaMoneyBillWave className="text-emerald-600 print:hidden" /> Budget Breakdown</h2>
        <div className="space-y-4">
          {budgetItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-8 text-slate-500 text-sm print:hidden">{item.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  <span className="text-sm font-bold text-slate-800">{formatPrice(item.value)}</span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden print:h-2">
                  <div className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} style={{ width: `${(item.value / maxBudgetItem) * 100}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-center">
          <span className="font-semibold text-slate-800 text-lg">Grand Total</span>
          <span className="text-2xl font-bold text-emerald-700">{formatPrice(budget?.total)}</span>
        </div>
      </div>

      {/* Day-by-Day */}
      {itinerary?.dayPlan?.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-10 border border-white/80 print:shadow-none print:border print:rounded-xl print:p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-8 flex items-center gap-2"><FaCalendarAlt className="text-blue-600 print:hidden" /> Day-by-Day Plan</h2>
          <div className="space-y-8 print:space-y-6">
            {itinerary.dayPlan.map((day, idx) => {
              const ic = islandColorMap[day.island] || { gradient: gradients[0], badge: badges[0] };
              return (
                <div key={idx} className="relative pl-8 border-l-2 border-slate-200 pb-8 last:pb-0 print:pb-4 print:break-inside-avoid">
                  <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-br ${ic.gradient} flex items-center justify-center text-white text-xs font-bold shadow-md print:shadow-none`}>{day.day}</div>
                  <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 ml-4 border border-slate-100 hover:shadow-md transition-shadow print:rounded-lg print:p-4 print:hover:shadow-none">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-800">{day.title}</h3>
                      {day.island && <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${ic.badge}`}>📍 {day.island}</span>}
                    </div>
                    {day.transport && (
                      <div className="mb-3 bg-blue-50 rounded-xl p-2.5 text-xs text-blue-700 flex items-center gap-2 print:bg-blue-50/50">
                        <FaShip className="print:hidden" /> 🚢 {day.transport}
                      </div>
                    )}
                    <div className="space-y-3 print:space-y-2">
                      {day.morning && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 print:w-6 print:h-6"><FaSun className="text-amber-500 text-sm print:text-xs" /></div>
                          <div><p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-0.5">Morning</p><p className="text-sm text-slate-700 leading-relaxed print:text-xs">{day.morning}</p></div>
                        </div>
                      )}
                      {day.afternoon && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 print:w-6 print:h-6"><FaCloudSun className="text-blue-500 text-sm print:text-xs" /></div>
                          <div><p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-0.5">Afternoon</p><p className="text-sm text-slate-700 leading-relaxed print:text-xs">{day.afternoon}</p></div>
                        </div>
                      )}
                      {day.evening && (
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 print:w-6 print:h-6"><FaMoon className="text-purple-500 text-sm print:text-xs" /></div>
                          <div><p className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-0.5">Evening</p><p className="text-sm text-slate-700 leading-relaxed print:text-xs">{day.evening}</p></div>
                        </div>
                      )}
                    </div>
                    {day.meals && (
                      <div className="mt-4 bg-amber-50/50 rounded-xl p-3 text-xs print:mt-2 print:p-2">
                        <p className="font-semibold text-amber-700 mb-1">Meals</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 print:grid-cols-3">
                          {day.meals.breakfast && <p className="text-slate-600">🍳 {day.meals.breakfast}</p>}
                          {day.meals.lunch && <p className="text-slate-600">🍽️ {day.meals.lunch}</p>}
                          {day.meals.dinner && <p className="text-slate-600">🌙 {day.meals.dinner}</p>}
                        </div>
                      </div>
                    )}
                    {day.tips && (
                      <div className="mt-3 flex items-start gap-2 text-xs text-slate-500 bg-blue-50/50 rounded-lg p-2">
                        <FaLightbulb className="text-blue-400 mt-0.5 flex-shrink-0" />
                        <p>{day.tips}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestions Grid */}
      {itinerary?.suggestions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2 print:gap-4">
          {itinerary.suggestions.localCuisine?.length > 0 && (
            <SuggestionCard title="Must-Try Local Cuisine" icon={<FaUtensils className="text-orange-500" />} items={itinerary.suggestions.localCuisine} dotColor="text-orange-400" />
          )}
          {itinerary.suggestions.culturalSites?.length > 0 && (
            <SuggestionCard title="Cultural Sites & Heritage" icon={<FaLandmark className="text-purple-500" />} items={itinerary.suggestions.culturalSites} dotColor="text-purple-400" />
          )}
          {itinerary.suggestions.hiddenGems?.length > 0 && (
            <SuggestionCard title="Hidden Gems" icon={<FaHeart className="text-red-400" />} items={itinerary.suggestions.hiddenGems} dotColor="text-red-300" />
          )}
          {itinerary.suggestions.localCustoms?.length > 0 && (
            <SuggestionCard title="Local Customs & Etiquette" icon={<FaBookOpen className="text-teal-500" />} items={itinerary.suggestions.localCustoms} dotColor="text-teal-400" />
          )}
          {itinerary.suggestions.packingTips?.length > 0 && (
            <SuggestionCard title="Packing Tips" icon={<span>🎒</span>} items={itinerary.suggestions.packingTips} dotColor="text-slate-400" />
          )}
          {itinerary.suggestions.emergencyInfo && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/80 print:shadow-none print:border print:rounded-lg print:p-4">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">🏥 Emergency Info</h3>
              <div className="space-y-2 text-sm text-slate-700 print:text-xs">
                {itinerary.suggestions.emergencyInfo.nearestHospital && <p>🏥 {itinerary.suggestions.emergencyInfo.nearestHospital}</p>}
                {itinerary.suggestions.emergencyInfo.policeStation && <p>👮 {itinerary.suggestions.emergencyInfo.policeStation}</p>}
                {itinerary.suggestions.emergencyInfo.coastGuard && <p>⚓ {itinerary.suggestions.emergencyInfo.coastGuard}</p>}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {itinerary?.travelWarnings?.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 print:rounded-lg print:p-4">
          <h3 className="text-lg font-semibold text-amber-800 mb-4 flex items-center gap-2"><FaExclamationTriangle /> Important Warnings</h3>
          <ul className="space-y-2">
            {itinerary.travelWarnings.map((w, i) => <li key={i} className="flex items-start gap-2 text-sm text-amber-800 print:text-xs"><span className="text-amber-500 mt-0.5">⚠️</span> {w}</li>)}
          </ul>
        </div>
      )}

      {/* ═══ Branded Farewell Section (visible on screen AND print) ═══ */}
      <div className="bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 rounded-3xl p-10 md:p-14 border border-emerald-100 text-center print:rounded-xl print:p-8 print:mt-8 print:border-t-4 print:border-t-emerald-500">
        <div className="mb-6">
          <h2 className="text-2xl md:text-3xl font-light text-slate-700 mb-2 print:text-xl">
            EXPLORE <strong className="font-bold">ISLANDS</strong> <span className="text-sm text-slate-400">INDIA</span>
          </h2>
          <div className="w-16 h-0.5 bg-emerald-400 mx-auto mb-6 print:mb-4" />
        </div>
        
        <p className="text-lg md:text-xl text-slate-600 font-light leading-relaxed max-w-2xl mx-auto mb-4 print:text-sm print:leading-relaxed">
          ✨ Thank you for choosing <strong className="text-emerald-700">Explore Indian Islands</strong> to plan your dream trip.
        </p>
        <p className="text-base text-slate-500 font-light leading-relaxed max-w-2xl mx-auto mb-6 print:text-xs">
          Every island has a story waiting to be discovered, every sunset a memory waiting to be made, and every wave a rhythm waiting to be felt. 
          We hope this itinerary helps you create moments that stay with you forever. 🌊
        </p>
        <p className="text-sm text-slate-400 italic mb-2 print:text-xs">
          &ldquo;The world is a book, and those who do not travel read only one page.&rdquo; — Saint Augustine
        </p>
        
        <div className="mt-8 pt-6 border-t border-emerald-200/50 print:mt-4 print:pt-4">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm print:text-xs">
            <FaGlobe className="text-emerald-500" />
            <a href="https://www.exploreindianislands.com" className="text-emerald-600 hover:text-emerald-700 font-medium">www.exploreindianislands.com</a>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Crafted with ❤️ by Team Explore Indian Islands &nbsp;|&nbsp; AI-Powered Travel Planning
          </p>
          <p className="text-xs text-slate-300 mt-1">
            This itinerary was generated on {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}. Prices and availability are indicative and may vary.
          </p>
        </div>
      </div>

      {/* ═══ Action Buttons (screen only) ═══ */}
      <div className="flex flex-wrap gap-4 justify-center pt-4 print:hidden">
        <button onClick={onRestart} className="flex items-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-2xl font-semibold border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all"><FaRedo /> Plan Another Trip</button>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-semibold hover:shadow-xl transition-all"><FaDownload /> Download / Print</button>
      </div>

      {/* ═══ Print-only Footer ═══ */}
      <div className="hidden print:block" style={{ marginTop: '40px', padding: '16px 0', borderTop: '2px solid #10b981', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', color: '#94a3b8' }}>
          This travel itinerary is generated by Explore Indian Islands (www.exploreindianislands.com). Prices are indicative. Please verify availability before booking.
        </p>
      </div>
    </div>
  );
};

const SuggestionCard = ({ title, icon, items, dotColor }) => (
  <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/80 print:shadow-none print:border print:rounded-lg print:p-4 print:break-inside-avoid">
    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2 print:text-base">{icon} {title}</h3>
    <ul className="space-y-2 print:space-y-1">
      {items.map((item, idx) => <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 print:text-xs"><span className={`${dotColor} mt-0.5`}>•</span> {item}</li>)}
    </ul>
  </div>
);

export default ItineraryDisplay;
