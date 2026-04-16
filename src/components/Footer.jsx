import { Link, useLocation } from 'react-router-dom';
import { FaCompass, FaInstagram, FaFacebookF, FaTwitter, FaYoutube, FaEnvelope, FaMapMarkerAlt, FaHeart } from 'react-icons/fa';

const HIDDEN_PATHS = ['/login', '/signup', '/forgot-password'];

const Footer = () => {
  const location = useLocation();
  if (HIDDEN_PATHS.includes(location.pathname)) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 overflow-hidden text-slate-300" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #0d3b2e 50%, #1a1a3e 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block">
              <h2 className="text-2xl font-light text-white tracking-widest">
                EXPLORE <span className="font-bold">ISLANDS</span>
              </h2>
              <p className="text-[10px] text-emerald-300/70 tracking-[0.25em] uppercase mt-1">India</p>
            </Link>
            <p className="mt-5 text-sm text-slate-400 leading-relaxed">
              Discover paradise across India's stunning archipelagos. From the Andamans to Lakshadweep — explore, share, and plan your dream island getaway.
            </p>
            <div className="flex gap-3 mt-6">
              {[
                { icon: <FaInstagram />, href: '#' },
                { icon: <FaFacebookF />, href: '#' },
                { icon: <FaTwitter />, href: '#' },
                { icon: <FaYoutube />, href: '#' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-emerald-500/30 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-slate-400 hover:text-emerald-300 transition">Home</Link></li>
              <li><Link to="/about" className="text-slate-400 hover:text-emerald-300 transition">About Us</Link></li>
              <li><Link to="/islands" className="text-slate-400 hover:text-emerald-300 transition">All Islands</Link></li>
              <li><Link to="/explore" className="text-slate-400 hover:text-emerald-300 transition">Community Feed</Link></li>
              <li><Link to="/plan-trip" className="text-slate-400 hover:text-emerald-300 transition">Plan a Trip</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-emerald-300 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Island Groups */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Island Groups</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/islands?group=Andaman" className="text-slate-400 hover:text-emerald-300 transition">Andaman</Link></li>
              <li><Link to="/islands?group=Nicobar" className="text-slate-400 hover:text-emerald-300 transition">Nicobar</Link></li>
              <li><Link to="/islands?group=Lakshadweep" className="text-slate-400 hover:text-emerald-300 transition">Lakshadweep</Link></li>
              <li><Link to="/islands?group=Arabian Sea" className="text-slate-400 hover:text-emerald-300 transition">Arabian Sea</Link></li>
              <li><Link to="/islands?group=River Island" className="text-slate-400 hover:text-emerald-300 transition">River Islands</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Stay in the loop</h3>
            <p className="text-sm text-slate-400 mb-4">New islands, travel guides and community highlights — straight to your inbox.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-3">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-xs" />
                <input
                  type="email"
                  placeholder="your email"
                  className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:border-emerald-400 transition"
                />
              </div>
              <button className="py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition">
                Subscribe
              </button>
            </form>
            <div className="flex items-center gap-2 mt-5 text-xs text-slate-500">
              <FaMapMarkerAlt className="text-emerald-400" /> Made in India
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {year} Explore Indian Islands. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <FaHeart className="text-rose-500" /> for travelers
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-emerald-300 transition">Privacy</a>
            <a href="#" className="hover:text-emerald-300 transition">Terms</a>
            <a href="#" className="hover:text-emerald-300 transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
