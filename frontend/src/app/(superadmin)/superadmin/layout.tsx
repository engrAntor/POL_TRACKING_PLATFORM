"use client";

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    ShoppingBag,
    AlertTriangle,
    LogOut,
    Bell,
    ChevronRight,
    Eye,
    EyeOff,
    X,
    Menu,
} from 'lucide-react';

const menuItems = [
    { name: 'DashBoard', href: '/superadmin/overview', icon: LayoutDashboard },
    { name: 'User Management', href: '/superadmin/users', icon: Users },
    { name: 'Administrators', href: '/superadmin/administrators', icon: ShieldCheck },
    { name: 'Order', href: '/superadmin/orders', icon: ShoppingBag },
    { name: 'User Issues', href: '/superadmin/issues', icon: AlertTriangle },
];

// ── Password input with show/hide ─────────────────────────────────────────────
function PwInput({ label, show, onToggle, value, onChange }: { label: string; show: boolean; onToggle: () => void; value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="sm:w-36 text-sm font-medium text-gray-700 shrink-0">{label}</label>
            <div className="relative flex-1">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400 pr-9"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
}

const API_AUTH = 'http://127.0.0.1:8000/api/auth';
const API_BASE = 'http://127.0.0.1:8000';
const avatarUrl = (url?: string | null) => {
    if (!url) return '/assets/images/my_dp.png';
    if (url.startsWith('http')) return url;
    return `${API_BASE}${url}`;
};

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Profile panel
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Notification panel
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Modals
    const [showAccount, setShowAccount] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Profile data
    const [profileData, setProfileData] = useState({ first_name: '', last_name: '', email: '', phone: '', company: '', job_title: '', avatar: '' });
    const [profileName, setProfileName] = useState('');
    const [profileEmail, setProfileEmail] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    const [profileCompany, setProfileCompany] = useState('');
    const [profileJobTitle, setProfileJobTitle] = useState('');
    const [profileSaving, setProfileSaving] = useState(false);
    const [profileMsg, setProfileMsg] = useState('');

    // Avatar upload
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');

    // Password fields
    const [oldPw, setOldPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwSaving, setPwSaving] = useState(false);
    const [pwMsg, setPwMsg] = useState('');

    // Password show/hide
    const [showOldPw, setShowOldPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    // Bell notifications
    const [bellNotifs, setBellNotifs] = useState<{ id: number; title: string; description: string; created_at: string }[]>([]);

    const fetchBellNotifs = useCallback(async () => {
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch('http://127.0.0.1:8000/api/superadmin/notifications/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                const arr = Array.isArray(data) ? data : data.results || [];
                setBellNotifs(arr.slice(0, 5));
            }
        } catch { /* silent */ }
    }, []);

    useEffect(() => { if (authorized) fetchBellNotifs(); }, [authorized, fetchBellNotifs]);

    const relativeTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs} hr ago`;
        return `${Math.floor(hrs / 24)} day ago`;
    };

    const getToken = () => localStorage.getItem('access_token');

    const fetchProfile = useCallback(async () => {
        const token = getToken();
        if (!token) return;
        try {
            const res = await fetch(`${API_AUTH}/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setProfileData(data);
                setProfileName(`${data.first_name || ''} ${data.last_name || ''}`.trim());
                setProfileEmail(data.email || '');
                setProfilePhone(data.phone || '');
                setProfileCompany(data.company || '');
                setProfileJobTitle(data.job_title || '');
            }
        } catch { /* silent */ }
    }, []);

    useEffect(() => { if (authorized) fetchProfile(); }, [authorized, fetchProfile]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSaveProfile = async () => {
        setProfileSaving(true);
        setProfileMsg('');
        const token = getToken();
        if (!token) { setProfileMsg('Not authenticated.'); setProfileSaving(false); return; }
        try {
            const nameParts = profileName.trim().split(/\s+/);
            const first_name = nameParts[0] || '';
            const last_name = nameParts.slice(1).join(' ') || '';

            const formData = new FormData();
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('phone', profilePhone);
            formData.append('company', profileCompany);
            formData.append('job_title', profileJobTitle);
            if (avatarFile) formData.append('avatar', avatarFile);

            const res = await fetch(`${API_AUTH}/profile/`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (res.ok) {
                const data = await res.json();
                setProfileData(data);
                setAvatarFile(null);
                setAvatarPreview('');
                // Update localStorage user
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    localStorage.setItem('user', JSON.stringify({ ...user, first_name: data.first_name, last_name: data.last_name, full_name: data.full_name }));
                }
                setProfileMsg('Profile updated!');
                setTimeout(() => setProfileMsg(''), 2000);
            } else {
                const errData = await res.json().catch(() => ({}));
                setProfileMsg(errData.detail || 'Failed to update.');
            }
        } catch {
            setProfileMsg('Network error.');
        } finally {
            setProfileSaving(false);
        }
    };

    const handleChangePassword = async () => {
        setPwSaving(true);
        setPwMsg('');
        if (newPw !== confirmPw) { setPwMsg('Passwords do not match.'); setPwSaving(false); return; }
        if (newPw.length < 8) { setPwMsg('Minimum 8 characters.'); setPwSaving(false); return; }
        const token = getToken();
        if (!token) { setPwMsg('Not authenticated.'); setPwSaving(false); return; }
        try {
            const res = await fetch(`${API_AUTH}/change-password/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({ old_password: oldPw, new_password: newPw, confirm_new_password: confirmPw }),
            });
            if (res.ok) {
                setPwMsg('Password changed!');
                setOldPw(''); setNewPw(''); setConfirmPw('');
                setTimeout(() => { setPwMsg(''); setShowPassword(false); }, 2000);
            } else {
                const data = await res.json().catch(() => ({}));
                const msg = data.error || data.old_password?.[0] || data.new_password?.[0] || data.detail || 'Failed to change password.';
                setPwMsg(msg);
            }
        } catch {
            setPwMsg('Network error.');
        } finally {
            setPwSaving(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        const userStr = localStorage.getItem("user");
        if (!token || !userStr) {
            router.replace("/superadmindash");
            return;
        }
        try {
            const user = JSON.parse(userStr);
            if (user.role !== 'superadmin') {
                router.replace("/superadmindash");
                return;
            }
            setAuthorized(true);
        } catch {
            router.replace("/superadmindash");
        }
    }, [router]);

    // Close profile/notif panel when clicking outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setShowProfile(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
                setShowNotif(false);
            }
        }
        if (showProfile || showNotif) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [showProfile, showNotif]);

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        router.replace("/superadmindash");
    };

    if (!authorized) return null;

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed lg:static inset-y-0 left-0 z-30
                    w-[220px] shrink-0 flex flex-col min-h-screen
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
                style={{ background: '#1a2e22' }}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-4 lg:px-0 lg:justify-start pt-3 h-[64px]">
                    <div className="flex items-center gap-0 -ml-2 lg:-ml-6">
                        <img
                            src="/assets/logo/logo.png"
                            alt="AVN Logo"
                            className="h-[130px] w-[130px] object-contain brightness-0 invert"
                        />
                        <span className="-ml-8 text-base font-semibold text-white">Super Admin</span>
                    </div>
                    {/* Mobile close button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-white p-2"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 pt-12 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            (item.href !== '/superadmin/overview' && pathname.startsWith(item.href));
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${isActive
                                        ? 'text-white shadow-sm'
                                        : 'text-white/65 hover:text-white hover:bg-white/10'
                                    }`}
                                style={isActive ? { background: '#2d5a3d' } : {}}
                            >
                                <Icon className="w-[18px] h-[18px] shrink-0" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="px-3 pb-6">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all duration-150"
                    >
                        <LogOut className="w-[18px] h-[18px] shrink-0" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Top Header */}
                <header className="flex items-center justify-between bg-white px-4 lg:px-8 h-[64px] lg:h-[80px] border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile hamburger */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                        <h1 className="text-base lg:text-xl font-semibold text-gray-900 truncate">
                            {pathname === '/superadmin/overview' ? 'Dashboard' :
                                pathname === '/superadmin/users' ? 'User Management' :
                                    pathname === '/superadmin/administrators' ? 'Administrators' :
                                        pathname === '/superadmin/orders' ? 'Order' :
                                            pathname === '/superadmin/issues' ? 'User Issues' : 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-3">
                        {/* Notification bell */}
                        <div className="relative" ref={notifRef}>
                            <button
                                onClick={() => { setShowNotif((v) => !v); setShowProfile(false); }}
                                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <Bell className="w-5 h-5 text-gray-500" />
                                {bellNotifs.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                                )}
                            </button>

                            {showNotif && (
                                <div className="absolute right-0 top-12 w-[300px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                                    </div>
                                    <div className="max-h-[280px] overflow-y-auto">
                                        {bellNotifs.length === 0 ? (
                                            <div className="px-4 py-6 text-center text-sm text-gray-400">No notifications</div>
                                        ) : (
                                            bellNotifs.map((n) => (
                                                <div key={n.id} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50">
                                                    <p className="text-sm font-medium text-gray-800">{n.title}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{n.description}</p>
                                                    <p className="text-[10px] text-gray-400 mt-1">{relativeTime(n.created_at)}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Avatar — clickable, opens profile panel */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setShowProfile((v) => !v)}
                                className="w-9 h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md ring-1 ring-gray-200 hover:ring-gray-400 transition-all"
                            >
                                <img
                                    src={avatarUrl(profileData.avatar)}
                                    alt="User Profile"
                                    className="h-full w-full object-cover object-top"
                                />
                            </button>

                            {/* Profile Panel */}
                            {showProfile && (
                                <div className="absolute right-0 top-12 lg:top-14 w-[200px] sm:w-[220px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    {/* Avatar + name + badge */}
                                    <div className="flex flex-col items-center pt-5 pb-3 px-4">
                                        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full overflow-hidden border-2 border-white shadow ring-1 ring-gray-200 mb-2">
                                            <img
                                                src={avatarUrl(profileData.avatar)}
                                                alt="Profile"
                                                className="h-full w-full object-cover object-top"
                                            />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">{profileData.first_name} {profileData.last_name}</p>
                                        <span
                                            className="mt-1 px-3 py-0.5 rounded-full text-xs font-medium text-white"
                                            style={{ background: '#0E3B1F' }}
                                        >
                                            Super Admin
                                        </span>
                                    </div>

                                    <div className="border-t border-gray-100 mx-3" />

                                    {/* Profile row */}
                                    <button
                                        onClick={() => { setShowProfile(false); setShowAccount(true); setAvatarFile(null); setAvatarPreview(''); fetchProfile(); }}
                                        className="flex items-center justify-between w-full px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <span>Profile</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </button>

                                    {/* Change Password row */}
                                    <button
                                        onClick={() => { setShowProfile(false); setShowPassword(true); }}
                                        className="flex items-center justify-between w-full px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <span>Change Password</span>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </button>

                                    <div className="px-3 pb-3 pt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-colors"
                                            style={{ background: '#0E3B1F' }}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-7 bg-gray-50">
                    {children}
                </main>
            </div>

            {/* ── Account Setting Modal ─────────────────────────────────────── */}
            {showAccount && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setShowAccount(false)}
                >
                    <div
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-[420px] px-6 sm:px-8 py-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowAccount(false)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900 transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>

                        <h2 className="text-center text-lg font-bold text-gray-900 mb-7">Account Setting</h2>

                        <div className="space-y-4">
                            {/* Profile Picture */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <label className="sm:w-20 text-sm font-medium text-gray-700 shrink-0">Photo</label>
                                <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-300 shrink-0">
                                        <img src={avatarPreview || avatarUrl(profileData.avatar)} alt="Avatar" className="w-full h-full object-cover object-top" />
                                    </div>
                                    <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                        {avatarFile ? 'Change' : 'Upload'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                    </label>
                                    {avatarFile && <span className="text-xs text-green-600">Selected</span>}
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <label className="sm:w-20 text-sm font-medium text-gray-700 shrink-0">Name</label>
                                <input type="text" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Full name" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <label className="sm:w-20 text-sm font-medium text-gray-700 shrink-0">Email</label>
                                <input type="email" value={profileEmail} disabled className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none bg-gray-50 text-gray-500 cursor-not-allowed" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <label className="sm:w-20 text-sm font-medium text-gray-700 shrink-0">Phone</label>
                                <input type="tel" value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} placeholder="+880 1700-000000" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <label className="sm:w-20 text-sm font-medium text-gray-700 shrink-0">Company</label>
                                <input type="text" value={profileCompany} onChange={(e) => setProfileCompany(e.target.value)} placeholder="Company name" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                <label className="sm:w-20 text-sm font-medium text-gray-700 shrink-0">Job Title</label>
                                <input type="text" value={profileJobTitle} onChange={(e) => setProfileJobTitle(e.target.value)} placeholder="Job title" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                        </div>

                        {profileMsg && <p className={`text-sm text-center mt-4 ${profileMsg.includes('updated') ? 'text-green-600' : 'text-red-500'}`}>{profileMsg}</p>}

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowAccount(false)}
                                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={profileSaving}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
                                style={{ background: '#0E3B1F' }}
                            >
                                {profileSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Password Change Modal ─────────────────────────────────────── */}
            {showPassword && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setShowPassword(false)}
                >
                    <div
                        className="relative bg-white rounded-2xl shadow-xl w-full max-w-[460px] px-6 sm:px-8 py-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowPassword(false)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900 transition-colors"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>

                        <h2 className="text-center text-lg font-bold text-gray-900 mb-7">Change Password</h2>

                        <div className="space-y-4">
                            <PwInput label="Old Password" show={showOldPw} onToggle={() => setShowOldPw((v) => !v)} value={oldPw} onChange={setOldPw} />
                            <PwInput label="New Password" show={showNewPw} onToggle={() => setShowNewPw((v) => !v)} value={newPw} onChange={setNewPw} />
                            <PwInput label="Re Type New Password" show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} value={confirmPw} onChange={setConfirmPw} />
                        </div>

                        {pwMsg && <p className={`text-sm text-center mt-4 ${pwMsg.includes('changed') ? 'text-green-600' : 'text-red-500'}`}>{pwMsg}</p>}

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => { setShowPassword(false); setOldPw(''); setNewPw(''); setConfirmPw(''); setPwMsg(''); }}
                                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleChangePassword}
                                disabled={pwSaving || !oldPw || !newPw || !confirmPw}
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors disabled:opacity-50"
                                style={{ background: '#0E3B1F' }}
                            >
                                {pwSaving ? 'Updating...' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
