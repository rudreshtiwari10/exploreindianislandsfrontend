import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import GoogleAuthButton from '../components/GoogleAuthButton';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
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
            const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-4"
            style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0d3b2e 100%)',
            }}
        >
            {/* Decorative blobs */}
            <div style={{
                position: 'fixed', top: '-10rem', right: '-10rem',
                width: '40rem', height: '40rem',
                background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{
                position: 'fixed', bottom: '-10rem', left: '-10rem',
                width: '40rem', height: '40rem',
                background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />

            <div className="w-full" style={{ maxWidth: '440px', position: 'relative', zIndex: 1 }}>
                {/* Logo area */}
                <div className="text-center mb-4 animate-fade-in">
                    <Link to="/" className="inline-block" style={{ textDecoration: 'none' }}>
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
                    padding: '1.5rem',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
                }}>
                    <div className="mb-4">
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 300, color: 'white', marginBottom: '0.3rem' }}>
                            Welcome back
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 300 }}>
                            Sign in to continue your island journey
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '0.75rem',
                            padding: '0.625rem 1rem',
                            marginBottom: '1rem',
                            color: '#fca5a5',
                            fontSize: '0.875rem',
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                        {/* Email */}
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{
                                    position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem',
                                }} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    style={{
                                        width: '100%', paddingLeft: '2.5rem', paddingRight: '1rem',
                                        paddingTop: '0.625rem', paddingBottom: '0.625rem',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '0.875rem',
                                        color: 'white', fontSize: '0.9rem',
                                        outline: 'none', boxSizing: 'border-box',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(14,165,233,0.6)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 500, marginBottom: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{
                                    position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                                    color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem',
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    style={{
                                        width: '100%', paddingLeft: '2.5rem', paddingRight: '3rem',
                                        paddingTop: '0.625rem', paddingBottom: '0.625rem',
                                        background: 'rgba(255,255,255,0.07)',
                                        border: '1px solid rgba(255,255,255,0.12)',
                                        borderRadius: '0.875rem',
                                        color: 'white', fontSize: '0.9rem',
                                        outline: 'none', boxSizing: 'border-box',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(14,165,233,0.6)'; e.target.style.background = 'rgba(255,255,255,0.1)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.background = 'rgba(255,255,255,0.07)'; }}
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
                                marginTop: '0.25rem',
                                width: '100%',
                                padding: '0.75rem',
                                background: loading ? 'rgba(14,165,233,0.4)' : 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 50%, #6366f1 100%)',
                                border: 'none', borderRadius: '0.875rem',
                                color: 'white', fontWeight: 600, fontSize: '0.95rem',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.4s ease',
                                boxShadow: '0 8px 25px rgba(59,130,246,0.35)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            }}
                            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 14px 35px rgba(59,130,246,0.5)'; } }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.35)'; }}
                        >
                            {loading ? (
                                <span>Signing in...</span>
                            ) : (
                                <>
                                    <span>Sign In</span>
                                    <FaArrowRight style={{ fontSize: '0.8rem' }} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0', gap: '1rem' }}>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }} />
                    </div>

                    <GoogleAuthButton onError={setError} />

                    {/* Sign up link */}
                    <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.45)', fontSize: '0.875rem' }}>
                        Don&apos;t have an account?{' '}
                        <Link to="/signup" style={{
                            color: '#38bdf8', fontWeight: 600,
                            textDecoration: 'none', transition: 'color 0.2s',
                        }}
                            onMouseEnter={e => e.target.style.color = '#7dd3fc'}
                            onMouseLeave={e => e.target.style.color = '#38bdf8'}
                        >
                            Create one free
                        </Link>
                    </p>
                </div>

                {/* Back to home */}
                <p style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                    <Link to="/" style={{
                        color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem',
                        textDecoration: 'none', transition: 'color 0.2s',
                        letterSpacing: '0.05em',
                    }}
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

export default Login;
