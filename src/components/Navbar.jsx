import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaEnvelope, FaMapMarkedAlt, FaBars, FaTimes, FaSignOutAlt, FaUser, FaCompass } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    closeMenu();
    navigate('/');
  };

  useEffect(() => {
    // Always show navbar on non-home pages
    if (!isHomePage) {
      setIsVisible(true);
      return;
    }

    // On homepage, show navbar only after scrolling
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const shouldShow = scrollPosition > 100;
      setIsVisible(shouldShow);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Explore', path: '/explore', icon: <FaCompass /> },
    { name: 'Contact', path: '/contact', icon: <FaEnvelope /> },
    { name: 'Plan a trip', path: '/plan-trip', icon: <FaMapMarkedAlt /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-slate-200/60 transition-all duration-500 ${isVisible ? 'navbar-visible animate-slide-down' : 'navbar-hidden'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left side - Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${isActive(link.path)
                    ? 'text-slate-800 bg-slate-100'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-slate-700 hover:text-slate-900 focus:outline-none transition-colors p-2"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>

          {/* Right side - Logo & Auth Buttons */}
          <div className="flex items-center gap-6">
            
            <div className="hidden md:flex items-center space-x-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <FaUser />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Logo */}
            <Link to="/" onClick={closeMenu} className="flex items-center group">
              <div className="text-right">
                <h1 className="text-2xl font-light text-slate-800 tracking-wider group-hover:text-slate-600 transition-colors duration-300">
                  EXPLORE <span className="font-semibold">ISLANDS</span>
                </h1>
                <p className="text-[10px] text-slate-500 tracking-[0.2em] uppercase">India</p>
              </div>
            </Link>
            
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-slate-100">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base transition-all duration-300 ${isActive(link.path)
                      ? 'text-slate-800 bg-slate-100'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                    }`}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span>{link.name}</span>
                </Link>
              ))}
              <div className="border-t border-slate-200 mt-2 pt-2">
                {isLoggedIn ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-300"
                    >
                      <FaUser className="text-lg" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-300 w-full"
                    >
                      <FaSignOutAlt className="text-lg" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-300"
                    >
                      <FaUser className="text-lg" />
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-base text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all duration-300"
                    >
                      <FaUser className="text-lg" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
