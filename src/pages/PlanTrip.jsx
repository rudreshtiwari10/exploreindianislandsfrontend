import { Link } from 'react-router-dom';
import { FaMapMarkedAlt, FaCalendarAlt, FaCheckCircle, FaArrowRight, FaUmbrella, FaPassport } from 'react-icons/fa';

const PlanTrip = () => {
  const features = [
    {
      icon: <FaMapMarkedAlt />,
      title: 'Choose Your Destination',
      description: 'Browse our collection of stunning Indian islands and find your perfect getaway.',
      link: '/islands',
      color: 'from-slate-600 to-slate-700'
    },
    {
      icon: <FaCalendarAlt />,
      title: 'Best Time to Visit',
      description: 'Each island has its own ideal season. Plan your trip for the perfect weather.',
      color: 'from-slate-700 to-slate-800'
    },
    {
      icon: <FaPassport />,
      title: 'Travel Requirements',
      description: 'Some islands require special permits. Check requirements before planning.',
      color: 'from-slate-600 to-slate-700'
    },
    {
      icon: <FaUmbrella />,
      title: 'Pack Smart',
      description: 'From beachwear to trekking gear, we help you pack for your island adventure.',
      color: 'from-slate-700 to-slate-800'
    }
  ];

  const tips = [
    'Book flights and accommodations well in advance',
    'Check permit requirements for restricted islands',
    'Pack light, breathable clothing and sun protection',
    'Research local customs and cuisine beforehand',
    'Plan activities and excursions ahead of time',
    'Keep emergency contacts and travel insurance handy'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/40 via-blue-50/30 to-purple-50/20 pt-40 pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-24 animate-fade-in-up">
          <span className="text-sm font-medium tracking-widest text-emerald-700 uppercase mb-4 block">Planning</span>
          <h1 className="text-5xl md:text-6xl font-light text-slate-800 mb-6 tracking-tight">
            Plan Your <span className="font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Journey</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed">
            Let us help you create the perfect island adventure
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {features.map((feature, index) => (
            <div
              key={index}
              style={{ animationDelay: `${index * 0.1}s` }}
              className="group relative bg-white/60 backdrop-blur-sm rounded-3xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up overflow-hidden border border-white/80 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className="relative p-10">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mb-8 group-hover:from-slate-700 group-hover:to-slate-900 transition-all duration-500 shadow-lg group-hover:scale-110">
                  <div className="text-3xl text-slate-700 group-hover:text-white transition-colors duration-500">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-semibold text-slate-800 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed mb-6 font-light text-lg">
                  {feature.description}
                </p>
                {feature.link && (
                  <Link to={feature.link} className="inline-flex items-center gap-3 text-slate-700 hover:text-slate-900 font-medium group/link">
                    Explore Islands
                    <FaArrowRight className="text-sm group-hover/link:translate-x-2 transition-transform duration-300" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Travel Tips */}
        <div className="bg-gradient-to-br from-blue-500/5 to-emerald-500/5 backdrop-blur-sm rounded-3xl p-12 md:p-16 mb-24 animate-fade-in-up-delayed border border-white/60 shadow-xl">
          <h2 className="text-3xl font-semibold text-slate-800 mb-12 text-center">Essential Travel Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="flex items-start gap-5 group">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white shadow-md flex items-center justify-center mt-1 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-blue-600 transition-all duration-300 group-hover:scale-110">
                  <FaCheckCircle className="text-emerald-600 text-base group-hover:text-white transition-colors duration-300" />
                </div>
                <p className="text-slate-700 leading-relaxed font-light text-lg">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Seasonal Guide */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 md:p-16 mb-24 border border-white/80 shadow-xl">
          <h2 className="text-3xl font-semibold text-slate-800 mb-12 text-center">Seasonal Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-6">🌊</div>
              <h3 className="font-semibold text-xl mb-3 text-slate-800">Andaman Islands</h3>
              <p className="text-slate-600 font-light text-lg mb-2">October - May</p>
              <p className="text-sm text-slate-500 font-medium">Best: December - February</p>
            </div>
            <div className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-6">🏝️</div>
              <h3 className="font-semibold text-xl mb-3 text-slate-800">Lakshadweep</h3>
              <p className="text-slate-600 font-light text-lg mb-2">October - March</p>
              <p className="text-sm text-slate-500 font-medium">Best: November - February</p>
            </div>
            <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-6xl mb-6">🌴</div>
              <h3 className="font-semibold text-xl mb-3 text-slate-800">Mainland Islands</h3>
              <p className="text-slate-600 font-light text-lg mb-2">Year-round</p>
              <p className="text-sm text-slate-500 font-medium">Best: September - March</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="relative overflow-hidden rounded-3xl p-16 text-center bg-gradient-to-br from-slate-800 via-slate-700 to-emerald-900 shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6">Ready to Start Your Adventure?</h2>
            <p className="text-slate-200 text-xl mb-10 font-light max-w-2xl mx-auto leading-relaxed">
              Explore our islands and create memories that will last a lifetime
            </p>
            <Link to="/islands" className="inline-flex items-center gap-3 bg-white text-slate-800 hover:bg-gradient-to-r hover:from-emerald-500 hover:to-blue-600 hover:text-white font-semibold py-4 px-10 rounded-2xl transition-all duration-300 shadow-2xl hover:shadow-xl hover:scale-110 group">
              Browse All Islands
              <FaArrowRight className="text-sm group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanTrip;
