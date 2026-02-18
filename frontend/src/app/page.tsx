"use client";

import Link from "next/link";
import { useState } from "react";
import {
    BarChart3,
    Shield,
    Zap,
    Globe,
    Leaf,
    Lock,
    Menu,
    X,
    TrendingUp,
    Droplet,
    RefreshCw,
    Wallet,
    Truck,
    Clock,
    Sparkles
} from "lucide-react";

export default function Home() {
    const [wasteAmount, setWasteAmount] = useState(25000);
    const [recoveryRate, setRecoveryRate] = useState(70);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Calculate projected profit
    const projectedProfit = (wasteAmount * (recoveryRate / 100) * 2).toLocaleString();

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#061208] border-b border-white/5 backdrop-blur-sm overflow-visible">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between relative">
                    <div className="flex items-center gap-2">
                        {/* Spacer holds flex width; logo overflows nav top/bottom via absolute */}
                        <div className="relative w-32 h-10">
                            <img
                                src="/assets/logo/logo.png"
                                alt="POL"
                                className="absolute top-1/2 left-0 -translate-y-1/2 h-36 w-auto object-contain brightness-0 invert"
                            />
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
                    <div className="md:hidden bg-[#061208] border-t border-white/10 p-4 space-y-4">
                        <Link href="#product" className="block text-white/80 hover:text-white">Our Product</Link>
                        <Link href="#benefits" className="block text-white/80 hover:text-white">Benefits</Link>
                        <Link href="#how-it-works" className="block text-white/80 hover:text-white">How It Works</Link>
                        <Link href="/login" className="block text-white font-medium">Login</Link>
                        <Link href="/register" className="block text-[#F97316] font-bold">Request Access</Link>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex flex-col justify-center bg-[#061208] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.png')] opacity-10"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#F97316]/15 rounded-full blur-[140px] pointer-events-none"></div>

                {/* Floating Badge Left — anchored to header */}
                <div className="hidden xl:flex absolute top-[22%] left-[12%] z-20">
                    <div className="px-5 py-2.5 rounded-full border border-[#F97316]/30 bg-[#061208]/90 backdrop-blur-md text-[#F97316] text-sm font-medium cursor-default shadow-lg whitespace-nowrap">
                        Limited to 15 Founding Partners
                    </div>
                </div>

                {/* Floating Stat Right — Top, anchored to header */}
                <div className="hidden xl:flex absolute top-[18%] right-[12%] z-20">
                    <div className="flex items-center gap-3 bg-[#061208]/90 backdrop-blur-md border border-[#F97316]/20 p-3 rounded-xl shadow-xl">
                        <div className="p-2 bg-[#F97316]/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-[#F97316]" />
                        </div>
                        <div className="text-left">
                            <div className="text-[#F97316] font-bold text-lg leading-none">60-80%</div>
                            <div className="text-gray-400 text-xs mt-1">Cost Recovery</div>
                        </div>
                    </div>
                </div>

                {/* Floating Stat Right — Bottom, anchored to header */}
                <div className="hidden xl:flex absolute top-[28%] right-[12%] z-20">
                    <div className="flex items-center gap-3 bg-[#061208]/90 backdrop-blur-md border border-[#F97316]/20 p-3 rounded-xl shadow-xl">
                        <div className="p-2 bg-[#F97316]/10 rounded-lg">
                            <Wallet className="w-5 h-5 text-[#F97316]" />
                        </div>
                        <div className="text-left">
                            <div className="text-[#F97316] font-bold text-lg leading-none">$2B</div>
                            <div className="text-gray-400 text-xs mt-1">Annual Industry Waste</div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-6 z-10 pt-24 pb-12 w-full">
                    <div className="relative max-w-5xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-tight tracking-tight">
                            Your <span className="text-[#F97316]">$200K+</span> in Annual POL<br className="hidden md:block" />
                            Waste is About to Become <span className="text-[#F97316]">Profit</span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            The aviation industry's first intelligent marketplace where your near-expiry POL becomes another facility's urgent need—and you get paid instead of paying disposal fees.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-10 sm:mb-14">
                            <Link href="/register" className="w-full sm:w-auto border border-[#F97316]/30 bg-[#F97316]/10 text-[#F97316] hover:text-white hover:bg-[#F97316]/20 px-8 py-4 rounded-lg font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 backdrop-blur-sm">
                                Become A Founder Partner
                            </Link>
                            <button className="w-full sm:w-auto bg-white text-[#061208] px-8 py-4 rounded-lg font-bold text-lg transition-all flex items-center justify-center gap-2 hover:bg-gray-100 shadow-lg">
                                See How It Works
                            </button>
                        </div>

                        {/* Dashboard Image */}
                        <div className="relative mx-auto max-w-5xl group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#F97316] to-[#ea580c] rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-[#061208] rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/10">
                                <img src="/assets/images/dashboard.png" alt="Platform Dashboard" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Real Numbers Section */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Real Numbers, Real Impact</h2>
                        <p className="text-gray-500">See detailed statistics regarding waste recycling</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <StatCard
                            value="$200K - $500K"
                            label="In Annual POL Savings"
                            icon={<Wallet className="w-6 h-6 text-[#F97316]" />}
                        />
                        <StatCard
                            value="$100K - $300K"
                            label="Recovery Revenue"
                            icon={<RefreshCw className="w-6 h-6 text-[#F97316]" />}
                        />
                        <StatCard
                            value="40-90%"
                            label="Cost Reduction"
                            icon={<TrendingUp className="w-6 h-6 text-[#F97316]" />}
                        />
                        <StatCard
                            value="10-15"
                            label="Labor Hours Saved"
                            icon={<Clock className="w-6 h-6 text-[#F97316]" />}
                        />
                    </div>
                </div>
            </section>

            {/* 4 Steps Section */}
            <section id="how-it-works" className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[#F97316] font-bold tracking-wider uppercase text-sm mb-2 block">How It Works</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">From Waste to Profit in 4 Simple Steps</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <StepCard
                            number="1"
                            title="Get Your Sampler"
                            description="Install our IoT sensors or use manual samplers to track oil quality."
                            icon={<Droplet />}
                        />
                        <StepCard
                            number="2"
                            title="Automated Matching"
                            description="Our AI matches your waste oil with top recyclers in the network."
                            icon={<RefreshCw />}
                        />
                        <StepCard
                            number="3"
                            title="Seamless Transaction"
                            description="Secure digital agreements and logistics coordination."
                            icon={<Truck />}
                        />
                        <StepCard
                            number="4"
                            title="Get Paid"
                            description="Receive payments directly to your account for recovered oil."
                            icon={<Wallet />}
                        />
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section id="benefits" className="py-24 bg-[#062C1B] text-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <div className="inline-block px-4 py-1 rounded-full bg-white/10 mb-4 border border-white/10">
                            <span className="text-sm font-bold text-[#F97316]">Why Join Us?</span>
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
                        <div className="inline-block px-4 py-1 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/20 mb-4">
                            <span className="text-sm font-bold">Calculator</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">See Your Potential Recovery</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 overflow-hidden">
                        {/* Sliders Side */}
                        <div className="flex-1 space-y-12 py-4">
                            <div>
                                <div className="flex justify-between mb-6">
                                    <label className="font-bold text-gray-900 text-lg">Annual POL Waste</label>
                                    <span className="font-bold text-[#F97316] text-lg">${wasteAmount.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1000"
                                    max="100000"
                                    step="500"
                                    value={wasteAmount}
                                    onChange={(e) => setWasteAmount(parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
                                />
                                <div className="flex justify-between mt-3 text-sm text-gray-400 font-medium">
                                    <span>$1K</span>
                                    <span>$100K+</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-6">
                                    <label className="font-bold text-gray-900 text-lg">Recovery Rate</label>
                                    <span className="font-bold text-[#F97316] text-lg">{recoveryRate}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={recoveryRate}
                                    onChange={(e) => setRecoveryRate(parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
                                />
                                <div className="flex justify-between mt-3 text-sm text-gray-400 font-medium">
                                    <span>10%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>

                        {/* Result Side */}
                        <div className="lg:w-[400px] bg-gradient-to-br from-[#0E3B1F] to-[#062C1B] rounded-2xl p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-inner">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F97316]/10 rounded-full blur-[60px] pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#F97316]/10 rounded-full blur-[40px] pointer-events-none"></div>

                            <h3 className="text-[#F97316] font-medium mb-3 uppercase tracking-wider text-sm">Total Projected Profit</h3>
                            <div className="text-5xl font-bold mb-2 tracking-tight">${projectedProfit}</div>
                            <div className="h-1 w-20 bg-[#F97316] rounded-full mb-6"></div>
                            <p className="text-sm text-gray-300 mb-8 leading-relaxed">Estimated annual revenue based on current market rates and your waste volume.</p>

                            <Link href="/register" className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white py-4 rounded-lg font-bold text-center transition-all shadow-lg hover:shadow-orange-500/20 text-sm uppercase tracking-wide">
                                Start Recovering Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-[#021f11] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.png')] opacity-5"></div>
                <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">

                    {/* Badge */}
                    <div className="inline-flex items-center px-5 py-2 rounded-full border border-white/20 mb-10">
                        <span className="text-white text-sm font-medium">Next 30 Days = Maximum Advantage</span>
                    </div>

                    {/* Headline */}
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        One Question: How Much POL Will You Write Off This Year <br className="hidden md:block" />
                        <span className="text-[#F97316]">That Another Facility Needs Right Now?</span>
                    </h2>

                    {/* Subtext */}
                    <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        The facilities that join first will have the largest network when we launch. More connections = more sales opportunities.
                    </p>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-4 mb-14">
                        <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-[#F97316]/50 bg-[#F97316]/5">
                            <Shield className="text-[#F97316] w-5 h-5" />
                            <span className="text-[#F97316] font-semibold">Zero Upfront Costs</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-[#F97316]/50 bg-[#F97316]/5">
                            <Clock className="text-[#F97316] w-5 h-5" />
                            <span className="text-[#F97316] font-semibold">12-Month Pilot</span>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-full border border-[#F97316]/50 bg-[#F97316]/5">
                            <Sparkles className="text-[#F97316] w-5 h-5" />
                            <span className="text-[#F97316] font-semibold">Zero Monthly Fees</span>
                        </div>
                    </div>

                    {/* Testimonial Card */}
                    <div className="max-w-2xl mx-auto border border-white/10 rounded-xl p-8 bg-white/3 text-left">
                        <p className="text-white font-semibold text-base leading-relaxed mb-6">
                            We're finalizing partners soon. Secure your spot in the network that'll define how the industry handles POL forever.
                        </p>
                        <div>
                            <p className="text-[#F97316] font-bold text-base">Nicholas Tan</p>
                            <p className="text-gray-400 text-sm mt-1">Hon Vice President, Singapore Institute of Aerospace Engineers</p>
                            <p className="text-gray-400 text-sm">CEO, Sino Aerospace Ventures</p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#01140b] text-white pt-16 pb-10 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 items-center">

                        {/* Brand Column */}
                        <div className="col-span-1">
                            <img src="/assets/logo/logo.png" alt="AVN" className="h-36 w-auto object-contain brightness-0 invert mb-3" />
                            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-xs">
                                The aviation industry's first intelligent marketplace for near-expiry POL. Turning waste into profit, one transaction at a time.
                            </p>
                            {/* Shield social icon */}
                            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-gray-400 hover:text-white hover:border-[#F97316] transition-colors cursor-pointer">
                                <Shield className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Platform Column */}
                        <div>
                            <h4 className="font-bold mb-6 text-white">Platform</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="#how-it-works" className="hover:text-[#F97316] transition-colors">How It Works</Link></li>
                                <li><Link href="#benefits" className="hover:text-[#F97316] transition-colors">Partner Benefits</Link></li>
                                <li><Link href="#roi-calculator" className="hover:text-[#F97316] transition-colors">ROI Calculator</Link></li>
                                <li><Link href="#" className="hover:text-[#F97316] transition-colors">Case Studies</Link></li>
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h4 className="font-bold mb-6 text-white">Company</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="/about" className="hover:text-[#F97316] transition-colors">About Us</Link></li>
                                <li><Link href="#" className="hover:text-[#F97316] transition-colors">Sustainability</Link></li>
                                <li><Link href="/contact" className="hover:text-[#F97316] transition-colors">Contact</Link></li>
                                <li><Link href="/privacy" className="hover:text-[#F97316] transition-colors">Privacy Policy</Link></li>
                            </ul>
                        </div>

                    </div>
                    <div className="border-t border-white/5 pt-8">
                        <p className="text-xs text-gray-600">© 2024 POL Tracking Platform. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Helper Components

function StatCard({ value, label, icon }: { value: string, label: string, icon: React.ReactNode }) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-lg transition-all hover:-translate-y-1 group text-center">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-orange-100 transition-colors">
                {icon}
            </div>
            <div className="text-2xl font-bold text-[#F97316] mb-2">{value}</div>
            <div className="text-sm font-medium text-gray-500">{label}</div>
        </div>
    );
}

function StepCard({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="relative p-8 bg-white rounded-2xl border border-gray-100 h-full shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#F97316] text-white rounded-full flex items-center justify-center font-bold text-base shadow-lg ring-4 ring-gray-50">
                {number}
            </div>
            <div className="w-14 h-14 bg-orange-50 text-[#F97316] rounded-xl flex items-center justify-center mb-6">
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
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 text-[#F97316] group-hover:bg-[#F97316] group-hover:text-white transition-all">
                {icon}
            </div>
            <h3 className="font-bold text-lg text-white mb-3">{title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{description}</p>
        </div>
    );
}
