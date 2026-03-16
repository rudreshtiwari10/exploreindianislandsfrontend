import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaVenusMars, FaPen, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://explore-indian-island-backend.onrender.com/api';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        location: '',
        dateOfBirth: '',
        gender: '',
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
            const res = await axios.get(`${API_BASE_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = res.data.data;
            setUser(data);
            setForm({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                bio: data.bio || '',
                location: data.location || '',
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                gender: data.gender || '',
            });
        } catch (err) {
            if (err.response?.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            } else {
                setError('Failed to load profile.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');
        const token = localStorage.getItem('token');
        try {
            const { email, ...updateData } = form;
            const res = await axios.put(`${API_BASE_URL}/auth/updateprofile`, updateData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(res.data.data);
            setEditing(false);
            setSuccess('Profile updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            bio: user.bio || '',
            location: user.location || '',
            dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
            gender: user.gender || '',
        });
        setEditing(false);
        setError('');
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="w-10 h-10 border-4 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    const inputBase = 'w-full px-4 py-3 rounded-xl text-sm transition-all duration-300 outline-none';
    const inputEditing = `${inputBase} bg-white border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 text-slate-800`;
    const inputReadonly = `${inputBase} bg-slate-50 border border-slate-100 text-slate-600 cursor-default`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 pt-28 pb-16 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-6 transition-colors text-sm"
                >
                    <FaArrowLeft /> Back
                </button>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-6">
                    <div className="h-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600"></div>
                    <div className="px-8 pb-8 relative">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg -mt-12 relative">
                            {getInitials(user?.name)}
                        </div>

                        <div className="mt-4 flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-800">{user?.name}</h1>
                                <p className="text-slate-500 text-sm mt-1">{user?.email}</p>
                                {user?.bio && (
                                    <p className="text-slate-600 text-sm mt-2 max-w-md">{user.bio}</p>
                                )}
                                <p className="text-slate-400 text-xs mt-3">
                                    Member since {new Date(user?.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                            {!editing && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <FaPen className="text-xs" /> Edit
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm">
                        {success}
                    </div>
                )}

                {/* Profile Details Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                    <h2 className="text-lg font-semibold text-slate-800 mb-6">Personal Information</h2>

                    <div className="space-y-5">
                        {/* Name */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                <FaUser className="text-slate-400" /> Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={editing ? inputEditing : inputReadonly}
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email (always read-only) */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                <FaEnvelope className="text-slate-400" /> Email Address
                            </label>
                            <input
                                type="email"
                                value={form.email}
                                readOnly
                                className={`${inputReadonly} opacity-70`}
                            />
                            {editing && <p className="text-xs text-slate-400 mt-1">Email cannot be changed</p>}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                <FaPhone className="text-slate-400" /> Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={editing ? inputEditing : inputReadonly}
                                placeholder={editing ? 'Enter your phone number' : 'Not provided'}
                            />
                        </div>

                        {/* Two columns: DOB & Gender */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                    <FaCalendar className="text-slate-400" /> Date of Birth
                                </label>
                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={form.dateOfBirth}
                                    onChange={handleChange}
                                    readOnly={!editing}
                                    className={editing ? inputEditing : inputReadonly}
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                    <FaVenusMars className="text-slate-400" /> Gender
                                </label>
                                {editing ? (
                                    <select
                                        name="gender"
                                        value={form.gender}
                                        onChange={handleChange}
                                        className={inputEditing}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={form.gender ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1).replace(/-/g, ' ') : 'Not provided'}
                                        readOnly
                                        className={inputReadonly}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                <FaMapMarkerAlt className="text-slate-400" /> Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                readOnly={!editing}
                                className={editing ? inputEditing : inputReadonly}
                                placeholder={editing ? 'e.g. Mumbai, India' : 'Not provided'}
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">
                                <FaPen className="text-slate-400" /> Bio
                            </label>
                            <textarea
                                name="bio"
                                value={form.bio}
                                onChange={handleChange}
                                readOnly={!editing}
                                rows={3}
                                maxLength={300}
                                className={editing ? `${inputEditing} resize-none` : `${inputReadonly} resize-none`}
                                placeholder={editing ? 'Tell us a little about yourself...' : 'Not provided'}
                            />
                            {editing && (
                                <p className="text-xs text-slate-400 mt-1 text-right">{form.bio.length}/300</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    {editing && (
                        <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-100">
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-slate-800 rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50"
                            >
                                <FaSave /> {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            >
                                <FaTimes /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
