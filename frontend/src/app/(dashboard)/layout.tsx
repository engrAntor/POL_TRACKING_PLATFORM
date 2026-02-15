"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Activity, ShoppingCart, Bell, Menu, X, ClipboardList } from 'lucide-react';

const menuItems = [
    { name: 'Overview', href: '/overview', icon: LayoutGrid },
    { name: 'Usage Tracker', href: '/tracker', icon: Activity },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
    { name: 'Inventory', href: '/inventory', icon: ClipboardList },
    { name: 'AI Notifications', href: '/notifications', icon: Bell },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
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
                    w-[260px] bg-[#0E3B1F] flex flex-col min-h-screen
                    transform transition-transform duration-300 ease-in-out
                    ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}
            >
                {/* Logo Section - matches header height */}
                <div className="flex items-center justify-between lg:justify-start px-4 lg:px-0 pt-3 h-[64px]">
                    <div className="flex items-center gap-0 -ml-6 lg:-ml-6">
                        <img
                            src="/assets/logo/logo.png"
                            alt="AVN Logo"
                            className="h-[130px] w-[130px] object-contain brightness-0 invert"
                        />
                        <span className="-ml-8 text-lg font-semibold text-white">Admin</span>
                    </div>
                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-white p-2"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 pt-12 overflow-y-auto">
                    <ul className="space-y-1">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={`flex items-center gap-5 rounded-lg px-4 py-4 text-base font-medium transition-colors ${isActive
                                            ? 'bg-white/20 text-white'
                                            : 'text-white/80 hover:bg-white/10 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="h-6 w-6" />
                                        {item.name}
                                        {isActive && (
                                            <span className="ml-auto text-white">›</span>
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Header - same height as logo section */}
                <header className="flex items-center justify-between bg-white px-4 lg:px-8 h-[80px] border-b border-gray-200 shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        <h1 className="text-lg lg:text-xl font-semibold text-gray-900 truncate">
                            {pathname === '/overview' ? 'Dashboard' :
                                pathname === '/tracker' ? 'Tracker' :
                                    pathname === '/marketplace' ? 'Marketplace' :
                                        pathname === '/notifications' ? 'AI Notifications' :
                                            pathname === '/inventory' ? 'Inventory' : 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-4">
                        <button className="relative p-2 text-gray-500 hover:text-gray-700">
                            <Bell className="h-5 w-5" />
                        </button>
                        <div className="h-10 w-10 lg:h-11 lg:w-11 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-white shadow-md ring-1 ring-gray-200 cursor-pointer hover:ring-gray-300 transition-all">
                            <img
                                src="/assets/images/my_dp.png"
                                alt="User Profile"
                                className="h-full w-full object-cover object-top"
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
