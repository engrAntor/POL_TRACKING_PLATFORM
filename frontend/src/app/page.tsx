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
    Sparkles,
    Check
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
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#061208]/80 border-b border-white/5 backdrop-blur-md overflow-visible">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between relative">
                    <div className="flex items-center gap-2">
                        <div className="relative w-32 h-10">
                            <img
                                src="/assets/logo/logo.png"
                                alt="AeroVectraNexus"
                                className="absolute top-1/2 left-0 -translate-y-1/2 h-36 w-auto object-contain brightness-0 invert"
                            />
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="#how-it-works" className="text-white/70 hover:text-[#4ADE80] text-sm font-medium transition-colors">How It Works</Link>
                        <Link href="#crisis" className="text-white/70 hover:text-[#4ADE80] text-sm font-medium transition-colors">The Crisis</Link>
                        <Link href="#solution" className="text-white/70 hover:text-[#4ADE80] text-sm font-medium transition-colors">Solution</Link>
                        <Link href="#pricing" className="text-white/70 hover:text-[#4ADE80] text-sm font-medium transition-colors">Pricing</Link>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/login" className="text-white text-sm font-medium hover:text-white/80">
                            Login
                        </Link>
                        <Link href="/register" className="bg-[#F97316] hover:bg-[#ea580c] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg hover:shadow-orange-500/20">
                            Join the Circular Economy
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-[#061208] border-t border-white/10 p-6 space-y-4 shadow-2xl">
                        <Link href="#how-it-works" className="block text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>How It Works</Link>
                        <Link href="#crisis" className="block text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>The Crisis</Link>
                        <Link href="#pricing" className="block text-white/80 hover:text-white" onClick={() => setIsMenuOpen(false)}>Pricing</Link>
                        <div className="pt-4 border-t border-white/10 space-y-4">
                            <Link href="/login" className="block text-white font-medium text-center py-2">Login</Link>
                            <Link href="/register" className="block bg-[#F97316] text-white text-center py-3 rounded-lg font-bold">Join Now</Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative min-h-screen flex flex-col justify-center bg-[#061208] text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.png')] opacity-5"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4ADE80]/5 rounded-full blur-[160px] pointer-events-none"></div>
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#F97316]/5 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="container mx-auto px-6 z-10 pt-32 pb-12 w-full">
                    <div className="relative max-w-5xl mx-auto text-center">
                        <div className="flex flex-col items-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 text-[#4ADE80]" />
                                <span className="text-xs font-bold tracking-widest uppercase text-gray-300">AeroVectraNexus — The Circular Hub</span>
                            </div>
                            
                            {/* Founding Partner Badge - Moved here for better layout */}
                            <div className="px-4 py-1.5 rounded-full border border-[#F97316]/30 bg-[#F97316]/5 text-[#F97316] text-[10px] sm:text-xs font-bold uppercase tracking-widest animate-pulse">
                                🔥 Founding Partner Program — Only 5 Spots Remaining
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-8 leading-[1.1] tracking-tight">
                            Stop Paying to Destroy What <br className="hidden lg:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4ADE80] to-[#22C55E]">
                                Another Facility Needs Today
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Your "waste" POL, chemicals, and consumables are not waste—they are stranded assets. <br className="hidden md:block" />
                            AVN transforms your disposal liabilities into revenue streams, cuts your carbon footprint, and eliminates the
                            <span className="text-white font-bold ml-1">$100K–$500K you currently pay for disposal on expired inventory and hazardous waste fees.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-16">
                            <Link href="/register" className="w-full sm:w-auto bg-[#F97316] hover:bg-[#ea580c] text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-[0_10px_20px_-5px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group">
                                Join the Circular Economy
                                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
                            </Link>
                            <Link href="#roi-calculator" className="w-full sm:w-auto border border-white/20 bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-xl font-bold text-lg transition-all backdrop-blur-sm flex items-center justify-center gap-2">
                                Calculate Your Savings
                            </Link>
                        </div>

                        {/* High-Fidelity Dashboard Mockup */}
                        <div className="relative mx-auto max-w-5xl group perspective-1000">
                            <div className="absolute -inset-4 bg-gradient-to-r from-[#4ADE80]/20 to-[#F97316]/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000"></div>
                            <div className="relative bg-[#0b1a10] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 transform transition-transform duration-700 hover:rotate-x-1">
                                <div className="absolute top-0 left-0 right-0 h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                                </div>
                                <img src="/assets/images/dashboard.png" alt="AVN circular marketplace dashboard" className="w-full h-auto object-cover pt-8 opacity-90 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* The Invisible Crisis */}
            <section id="crisis" className="py-24 bg-white relative overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto text-center mb-20">
                        <h2 className="text-sm font-bold text-[#F97316] tracking-[0.2em] uppercase mb-4">The Invisible Crisis</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-[#061208] mb-6">You’re Burning Cash on Four Fronts</h3>
                        <p className="text-xl text-gray-500">Traditional chemical management is a multi-layered liability chain.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <CrisisCard 
                            title="1. The Expiry Drain"
                            description="Chemicals and consumables expire on your shelf. You paid full price. You get zero value. You pay again for compliant disposal."
                            icon={<Clock className="w-8 h-8" />}
                        />
                        <CrisisCard 
                            title="2. The Disposal Trap"
                            description="Hazardous waste disposal is a liability chain. Documentation errors trigger regulatory actions; spills during transport become your legal problem."
                            icon={<Shield className="w-8 h-8" />}
                        />
                        <CrisisCard 
                            title="3. The Audit Burden"
                            description="Manual tracking consumes hundreds of staff hours. Missing paperwork triggers findings, fines, and operational shutdowns."
                            icon={<BarChart3 className="w-8 h-8" />}
                        />
                        <CrisisCard 
                            title="4. The Carbon Cost"
                            description="Every liter disposed adds to Scope 3 emissions. Every expired drum undermines ESG commitments and sustainability goals."
                            icon={<Leaf className="w-8 h-8" />}
                        />
                    </div>
                </div>
            </section>

            {/* The Circular Solution */}
            <section id="solution" className="py-32 bg-[#061208] text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4ADE80]/5 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h2 className="text-[#4ADE80] font-bold tracking-widest uppercase text-sm mb-4">The Circular Solution</h2>
                            <h3 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">From Waste Liability to <br /> Circular Asset</h3>
                            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                                AVN is the intelligent infrastructure for industrial chemical circularity. 
                                We do not just track inventory—we orchestrate a marketplace where your 
                                surplus becomes another facility’s critical supply.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="w-12 h-12 bg-[#4ADE80]/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Sparkles className="w-6 h-6 text-[#4ADE80]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Agent Lilian</h4>
                                        <p className="text-gray-400">Predicts expiry before it happens, eliminating waste at the source through proactive alerts.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                    <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center shrink-0">
                                        <Zap className="w-6 h-6 text-[#F97316]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold mb-2">Agent Marie</h4>
                                        <p className="text-gray-400">Matches surplus inventory to verified buyers, maximizing resource utilization and recovery revenue.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10 bg-gradient-to-br from-[#0E3B1F] to-[#061208] p-1 rounded-3xl shadow-2xl">
                                <div className="bg-[#061208] rounded-[calc(1.5rem-1px)] p-8 md:p-12 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#4ADE80]/10 rounded-full blur-2xl"></div>
                                    <div className="text-center mb-10">
                                        <div className="text-5xl font-black text-[#4ADE80] mb-2">$300K+</div>
                                        <div className="text-gray-400 uppercase tracking-widest text-xs font-bold">Annual Recovery Potential</div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full w-[70%] bg-[#4ADE80]"></div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Marketplace Recovery</span>
                                            <span className="text-white font-bold">70% Value Recovery</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mt-8">
                                            <div className="h-full w-[100%] bg-[#F97316]"></div>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Audit Readiness</span>
                                            <span className="text-white font-bold">100% Automated</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who This Is For */}
            <section className="py-24 bg-gray-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#061208] mb-4">Built for Every Facility Managing <br /> Expiring Chemicals Lifecycle</h2>
                        <p className="text-gray-500">If you pay for chemical disposal, you should onboard with AVN.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <AudienceCard title="Aviation MROs" items={["Aircraft lubricants", "Hydraulic fluids", "Solvents"]} />
                        <AudienceCard title="Marine Operations" items={["Engine oils", "Greases", "Cleaning chemicals"]} />
                        <AudienceCard title="Manufacturing" items={["Cutting fluids", "Industrial lubricants", "Process chemicals"]} />
                        <AudienceCard title="Energy & Utilities" items={["Transformer oils", "Turbine lubricants", "Coolants"]} />
                        <AudienceCard title="Transportation Fleets" items={["Fleet oils", "DEF", "Maintenance chemicals"]} />
                        <AudienceCard title="Chemical Processing" items={["Intermediate chemicals", "Specialty additives"]} />
                    </div>
                </div>
            </section>

            {/* The Numbers That Matter */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#061208] mb-8">Turn Your Waste Line <br /> Into a Revenue Line</h2>
                            <div className="space-y-4">
                                <ComparisonRow label="Annual Write-offs" before="$100K–$500K" after="Up to 70% recovery" />
                                <ComparisonRow label="Disposal Costs" before="$15K–$50K" after="Zero net disposal" />
                                <ComparisonRow label="Compliance" before="Manual & Risky" after="Automated & Secure" />
                                <ComparisonRow label="Emissions" before="Scope 3 waste" after="Verified reduction" />
                                <ComparisonRow label="Inventory" before="Reactive" after="Predictive AI" />
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-[#0E3B1F] rounded-3xl p-10 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="text-xl font-bold mb-6">Typical First-Year Impact (MRO)</h4>
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="text-3xl font-bold text-[#4ADE80] mb-1">$200K+</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Costs Avoided</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-[#4ADE80] mb-1">$100K–$300K</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Revenue Generated</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-[#F97316] mb-1">15–40t CO₂</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Carbon Reduced</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-[#F97316] mb-1">100%</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-wider">Audit Ready</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 bg-[#061208] text-white overflow-hidden relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-bold text-[#4ADE80] tracking-[0.2em] uppercase mb-4">How It Works</h2>
                        <h3 className="text-4xl md:text-5xl font-black mb-6">Four Steps to Circular Operations</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
                        {/* Connecting Line */}
                        <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                        
                        <StepItem 
                            number="01" 
                            title="Connect" 
                            description="Deploy IoT sensors or integrate existing systems for real-time tracking." 
                            icon={<Zap className="w-6 h-6" />}
                        />
                        <StepItem 
                            number="02" 
                            title="Predict" 
                            description="Lilian AI identifies at-risk inventory 30–90 days before expiry." 
                            icon={<Sparkles className="w-6 h-6" />}
                        />
                        <StepItem 
                            number="03" 
                            title="Circulate" 
                            description="Marie AI matches surplus to verified buyers in our network." 
                            icon={<RefreshCw className="w-6 h-6" />}
                        />
                        <StepItem 
                            number="04" 
                            title="Report" 
                            description="Automated sustainability and regulatory documentation generated." 
                            icon={<BarChart3 className="w-6 h-6" />}
                        />
                    </div>
                </div>
            </section>

            {/* Why Join Now / Founding Partner */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-block px-6 py-2 rounded-full bg-[#F97316]/10 text-[#F97316] font-bold text-sm mb-8 border border-[#F97316]/20">
                        Founding Partner Status (Strictly Limited to First 10 Facilities)
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-[#061208] mb-12">The Network Effect Favors Early Movers</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto text-left mb-16">
                        <PartnerBenefit text="Basic plan: FREE (no monthly fee, 30% transaction fee applies)" />
                        <PartnerBenefit text="Business tier: Advanced data analytics to optimize inventory decisions" />
                        <PartnerBenefit text="Premium tier: Free smart cabinet deployment (worth $15K per unit) with full IoT integration" />
                        <PartnerBenefit text="Priority matching to largest buyer pool at launch" />
                        <PartnerBenefit text="Dedicated onboarding specialist" />
                        <PartnerBenefit text="Founding Partner certification" />
                    </div>

                    <div className="bg-[#fcf8f5] border border-[#F97316]/10 rounded-2xl p-8 max-w-3xl mx-auto">
                        <p className="text-[#061208] font-bold text-lg mb-4">
                            Already Committed: 5 leading Singapore aviation and transport operators have secured founding partner status.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex -space-x-3">
                                {[1,2,3,4,5].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-bold text-gray-500">
                                        OP
                                    </div>
                                ))}
                            </div>
                            <span className="text-[#F97316] font-black text-xl">5 SPOTS REMAINING</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ROI Calculator rebranded for AVN */}
            <section id="roi-calculator" className="py-24 bg-gray-50 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#061208] mb-4">Calculate Your Value Recovery</h2>
                        <p className="text-gray-500">Estimate how much AVN can save your facility annually.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 overflow-hidden">
                        {/* Sliders Side */}
                        <div className="flex-1 space-y-12 py-4">
                            <div>
                                <div className="flex justify-between mb-6">
                                    <label className="font-bold text-gray-900 text-lg">Annual Disposal Budget</label>
                                    <span className="font-bold text-[#F97316] text-lg">${wasteAmount.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="10000"
                                    max="500000"
                                    step="5000"
                                    value={wasteAmount}
                                    onChange={(e) => setWasteAmount(parseInt(e.target.value))}
                                    className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
                                />
                                <div className="flex justify-between mt-3 text-sm text-gray-400 font-medium">
                                    <span>$10K</span>
                                    <span>$500K+</span>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-6">
                                    <label className="font-bold text-gray-900 text-lg">Inventory Turnover Rate</label>
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
                        <div className="lg:w-[400px] bg-[#061208] rounded-2xl p-10 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4ADE80]/10 rounded-full blur-[60px] pointer-events-none"></div>
                            
                            <h3 className="text-[#4ADE80] font-medium mb-3 uppercase tracking-wider text-sm">Estimated Annual Value</h3>
                            <div className="text-5xl font-black mb-2 tracking-tight">${projectedProfit}</div>
                            <div className="h-1.5 w-20 bg-[#4ADE80] rounded-full mb-6"></div>
                            <p className="text-sm text-gray-400 mb-8 leading-relaxed">
                                This includes predicted waste reduction, disposal fee elimination, and marketplace revenue generation.
                            </p>

                            <Link href="/register" className="w-full bg-[#F97316] hover:bg-[#ea580c] text-white py-4 rounded-xl font-bold text-center transition-all shadow-lg text-sm uppercase tracking-widest">
                                Claim My Savings
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Subscription Plans */}
            <section id="pricing" className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-sm font-bold text-[#F97316] tracking-[0.2em] uppercase mb-4">Subscription Plans</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-[#061208] mb-6">Start Free. Scale When Ready.</h3>
                        <p className="text-gray-500 max-w-2xl mx-auto">Flexible tiers designed for everyone from local workshops to global enterprise MROs.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <PlanColumn 
                            name="Basic" 
                            price="Free" 
                            fee="30% transaction fee"
                            bestFor="Small workshops, testing the platform"
                            features={[
                                { text: "50 item listing limit", included: true },
                                { text: "Lilian (Expiry Tracking)", included: true },
                                { text: "Buyer + Seller access", included: true },
                                { text: "Basic dashboard", included: true },
                                { text: "Email support", included: true },
                                { text: "Marie (Matching AI)", included: false },
                                { text: "Smart Cabinet", included: false },
                                { text: "Advanced Analytics", included: false }
                            ]}
                        />
                        <PlanColumn
                            name="Business"
                            price="Free 6mo*"
                            priceDetail="then $299/mo"
                            fee="20% transaction fee"
                            tag="Popular"
                            bestFor="Mid-size MROs optimizing operations"
                            features={[
                                { text: "Unlimited listings", included: true },
                                { text: "Lilian + Marie AI", included: true },
                                { text: "Buyer + Seller access", included: true },
                                { text: "Advanced analytics", included: true },
                                { text: "Priority chat + phone", included: true },
                                { text: "Automated ESG dashboards", included: true },
                                { text: "Smart Cabinet", included: false },
                                { text: "Predictive Analytics", included: false }
                            ]}
                        />
                        <PlanColumn 
                            name="Premium" 
                            price="$699" 
                            fee="10% transaction fee"
                            bestFor="Enterprise automation & compliance"
                            features={[
                                { text: "Unlimited listings", included: true },
                                { text: "Lilian + Marie AI", included: true },
                                { text: "Priority Matching", included: true },
                                { text: "1 Smart Cabinet included", included: true },
                                { text: "Predictive Analytics", included: true },
                                { text: "Dedicated account manager", included: true },
                                { text: "Custom ESG reports", included: true },
                                { text: "Full IoT integration", included: true }
                            ]}
                        />
                    </div>
                    
                    <p className="text-center mt-12 text-sm text-gray-400">
                        *Business tier: Free for first 6 months for Founding Partners. 30% fee applies during free period.
                    </p>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 bg-[#061208] relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/assets/images/grid-pattern.png')] opacity-5"></div>
                <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
                    <h2 className="text-3xl md:text-6xl font-black text-white mb-8 leading-tight">
                        Start Recovering <br /> Value Today — <span className="text-[#4ADE80]">Zero Risk</span>
                    </h2>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                        No credit card required. No setup fees. Start free, upgrade when you’re ready.
                        Your surplus is already losing value on the shelf. Every day of delay is disposal cost you could avoid.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/register" className="w-full sm:w-auto bg-[#F97316] hover:bg-[#ea580c] text-white px-10 py-5 rounded-xl font-bold text-lg transition-all shadow-2xl">
                            Claim Your Free Basic Account
                        </Link>
                        <div className="text-white/60 text-sm font-medium">
                            Join 5 leading aviation operators <br /> already committed.
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#010a05] text-white pt-24 pb-12 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <img src="/assets/logo/logo.png" alt="AVN" className="h-32 w-auto object-contain brightness-0 invert mb-6" />
                            <p className="text-gray-500 text-base leading-relaxed mb-8 max-w-md">
                                AVN — AeroVectraNexus is the intelligent infrastructure for industrial chemical circularity. 
                                Supported and endorsed by the Singapore Institute of Aerospace Engineers (SIAE).
                            </p>
                            <div className="flex items-center gap-4">
                                <img src="/assets/images/siae-logo.png" alt="SIAE Endorsed" className="h-12 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Platform</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="#how-it-works" className="hover:text-[#4ADE80] transition-colors">How It Works</Link></li>
                                <li><Link href="#crisis" className="hover:text-[#4ADE80] transition-colors">The Crisis</Link></li>
                                <li><Link href="#solution" className="hover:text-[#4ADE80] transition-colors">Circular Solution</Link></li>
                                <li><Link href="#pricing" className="hover:text-[#4ADE80] transition-colors">Subscription Plans</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6 text-white uppercase tracking-widest text-xs">Connect</h4>
                            <ul className="space-y-4 text-sm text-gray-500">
                                <li><Link href="/login" className="hover:text-[#F97316] transition-colors">User Login</Link></li>
                                <li><Link href="/register" className="hover:text-[#F97316] transition-colors">Become a Partner</Link></li>
                                <li><Link href="/contact" className="hover:text-[#F97316] transition-colors">Contact Support</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-gray-600">© 2024 AeroVectraNexus (AVN). All rights reserved.</p>
                        <div className="flex gap-8 text-xs text-gray-600">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Helper Components

function CrisisCard({ title, description, icon }: { title: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#F97316]/20 transition-all hover:shadow-xl group">
            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-[#061208] group-hover:text-[#F97316] transition-colors">
                {icon}
            </div>
            <h4 className="text-xl font-bold text-[#061208] mb-4">{title}</h4>
            <p className="text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

function AudienceCard({ title, items }: { title: string, items: string[] }) {
    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <h4 className="text-lg font-bold text-[#061208] mb-4 border-b border-gray-100 pb-4">{title}</h4>
            <ul className="space-y-2">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80]"></div>
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function ComparisonRow({ label, before, after }: { label: string, before: string, after: string }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{label}</div>
            <div className="flex gap-4 items-center">
                <div className="text-gray-400 line-through text-sm">{before}</div>
                <div className="text-[#0E3B1F] font-bold text-base">{after}</div>
            </div>
        </div>
    );
}

function StepItem({ number, title, description, icon }: { number: string, title: string, description: string, icon: React.ReactNode }) {
    return (
        <div className="relative z-10 group">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 group-hover:bg-[#4ADE80] group-hover:text-[#061208] transition-all">
                {icon}
            </div>
            <div className="text-[#4ADE80] font-black text-xs mb-2 tracking-widest">{number}</div>
            <h4 className="text-xl font-bold text-white mb-3">{title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}

function PartnerBenefit({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#4ADE80]/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-[#4ADE80]" />
            </div>
            <span className="text-gray-700 font-medium">{text}</span>
        </div>
    );
}

function PlanColumn({ name, price, priceDetail, fee, features, tag, bestFor }: any) {
    return (
        <div className={`relative p-8 rounded-3xl border ${tag ? 'border-[#F97316] bg-[#fdfaf8] ring-1 ring-[#F97316]' : 'border-gray-100 bg-white'} flex flex-col`}>
            {tag && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#F97316] text-white text-xs font-bold rounded-full uppercase tracking-widest">
                    {tag}
                </div>
            )}
            <h4 className="text-2xl font-black text-[#061208] mb-2">{name}</h4>
            <div className="mb-1">
                <span className="text-4xl font-black text-[#061208]">{price}</span>
                {!priceDetail && price !== 'Free' && <span className="text-gray-400 ml-1">/mo</span>}
            </div>
            {priceDetail && <div className="text-sm text-gray-500 mb-3">{priceDetail}</div>}
            <div className="text-sm font-bold text-[#F97316] mb-2">{fee}</div>
            <div className="text-xs text-gray-500 mb-8 h-8 leading-tight">{bestFor}</div>
            
            <div className="space-y-4 mb-10 flex-1">
                {features.map((f: any, i: number) => (
                    <div key={i} className={`flex items-start gap-3 text-sm ${f.included ? 'text-gray-700' : 'text-gray-300'}`}>
                        {f.included ? (
                            <Check className="w-4 h-4 text-[#4ADE80] shrink-0 mt-0.5" />
                        ) : (
                            <X className="w-4 h-4 text-gray-300 shrink-0 mt-0.5" />
                        )}
                        {f.text}
                    </div>
                ))}
            </div>
            
            <Link href="/register" className={`w-full py-4 rounded-xl font-bold text-center transition-all ${tag ? 'bg-[#F97316] text-white shadow-lg' : 'bg-gray-100 text-[#061208] hover:bg-gray-200'}`}>
                Get Started
            </Link>
        </div>
    );
}
