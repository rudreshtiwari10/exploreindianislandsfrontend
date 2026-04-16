import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaKey, FaLock, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp+new pass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/forgotpassword`, { email });
      setSuccess('OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const resendOtp = async () => {
    setError(''); setSuccess(''); setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/auth/resendotp`, { email });
      setSuccess('OTP resent');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally { setLoading(false); }
  };

  const reset = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/auth/resetpassword`, { email, otp, password });
      setSuccess('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-4"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0d3b2e 100%)' }}
    >
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-4">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-light text-white tracking-widest">
              EXPLORE <span className="font-bold">ISLANDS</span>
            </h1>
            <p className="text-[10px] text-white/45 tracking-[0.25em] uppercase mt-1">India</p>
          </Link>
        </div>

        <div
          className="rounded-3xl p-6 shadow-2xl border border-white/12"
          style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(24px)' }}
        >
          <h2 className="text-2xl font-light text-white mb-1">Reset password</h2>
          <p className="text-white/50 text-sm mb-5">
            {step === 1 ? "We'll email you a one-time code" : 'Enter the code we sent and your new password'}
          </p>

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 rounded-lg px-4 py-2.5 text-red-300 text-sm mb-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-lg px-4 py-2.5 text-emerald-300 text-sm mb-3 flex items-center gap-2">
              <FaCheckCircle /> {success}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={sendOtp} className="space-y-4">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 text-sm" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 bg-white/7 border border-white/12 rounded-2xl text-white text-sm outline-none focus:border-emerald-400 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl text-white font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg disabled:opacity-50 transition"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          ) : (
            <form onSubmit={reset} className="space-y-4">
              <div className="relative">
                <FaKey className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 text-sm" />
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="w-full pl-11 pr-4 py-3 bg-white/7 border border-white/12 rounded-2xl text-white text-sm outline-none focus:border-emerald-400 transition tracking-widest"
                />
              </div>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35 text-sm" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password (min 6 chars)"
                  className="w-full pl-11 pr-4 py-3 bg-white/7 border border-white/12 rounded-2xl text-white text-sm outline-none focus:border-emerald-400 transition"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl text-white font-semibold text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:shadow-lg disabled:opacity-50 transition"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
              <button type="button" onClick={resendOtp} disabled={loading} className="w-full text-white/60 text-xs hover:text-white/90">
                Didn't get it? Resend OTP
              </button>
            </form>
          )}

          <p className="text-center text-white/45 text-sm mt-5">
            Remembered it?{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300">
              Back to sign in
            </Link>
          </p>
        </div>

        <p className="text-center mt-3">
          <Link to="/" className="text-white/30 text-xs hover:text-white/60 inline-flex items-center gap-1">
            <FaArrowLeft size={10} /> Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
