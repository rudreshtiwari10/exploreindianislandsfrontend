import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import { MdTravelExplore } from 'react-icons/md';
import axios from 'axios';
import AquaticScene from '../components/AquaticScene';
import './styles/auth.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const name = location.state?.name;
  const password = location.state?.password;

  // If no email in state, user probably manually visited this route
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setError('');
    setSuccess('');
    if (otp.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verifysignup`, { email, otp });
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
      }
      setSuccess('Account verified! Redirecting...');
      setTimeout(() => navigate('/islands'), 1200);
    } catch (err) {
      setError(err?.response?.data?.message || 'Verification failed. Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return;
    setError('');
    setSuccess('');
    
    try {
      await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role: 'user' });
      setSuccess('A new code has been sent.');
      setResendCooldown(60);
    } catch (err) {
      setError(err?.response?.data?.error || err?.response?.data?.message || 'Could not resend code. Please sign up again.');
    }
  };

  if (!email) return null; // Avoid rendering if redirecting

  return (
    <div className="auth-root">
      {/* ── Animated ocean background ── */}
      <AquaticScene />

      {/* ── Verification card ── */}
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
          <h2 className="auth-heading">Verify your email 📬</h2>
          <p className="auth-subheading">
            We sent a 6-digit code to {email}
          </p>

          {/* Step progress bar */}
          <div className="step-progress">
            <div className="step-item">
              <div className="step-circle inactive">1</div>
              <span className="step-label inactive">Details</span>
            </div>
            <div className="step-line active" />
            <div className="step-item">
              <div className="step-circle active">2</div>
              <span className="step-label active">Verify</span>
            </div>
          </div>

          {/* Alerts */}
          {error && <div className="auth-error-box">  <span>⚠️</span> {error}   </div>}
          {success && <div className="auth-success-box"><span>✅</span> {success} </div>}

          {/* ── OTP form ── */}
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-otp">Verification Code</label>
              <div className="input-wrap">
                <FaShieldAlt className="input-icon" />
                <input
                  id="signup-otp"
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
                  onClick={() => navigate('/signup')}
                >
                  ← Edit details
                </button>
                <button
                  type="button"
                  className="otp-resend-btn"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  style={{
                    color: resendCooldown > 0 ? 'rgba(140,210,240,0.25)' : '#34d399',
                    cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="signup-verify-btn"
              className="auth-submit-btn signup-btn"
              disabled={loading}
            >
              {loading ? (
                <><div className="btn-spinner" /><span>Verifying...</span></>
              ) : (
                <><span>Verify &amp; Continue</span><FaArrowRight style={{ fontSize: '0.85rem' }} /></>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
