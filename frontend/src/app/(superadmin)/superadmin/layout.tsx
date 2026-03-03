"use client";

import { useEffect, useState, useRef } from 'react';
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
    ChevronDown,
    Menu,
} from 'lucide-react';

const menuItems = [
    { name: 'DashBoard',       href: '/superadmin/overview',        icon: LayoutDashboard },
    { name: 'User Management', href: '/superadmin/users',           icon: Users           },
    { name: 'Administrators',  href: '/superadmin/administrators',  icon: ShieldCheck     },
    { name: 'Order',           href: '/superadmin/orders',          icon: ShoppingBag     },
    { name: 'User Issues',     href: '/superadmin/issues',          icon: AlertTriangle   },
];

// ── Role dropdown ─────────────────────────────────────────────────────────────
function RoleDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative flex-1">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
            >
                {value}
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    {["Admin", "Super Admin"].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => { onChange(r); setOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${r === value ? "text-[#0E3B1F] font-semibold" : "text-gray-700"}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Password input with show/hide ─────────────────────────────────────────────
function PwInput({ label, show, onToggle }: { label: string; show: boolean; onToggle: () => void }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="sm:w-36 text-sm font-medium text-gray-700 shrink-0">{label}</label>
            <div className="relative flex-1">
                <input
                    type={show ? "text" : "password"}
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

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
    const router   = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized]   = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Profile panel
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Notification panel
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef<HTMLDivElement>(null);

    // Modals
    const [showAccount,  setShowAccount]  = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Account modal state
    const [accountRole, setAccountRole] = useState("Super Admin");

    // Password show/hide
    const [showOldPw,     setShowOldPw]     = useState(false);
    const [showNewPw,     setShowNewPw]     = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem("superadmin_authenticated");
        if (!auth) {
            router.replace("/superadmindash");
        } else {
            setAuthorized(true);
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
        sessionStorage.removeItem("superadmin_authenticated");
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
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150 ${
                                    isActive
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
                            {pathname === '/superadmin/overview'       ? 'Dashboard'       :
                             pathname === '/superadmin/users'          ? 'User Management' :
                             pathname === '/superadmin/administrators' ? 'Administrators'  :
                             pathname === '/superadmin/orders'         ? 'Order'           :
                             pathname === '/superadmin/issues'         ? 'User Issues'     : 'Dashboard'}
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
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                            </button>

                            {showNotif && (
                                <div className="absolute right-0 top-12 w-[300px] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-900">Notifications</p>
                                    </div>
                                    <div className="max-h-[280px] overflow-y-auto">
                                        {[
                                            { title: "New User Registered", desc: "john.doe@example.com just created an account", time: "5 min ago" },
                                            { title: "New Order Placed", desc: "Order #1058 — 500L Diesel from Admin Foysal", time: "20 min ago" },
                                            { title: "Issue Reported", desc: "Admin Devon Lane submitted a support request", time: "1 hr ago" },
                                        ].map((n, i) => (
                                            <div key={i} className="px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50">
                                                <p className="text-sm font-medium text-gray-800">{n.title}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                                                <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                            </div>
                                        ))}
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
                                    src="/assets/images/my_dp.png"
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
                                                src="/assets/images/my_dp.png"
                                                alt="Profile"
                                                className="h-full w-full object-cover object-top"
                                            />
                                        </div>
                                        <p className="text-sm font-semibold text-gray-900">Antor Das</p>
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
                                        onClick={() => { setShowProfile(false); setShowAccount(true); }}
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
                                        <img src="/assets/images/my_dp.png" alt="Avatar" className="w-full h-full object-cover object-top" />
                                    </div>
                                    <label className="cursor-pointer px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                        Upload
                                        <input type="file" accept="image/*" className="hidden" />
                                    </label>
                                </div>
                            </div>
                            {[
                                { label: "Name",      type: "text",  placeholder: "Antor Das"         },
                                { label: "Email",     type: "email", placeholder: "antor@example.com" },
                                { label: "Phone",     type: "tel",   placeholder: "+880 1700-000000"  },
                                { label: "Company",   type: "text",  placeholder: "Sparktech Agency"  },
                                { label: "Job Title", type: "text",  placeholder: "Software Engineer" },
                            ].map(({ label, type, placeholder }) => (
                                <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <label className="sm:w-20 text-sm font-medium text-gray-700 shrink-0">{label}</label>
                                    <input
                                        type={type}
                                        placeholder={placeholder}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowAccount(false)}
                                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
                                style={{ background: '#0E3B1F' }}
                            >
                                Save
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
                            <PwInput label="Old Password"         show={showOldPw}     onToggle={() => setShowOldPw((v) => !v)}     />
                            <PwInput label="New Password"         show={showNewPw}     onToggle={() => setShowNewPw((v) => !v)}     />
                            <PwInput label="Re Type New Password" show={showConfirmPw} onToggle={() => setShowConfirmPw((v) => !v)} />
                        </div>

                        <div className="flex gap-3 mt-8">
                            <button
                                onClick={() => setShowPassword(false)}
                                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
                                style={{ background: '#0E3B1F' }}
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
