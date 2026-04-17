import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight,
} from 'react-icons/fa';
import { MdTravelExplore } from 'react-icons/md';
import axios from 'axios';
import GoogleAuthButton from '../components/GoogleAuthButton';
import AquaticScene from '../components/AquaticScene';
import './styles/auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Login = () => {
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
      }
      navigate('/islands');
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">

      {/* ── Animated ocean background ── */}
      <AquaticScene />

      {/* ── Sign-in card ── */}
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
          <h2 className="auth-heading">Welcome back! 👋</h2>
          <p className="auth-subheading">Sign in to continue your island journey</p>

          {/* Error alert */}
          {error && (
            <div className="auth-error-box">
              <span>⚠️</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="input-wrap">
                <FaEnvelope className="input-icon" />
                <input
                  id="login-email"
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
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-wrap">
                <FaLock className="input-icon" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="auth-input has-right-btn"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-pw-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit-btn"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FaArrowRight style={{ fontSize: '0.85rem' }} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or continue with</span>
            <div className="auth-divider-line" />
          </div>

          {/* Google */}
          <GoogleAuthButton onError={setError} />

          {/* Switch to sign-up */}
          <p className="auth-link-row">
            Don&apos;t have an account?{' '}
            <Link to="/signup">Create one free</Link>
          </p>

          <Link to="/" className="auth-back-link">← Back to Home</Link>

        </div>
      </div>
    </div>
  );
};

export default Login;
