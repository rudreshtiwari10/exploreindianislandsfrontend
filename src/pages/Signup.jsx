import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight, FaShieldAlt } from 'react-icons/fa';
import axios from 'axios';
import GoogleAuthButton from '../components/GoogleAuthButton';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Signup = () => {
    const [step, setStep] = useState('form'); // 'form' | 'otp'
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(t);
    }, [resendCooldown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/auth/register`, {
                name,
                email,
                password,
                role: 'user',
            });
            setSuccess(`Verification code sent to ${email}`);
            setStep('otp');
            setResendCooldown(60);
        } catch (err) {
            const msg = err?.response?.data?.message || 'Signup failed. Please try again.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
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
            const msg = err?.response?.data?.message || 'Verification failed.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setError('');
        setSuccess('');
        try {
            await axios.post(`${API_BASE_URL}/auth/register`, { name, email, password, role: 'user' });
            setSuccess('A new code has been sent.');
            setResendCooldown(60);
        } catch (err) {
            setError(err?.response?.data?.message || 'Could not resend code.');
        }
    };

    const inputStyle = {
        width: '100%',
        paddingLeft: '2.5rem',
        paddingRight: '1rem',
        paddingTop: '0.6rem',
        paddingBottom: '0.6rem',
        background: 'rgba(255,255,255,0.07)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '0.875rem',
        color: 'white',
        fontSize: '0.9rem',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
    };

    const labelStyle = {
        display: 'block',
        color: 'rgba(255,255,255,0.6)',
        fontSize: '0.75rem',
        fontWeight: 500,
        marginBottom: '0.3rem',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    };

    const iconStyle = {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'rgba(255,255,255,0.35)',
        fontSize: '0.875rem',
    };

    const onFocus = (e) => {
        e.target.style.borderColor = 'rgba(16,185,129,0.6)';
        e.target.style.background = 'rgba(255,255,255,0.1)';
    };
    const onBlur = (e) => {
        e.target.style.borderColor = 'rgba(255,255,255,0.12)';
        e.target.style.background = 'rgba(255,255,255,0.07)';
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-2"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #0d3b2e 40%, #1a1a3e 100%)',
            }}
        >
            {/* Decorative blobs */}
            <div style={{
                position: 'fixed', top: '-10rem', left: '-10rem',
                width: '40rem', height: '40rem',
                background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'fixed', bottom: '-10rem', right: '-10rem',
                width: '40rem', height: '40rem',
                background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            <div className="w-full" style={{ maxWidth: '440px', position: 'relative', zIndex: 1 }}>
                {/* Logo area */}
                <div className="text-center mb-3 animate-fade-in">
                    <Link to="/" className="inline-block">
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 300, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.15em' }}>
                            EXPLORE <span style={{ fontWeight: 700 }}>ISLANDS</span>
                        </h1>
                        <p style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: '2px' }}>India</p>
                    </Link>
                </div>

                {/* Card */}
                <div className="animate-fade-in-up" style={{
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '1.5rem',
                    padding: '1.25rem 1.5rem',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                }}>
                    <div className="mb-3">
                        <h2 style={{ fontSize: '1.35rem', fontWeight: 300, color: 'white', marginBottom: '0.2rem' }}>
                            {step === 'form' ? 'Create account' : 'Verify your email'}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 300 }}>
                            {step === 'form'
                                ? 'Start exploring India\u2019s most beautiful islands'
                                : `We sent a 6-digit code to ${email}`}
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '0.6rem',
                            padding: '0.5rem 0.875rem',
                            marginBottom: '0.75rem',
                            color: '#fca5a5',
                            fontSize: '0.8rem',
                        }}>
                            {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div style={{
                            background: 'rgba(16,185,129,0.15)',
                            border: '1px solid rgba(16,185,129,0.3)',
                            borderRadius: '0.6rem',
                            padding: '0.5rem 0.875rem',
                            marginBottom: '0.75rem',
                            color: '#6ee7b7',
                            fontSize: '0.8rem',
                        }}>
                            {success}
                        </div>
                    )}

                    {step === 'otp' ? (
                        <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <label style={labelStyle}>Verification Code</label>
                                <div style={{ position: 'relative' }}>
                                    <FaShieldAlt style={iconStyle} />
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        placeholder="123456"
                                        style={{ ...inputStyle, letterSpacing: '0.4em', textAlign: 'center', fontSize: '1.1rem' }}
                                        onFocus={onFocus}
                                        onBlur={onBlur}
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    marginTop: '0.25rem', width: '100%', padding: '0.7rem',
                                    background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                                    border: 'none', borderRadius: '0.875rem',
                                    color: 'white', fontWeight: 600, fontSize: '0.95rem',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.4s ease',
                                    boxShadow: '0 8px 25px rgba(16,185,129,0.35)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                                }}
                            >
                                {loading ? <span>Verifying...</span> : <><span>Verify & Continue</span><FaArrowRight style={{ fontSize: '0.8rem' }} /></>}
                            </button>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                                <button
                                    type="button"
                                    onClick={() => { setStep('form'); setOtp(''); setError(''); setSuccess(''); }}
                                    style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0 }}
                                >
                                    ← Edit details
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resendCooldown > 0}
                                    style={{
                                        background: 'none', border: 'none', padding: 0,
                                        color: resendCooldown > 0 ? 'rgba(255,255,255,0.3)' : '#34d399',
                                        cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                                        fontWeight: 600,
                                    }}
                                >
                                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code'}
                                </button>
                            </div>
                        </form>
                    ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {/* Full Name */}
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <FaUser style={iconStyle} />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your full name"
                                    style={inputStyle}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={iconStyle} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    style={inputStyle}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={labelStyle}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={iconStyle} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    style={{ ...inputStyle, paddingRight: '3rem' }}
                                    onFocus={onFocus}
                                    onBlur={onBlur}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)',
                                        color: 'rgba(255,255,255,0.35)', background: 'none', border: 'none',
                                        cursor: 'pointer', padding: '0', fontSize: '0.875rem',
                                        transition: 'color 0.2s',
                                    }}
                                    onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.7)'}
                                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.35)'}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '0.25rem', // Changed from 0.5rem
                                width: '100%',
                                padding: '0.7rem', // Changed from 1rem
                                background: loading
                                    ? 'rgba(16,185,129,0.4)'
                                    : 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                                border: 'none', borderRadius: '0.875rem',
                                color: 'white', fontWeight: 600, fontSize: '0.95rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.4s ease',
                                boxShadow: '0 8px 25px rgba(16,185,129,0.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 35px rgba(16,185,129,0.5)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(16,185,129,0.35)'; }}
                        >
                            {loading ? (
                                <span>Sending code...</span>
                            ) : (
                                <>
                                    <span>Send Verification Code</span>
                                    <FaArrowRight style={{ fontSize: '0.8rem' }} />
                                </>
                            )}
                        </button>
                    </form>
                    )}

                    {step === 'form' && (
                      <>
                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', margin: '0.75rem 0', gap: '1rem' }}>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                            <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        </div>

                        <GoogleAuthButton onError={setError} />
                      </>
                    )}

                    {/* Login link */}
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem', marginTop: step === 'otp' ? '0.75rem' : 0 }}>
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            style={{ color: '#34d399', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
                            onMouseEnter={e => e.target.style.color = '#6ee7b7'}
                            onMouseLeave={e => e.target.style.color = '#34d399'}
                        >
                            Sign in instead
                        </Link>
                    </p>
                </div>

                {/* Back to home */}
                <p style={{ textAlign: 'center', marginTop: '0.6rem' }}>
                    <Link
                        to="/"
                        style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textDecoration: 'none', transition: 'color 0.2s', letterSpacing: '0.05em' }}
                        onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                        onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
                    >
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
