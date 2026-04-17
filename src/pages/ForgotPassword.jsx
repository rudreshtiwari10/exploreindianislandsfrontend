import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaEnvelope, FaLock, FaShieldAlt, FaEye, FaEyeSlash, FaArrowRight
} from 'react-icons/fa';
import { MdTravelExplore } from 'react-icons/md';
import axios from 'axios';
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

const ForgotPassword = () => {
  const [step, setStep]                 = useState('email'); // 'email' | 'otp'
  const [email, setEmail]               = useState('');
  const [otp, setOtp]                   = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const navigate = useNavigate();

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgotpassword`, { email });
      setSuccess(`Reset code sent to ${email}`);
      setStep('otp');
      setResendCooldown(60);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/resendotp`, { email });
      setSuccess('A new reset code has been sent.');
      setResendCooldown(60);
    } catch (err) {
      setError(err?.response?.data?.error || 'Could not resend code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/auth/resetpassword`, { email, otp, password });
      setSuccess('Password reset successfully! Redirecting...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to reset password. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      {/* ── Animated ocean background ── */}
      <AquaticScene />

      {/* ── Forgot Password card ── */}
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
          <h2 className="auth-heading">
            {step === 'email' ? 'Forgot Password? 🔐' : 'Reset Password ✨'}
          </h2>
          <p className="auth-subheading">
            {step === 'email'
              ? "No worries! We'll send you a recovery code."
              : `Enter the code we sent to ${email}`}
          </p>

          {/* Alerts */}
          {error && (
            <div className="auth-error-box">
              <span>⚠️</span> {error}
            </div>
          )}
          {success && (
            <div className="auth-success-box">
              <span>✅</span> {success}
            </div>
          )}

          {step === 'otp' ? (
            /* ── Reset Step ── */
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-otp">Verification Code</label>
                <div className="input-wrap">
                  <FaShieldAlt className="input-icon" />
                  <input
                    id="reset-otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    className="auth-input otp-input"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="• • • • • •"
                    autoFocus
                  />
                </div>
                <div className="otp-helper">
                  <button
                    type="button"
                    className="otp-edit-btn"
                    onClick={() => { setStep('email'); setOtp(''); setError(''); setSuccess(''); }}
                  >
                    ← Edit email
                  </button>
                  <button
                    type="button"
                    className="otp-resend-btn"
                    onClick={handleResend}
                    disabled={resendCooldown > 0 || loading}
                    style={{
                      color: resendCooldown > 0 ? 'rgba(140,210,240,0.25)' : '#34d399',
                      cursor: resendCooldown > 0 || loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label" htmlFor="reset-password">New Password</label>
                <div className="input-wrap">
                  <FaLock className="input-icon" />
                  <input
                    id="reset-password"
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

              <button
                type="submit"
                id="reset-submit-btn"
                className="auth-submit-btn signup-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner" />
                    <span>Resetting...</span>
                  </>
                ) : (
                  <>
                    <span>Reset Password</span>
                    <FaArrowRight style={{ fontSize: '0.85rem' }} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ── Email Step ── */
            <form onSubmit={handleSendOtp}>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email Address</label>
                <div className="input-wrap">
                  <FaEnvelope className="input-icon" />
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    className="auth-input"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                id="forgot-submit-btn"
                className="auth-submit-btn signup-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="btn-spinner" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <>
                    <span>Get Reset Code</span>
                    <FaArrowRight style={{ fontSize: '0.85rem' }} />
                  </>
                )}
              </button>
            </form>
          )}

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">Oh, I remember!</span>
            <div className="auth-divider-line" />
          </div>

          <p className="auth-link-row" style={{ marginTop: '0' }}>
            <Link to="/login">Back to Sign In</Link>
          </p>

          <Link to="/" className="auth-back-link">← Back to Home</Link>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
