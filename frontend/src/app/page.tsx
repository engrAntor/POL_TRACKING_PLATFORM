"use client";

import Link from "next/link";
import { useState } from "react";
import {
    ArrowRight,
    CheckCircle,
    BarChart3,
    Shield,
    Zap,
    Globe,
    Leaf,
    Lock,
    Play,
    Menu,
    X,
    TrendingUp,
    Droplet,
    RefreshCw,
    Wallet,
    Truck,
    Clock,
    Users,
    DollarSign,
    Upload,
    Sparkles,
    HeartHandshake
} from "lucide-react";

export default function Home() {
    const [wasteAmount, setWasteAmount] = useState(400000);
    const [recoveryRate, setRecoveryRate] = useState(70);
    const [isMenuOpen, setIsMenuOpen] = useState(false);



    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#021f11]/90 border-b border-white/5 backdrop-blur-sm">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo */}
                        <div className="relative h-10 w-auto">
                            <img src="/assets/logo/logo.png" alt="AVN" className="h-full w-auto object-contain" />
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#how-it-works" className="text-white/90 hover:text-white text-sm font-medium transition-colors">How It Works</Link>
                        <Link href="#benefits" className="text-white/90 hover:text-white text-sm font-medium transition-colors">Benefits</Link>
                        <Link href="#roi-calculator" className="text-white/90 hover:text-white text-sm font-medium transition-colors">ROI Calculator</Link>
                        <Link href="#partners" className="text-white/90 hover:text-white text-sm font-medium transition-colors">Partners</Link>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/login" className="text-white text-sm font-medium hover:text-white/80">
                            Login
                        </Link>
                        <Link href="/register" className="bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-orange-500/20">
                            Become A partner
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-[#021f11] border-t border-white/10 p-4 space-y-4">
                        <Link href="#product" className="block text-white/80 hover:text-white">Our Product</Link>
                        <Link href="#benefits" className="block text-white/80 hover:text-white">Benefits</Link>
                        <Link href="#how-it-works" className="block text-white/80 hover:text-white">How It Works</Link>
                        <Link href="/login" className="block text-white font-medium">Login</Link>
                        <Link href="/register" className="block text-[#F97316] font-bold">Request Access</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-24 bg-[#021f11] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.png')] opacity-10"></div>

                {/* Green Glow Effects */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[128px] pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    {/* Floating Badge Left */}
                    <div className="hidden lg:flex absolute top-32 left-0 animate-fade-in-left z-20">
                        <div className="px-5 py-2.5 rounded-full border border-green-500/30 bg-[#0E3B1F]/90 backdrop-blur-md text-green-400 text-sm font-medium hover:border-green-400 transition-colors cursor-default shadow-lg shadow-green-900/10 whitespace-nowrap">
                            Limited to 15 Founding Partners
                        </div>
                    </div>

                    {/* Floating Stats Right - Top */}
                    <div className="hidden lg:flex absolute top-32 right-0 animate-fade-in-right delay-100 z-20">
                        <div className="flex items-center gap-3 bg-[#0E3B1F]/90 backdrop-blur-md border border-[#F97316]/20 p-3 rounded-xl shadow-xl hover:border-[#F97316]/40 transition-all">
                            <div className="p-2 bg-[#F97316]/10 rounded-lg">
                                <TrendingUp className="w-5 h-5 text-[#F97316]" />
                            </div>
                            <div className="text-left">
                                <div className="text-[#F97316] font-bold text-lg leading-none">60-80%</div>
                                <div className="text-gray-400 text-xs mt-1">Cost Recovery</div>
                            </div>
                        </div>
                    </div>

                    {/* Floating Stats Right - Bottom */}
                    <div className="hidden lg:flex absolute top-[20rem] right-0 animate-fade-in-right delay-300 z-20">
                        <div className="flex items-center gap-3 bg-[#0E3B1F]/90 backdrop-blur-md border border-green-500/20 p-3 rounded-xl shadow-xl hover:border-green-500/40 transition-all">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <Wallet className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-green-400 font-bold text-lg leading-none">$2B</div>
                                <div className="text-gray-400 text-xs mt-1">Annual Industry Waste</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative max-w-5xl mx-auto text-center mb-16 pt-10">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight">
                            Your <span className="text-green-400">$200K+</span> in Annual POL<br className="hidden md:block" />
                            Waste is About to Become <span className="text-green-400">Profit</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            The aviation industry's first intelligent marketplace where your near-expiry POL becomes another facility's urgent need—and you get paid instead of paying disposal fees.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
                            <Link href="/register" className="w-full sm:w-auto border border-green-600/30 bg-[#0E3B1F]/50 text-green-500 hover:text-white hover:bg-green-600/20 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm">
                                Become A Founder Partner
                            </Link>
                            <button className="w-full sm:w-auto bg-white text-[#0E3B1F] px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 hover:bg-gray-100 shadow-lg shadow-white/5">
                                See How It Works
                            </button>
                        </div>

                        {/* Dashboard Image */}
                        <div className="relative mx-auto max-w-6xl mt-8 group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-[#0E3B1F] rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/10">
                                <img
                                    src="/assets/images/dashboard.png"
                                    alt="Platform Dashboard"
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Real Numbers, Real Impact */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Real Numbers, Real Impact</h2>
                        <p className="text-gray-500">See the potential returns our early partners are projecting</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard
                            value="$300K-500K"
                            label="Typical Annual POL Waste"
                            sublabel="Per MRO facility"
                            icon={<DollarSign className="w-6 h-6 text-green-500" />}
                        />
                        <StatCard
                            value="$180K-350K"
                            label="Projected Recovery"
                            sublabel="Through AVN marketplace"
                            icon={<TrendingUp className="w-6 h-6 text-green-500" />}
                        />
                        <StatCard
                            value="60-80%"
                            label="Cost Recovery Rate"
                            sublabel="vs 0% write-off"
                            icon={<RefreshCw className="w-6 h-6 text-green-500" />}
                        />
                        <StatCard
                            value="10-15"
                            label="Launch Partners"
                            sublabel="Major MRO facilities"
                            icon={<Users className="w-6 h-6 text-green-500" />}
                        />
                    </div>
                </div>
            </section>

            {/* 4 Steps Section */}
            <section id="how-it-works" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block px-6 py-2 rounded-full border border-green-200 bg-green-50 text-green-600 font-bold text-sm mb-6">
                            How It Works
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">From Waste to Profit in 4 Simple Steps</h2>
                        <p className="text-gray-500">Our platform makes it effortless to turn your expiring inventory into revenue</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard
                            number="1"
                            title="List Your Surplus"
                            description="Upload your near-expiry POL inventory with batch numbers, quantities, and expiration dates. Our system handles the rest."
                            icon={<Upload className="w-6 h-6" />}
                        />
                        <StepCard
                            number="2"
                            title="AI-Powered Matching"
                            description="Our intelligent algorithm identifies facilities that need exactly what you have—before it expires. Smart matching maximizes your recovery rate."
                            icon={<Sparkles className="w-6 h-6" />}
                        />
                        <StepCard
                            number="3"
                            title="Seamless Transaction"
                            description="Review matched opportunities, negotiate if needed, and complete secure transactions through our verified platform."
                            icon={<HeartHandshake className="w-6 h-6" />}
                        />
                        <StepCard
                            number="4"
                            title="Get Paid"
                            description="Receive 60-80% of product value instead of 0% write-off. Payment processed within days of confirmed delivery."
                            icon={<Wallet className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section id="benefits" className="py-24 bg-[#062C1B] text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1 rounded-full bg-white/10 mb-4 border border-white/10">
                            <span className="text-sm font-bold text-green-400">Why Join Us?</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits for Founding Partners</h2>
                        <p className="text-gray-400">Unlock detailed privileges, insights, and premium access</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <BenefitCard
                            title="Immediate ROI"
                            description="Start seeing returns from day one with optimized waste management."
                            icon={<Zap className="w-6 h-6" />}
                        />
                        <BenefitCard
                            title="Network Effects"
                            description="Access a nationwide network of certified recyclers and buyers."
                            icon={<Globe className="w-6 h-6" />}
                        />
                        <BenefitCard
                            title="Smart Metering"
                            description="Real-time analytics and quality monitoring for all your assets."
                            icon={<BarChart3 className="w-6 h-6" />}
                        />
                        <BenefitCard
                            title="Zero Risk"
                            description="Compliance guaranted with automated regulatory reporting."
                            icon={<Shield className="w-6 h-6" />}
                        />
                        <BenefitCard
                            title="Sustainability Leader"
                            description="Boost your ESG score with verified waste reduction metrics."
                            icon={<Leaf className="w-6 h-6" />}
                        />
                        <BenefitCard
                            title="Priority Access"
                            description="Get first dibs on new features and premium buyer networks."
                            icon={<Lock className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </section>

            {/* ROI Calculator */}
            <section id="roi-calculator" className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block px-8 py-2 rounded-full bg-green-50 text-green-600 border border-green-100 font-bold mb-6">
                            ROI Calculator
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">See Your Potential Recovery</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Calculate how much your facility could recover through the AVN marketplace. Adjust the sliders to match your annual POL waste and expected recovery rate.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto items-center">
                        {/* Sliders Side */}
                        <div className="flex-1 w-full space-y-12">
                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="font-bold text-gray-900 text-xl">Annual POL Waste</label>
                                    <span className="font-bold text-green-500 text-2xl">${wasteAmount.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="100000"
                                    max="1000000"
                                    step="10000"
                                    value={wasteAmount}
                                    onChange={(e) => setWasteAmount(parseInt(e.target.value))}
                                    className="w-full h-4 bg-green-50 rounded-lg appearance-none cursor-pointer accent-gray-400 hover:accent-gray-500 transition-all"
                                />
                                <div className="flex justify-between mt-4 text-sm text-gray-400 font-medium">
                                    <span>$100K</span>
                                    <span>$1M</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-6">
                                    <label className="font-bold text-gray-900 text-xl">Recovery Rate</label>
                                    <span className="font-bold text-green-500 text-2xl">{recoveryRate}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="85"
                                    step="1"
                                    value={recoveryRate}
                                    onChange={(e) => setRecoveryRate(parseInt(e.target.value))}
                                    className="w-full h-4 bg-green-50 rounded-lg appearance-none cursor-pointer accent-gray-400 hover:accent-gray-500 transition-all"
                                />
                                <div className="flex justify-between mt-4 text-sm text-gray-400 font-medium">
                                    <span>50%</span>
                                    <span>85%</span>
                                </div>
                            </div>
                        </div>

                        {/* Result Side */}
                        <div className="w-full lg:w-[480px] bg-[#1a4a34] rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden ring-1 ring-white/10">
                            <h3 className="text-xl font-bold mb-8">Your Projected Results</h3>

                            <div className="space-y-4">
                                {/* Item 1 */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">${wasteAmount.toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">Current Annual Waste</div>
                                    </div>
                                </div>

                                {/* Item 2 */}
                                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold">${Math.round(wasteAmount * (recoveryRate / 100)).toLocaleString()}</div>
                                        <div className="text-xs text-gray-400">Projected Recovery</div>
                                    </div>
                                </div>

                                {/* Item 3 (Highlight) */}
                                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-green-500/10 animate-pulse"></div>
                                    <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center relative z-10">
                                        <span className="font-bold text-green-400 text-lg">%</span>
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-2xl font-bold text-green-400">${Math.round((wasteAmount * (recoveryRate / 100)) * 0.85).toLocaleString()}</div>
                                        <div className="text-xs text-green-200/70">Net Benefit (After Fees)</div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center text-[10px] text-gray-400 opacity-60">
                                * Based on 15% platform fee. Actual results may vary.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-[#011c10] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/20 via-[#011c10] to-[#011c10]"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <div className="inline-block px-6 py-2 rounded-full bg-green-900/30 border border-green-800/50 mb-10">
                        <span className="text-green-400 text-sm font-bold tracking-wide">Next 30 Days = Maximum Advantage</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight max-w-5xl mx-auto">
                        One Question: How Much POL Will You Write Off This Year <br className="hidden md:block" />
                        <span className="text-green-500">That Another Facility Needs Right Now?</span>
                    </h2>
                    <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
                        The facilities that join first will have the largest network when we launch. More connections = more sales opportunities.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-16">
                        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-[#F97316]/30 transition-colors group">
                            <Shield className="text-[#F97316] w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[#F97316] font-medium">Zero Upfront Costs</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-[#F97316]/30 transition-colors group">
                            <Clock className="text-[#F97316] w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[#F97316] font-medium">12-Month Pilot</span>
                        </div>
                        <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-full border border-white/5 hover:border-[#F97316]/30 transition-colors group">
                            <Sparkles className="text-[#F97316] w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="text-[#F97316] font-medium">Zero Monthly Fees</span>
                        </div>
                    </div>

                    {/* Feature Quote Box */}
                    <div className="max-w-4xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>

                        <p className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
                            "We're finalizing partners soon. Secure your spot in the network that'll define how the industry handles POL forever."
                        </p>

                        <div className="flex flex-col items-center">
                            <div className="text-green-500 font-bold text-lg mb-1">Nicholas Tan</div>
                            <div className="text-gray-400 text-sm">Hon Vice President, Singapore Institute of Aerospace Engineers</div>
                            <div className="text-gray-500 text-xs mt-1">CEO, Sino Aerospace Ventures</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#021f11] text-white pt-24 pb-12 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
                        {/* Brand Column */}
                        <div className="col-span-1 md:col-span-6">
                            <div className="flex items-center gap-2 mb-6">
                                <img src="/assets/logo/logo.png" alt="AVN" className="h-12 w-auto object-contain brightness-0 invert" />
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                                The aviation industry's first intelligent marketplace for near-expiry POL. Turning waste into profit, one transaction at a time.
                            </p>
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-[#F97316] hover:bg-white/10 transition-colors cursor-pointer">
                                <Shield className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Platform Column */}
                        <div className="col-span-1 md:col-span-3">
                            <h4 className="font-bold mb-8 text-white text-lg">Platform</h4>
                            <ul className="space-y-6 text-sm text-gray-400">
                                <li><Link href="#how-it-works" className="hover:text-green-400 transition-colors">How IT Works</Link></li>
                                <li><Link href="#benefits" className="hover:text-green-400 transition-colors">Partner Benefits</Link></li>
                                <li><Link href="#roi-calculator" className="hover:text-green-400 transition-colors">ROI Calculator</Link></li>
                                <li><Link href="#case-studies" className="hover:text-green-400 transition-colors">Case Studies</Link></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div className="col-span-1 md:col-span-3">
                            <h4 className="font-bold mb-8 text-white text-lg">Company</h4>
                            <ul className="space-y-6 text-sm text-gray-400">
                                <li><Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
                                <li><Link href="/sustainability" className="hover:text-green-400 transition-colors">Sustainability</Link></li>
                                <li><Link href="/contact" className="hover:text-green-400 transition-colors">Contact</Link></li>
                                <li><Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Helper Components

function StatCard({ value, label, sublabel, icon }: { value: string, label: string, sublabel?: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all hover:-translate-y-1 group text-center h-full flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-100 transition-colors">
                {icon}
            </div>
            <div className="text-3xl font-bold text-green-500 mb-2">{value}</div>
            <div className="text-sm font-bold text-gray-900 mb-1">{label}</div>
            {sublabel && <div className="text-xs text-gray-400">{sublabel}</div>}
        </div>
    );
}

function StepCard({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="relative p-8 bg-white rounded-2xl border border-gray-100 h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-base shadow-lg ring-4 ring-gray-50">
                {number}
            </div>
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6">
                {icon}
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

function BenefitCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="bg-[#0A3824] p-8 rounded-2xl border border-white/5 hover:bg-[#0E422C] transition-all group hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/20">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-all">
                {icon}
            </div>
            <h3 className="font-bold text-lg text-white mb-3">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}
