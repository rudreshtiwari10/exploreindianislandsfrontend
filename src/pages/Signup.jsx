import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight
} from 'react-icons/fa';
import { MdTravelExplore } from 'react-icons/md';
import axios from 'axios';
import GoogleAuthButton from '../components/GoogleAuthButton';
import AquaticScene from '../components/AquaticScene';
import './styles/auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// ── Password strength meter ───────────────────────────────────────────────────
const PasswordStrength = ({ password }) => {
  if (!password) return null;

  const score = password.length < 6 ? 1
    : password.length < 8 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
    : 3;

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
  const labels = ['Weak',    'Fair',    'Good',    'Strong' ];

  return (
    <div className="pw-strength">
      <div className="pw-strength-bars">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className="pw-strength-bar"
            style={{ background: i <= score ? colors[score - 1] : 'rgba(0,212,255,0.1)' }}
          />
        ))}
      </div>
      <span className="pw-strength-label" style={{ color: colors[score - 1] }}>
        {labels[score - 1]}
      </span>
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const Signup = () => {
  const [name, setName]               = useState('');
  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const navigate = useNavigate();

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role: 'user' });
      // On success, redirect to verify-otp page and pass credentials for resend capability
      navigate('/verify-otp', { state: { email, name, password } });
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err?.response?.data?.error || 'Signup failed. Please try again.';
      setError(errorMsg);
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="auth-root">

      {/* ── Animated ocean background ── */}
      <AquaticScene />

      {/* ── Sign-up card ── */}
      <div className="auth-card-wrapper">
        <div className="auth-card">

          {/* Logo */}
          <Link to="/" className="auth-logo-link">
            <div className="auth-logo-icon">
              <MdTravelExplore style={{ color: 'white' }} />
            </div>
            <div className="auth-logo-text">
              <h1>EXPLORE ISLANDS</h1>
              <p>India</p>
            </div>
          </Link>

          {/* Heading */}
          <h2 className="auth-heading">Start exploring! 🌊</h2>
          <p className="auth-subheading">
            Create your account and discover India's island paradise
          </p>

          {/* Step progress bar */}
          <div className="step-progress">
            <div className="step-item">
              <div className="step-circle active">1</div>
              <span className="step-label active">Details</span>
            </div>
            <div className={`step-line inactive`} />
            <div className="step-item">
              <div className={`step-circle inactive`}>2</div>
              <span className={`step-label inactive`}>Verify</span>
            </div>
          </div>

          {/* Alerts */}
          {error && <div className="auth-error-box"><span>⚠️</span> {error}</div>}

          {/* ── Registration form ── */}
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <div className="input-wrap">
                <FaUser className="input-icon" />
                <input
                  id="signup-name"
                  type="text"
                  required
                  className="auth-input"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <div className="input-wrap">
                <FaEnvelope className="input-icon" />
                <input
                  id="signup-email"
                  type="email"
                  required
                  className="auth-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <div className="input-wrap">
                <FaLock className="input-icon" />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="auth-input has-right-btn"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="toggle-pw-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label="Toggle password"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <PasswordStrength password={password} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="signup-submit-btn"
              className="auth-submit-btn signup-btn"
              disabled={loading}
            >
              {loading ? (
                <><div className="btn-spinner" /><span>Sending code...</span></>
              ) : (
                <><span>Send Verification Code</span><FaArrowRight style={{ fontSize: '0.85rem' }} /></>
              )}
            </button>
          </form>

          {/* Google auth */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or continue with</span>
            <div className="auth-divider-line" />
          </div>
          <GoogleAuthButton onError={setError} />

          {/* Switch to login */}
          <p className="auth-link-row">
            Already have an account?{' '}
            <Link to="/login">Sign in instead</Link>
          </p>

          <Link to="/" className="auth-back-link">← Back to Home</Link>

        </div>
      </div>
    </div>
  );
};

export default Signup;
