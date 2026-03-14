"use client";

import React, { useState, useEffect } from 'react';
import { Check, Crown, Shield, Zap, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/auth';

const TIERS = [
    {
        id: 'basic',
        name: 'Basic',
        icon: <Shield className="w-8 h-8 text-blue-500" />,
        price: '$29',
        period: '/month',
        description: 'Perfect for getting started and exploring the marketplace.',
        features: [
            'View inventory',
            'Create buy requests',
            'View marketplace',
            'Receive expiry alerts',
            '30% marketplace commission',
        ],
        missing: ['Limited access to marketplace features', 'No bulk data import functionality'],
        buttonColor: 'bg-blue-600 hover:bg-blue-700',
        badge: null,
        tierColor: '#3B82F6',
    },
    {
        id: 'business',
        name: 'Business',
        icon: <Zap className="w-8 h-8 text-[#FCD34D]" />,
        price: '$99',
        period: '/month',
        description: 'Everything you need to scale your POL business efficiently.',
        features: [
            'All Basic Membership features',
            'Ability to upload bulk data via CSV',
            'Priority alerts for inventory updates',
            'Priority expiry date alerts',
            'Enhanced marketplace visibility',
            '20% marketplace commission',
        ],
        missing: ['Special access for urgent transactions', 'Manual matching for critical items'],
        buttonColor: 'bg-[#1a2e22] hover:bg-[#2d5a45]',
        badge: 'Most Popular',
        tierColor: '#1a2e22',
    },
    {
        id: 'premium',
        name: 'Premium',
        icon: <Crown className="w-8 h-8 text-purple-500" />,
        price: '$299',
        period: '/month',
        description: 'Special access with the lowest rates for power sellers.',
        features: [
            'All Business features',
            'Special access for urgent transactions',
            'Faster processing',
            'Manual matching for critical POL items',
            'Lowest 10% marketplace commission',
        ],
        missing: [],
        buttonColor: 'bg-purple-600 hover:bg-purple-700',
        badge: 'Lowest Rates',
        tierColor: '#7C3AED',
    }
];

export default function SubscriptionPage() {
    const [loadingTier, setLoadingTier] = useState<string | null>(null);
    const [currentTier, setCurrentTier] = useState<string>('basic');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [stripeConnected, setStripeConnected] = useState(true);
    const [stripeConnecting, setStripeConnecting] = useState(false);

    // Show toast
    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    // Fetch current user profile to know active tier
    const fetchProfile = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE}/profile/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCurrentTier(data.subscription_tier || 'basic');
                setStripeConnected(data.stripe_onboarding_complete || false);
                // Also sync to localStorage
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    localStorage.setItem('user', JSON.stringify({ ...user, subscription_tier: data.subscription_tier }));
                }
            }
        } catch { /* silent */ }
    };

    // On mount — detect Stripe redirect and verify payment
    useEffect(() => {
        fetchProfile();

        const params = new URLSearchParams(window.location.search);
        const payment = params.get('payment');
        const tier = params.get('tier');
        const sessionId = params.get('session_id');

        if (payment === 'success' && tier && sessionId) {
            // Clean URL immediately
            window.history.replaceState({}, '', '/subscription');
            const token = localStorage.getItem('access_token');
            if (!token) return;

            // Call backend to verify and activate the subscription
            fetch(`${API_BASE}/verify-subscription/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ session_id: sessionId, tier_id: tier }),
            })
                .then(r => r.json())
                .then(data => {
                    if (data.status === 'success') {
                        setCurrentTier(data.subscription_tier);
                        // Refresh full profile so rest of UI knows about the tier
                        fetchProfile();
                        showToast('success', `🎉 You're now on the ${data.subscription_tier.charAt(0).toUpperCase() + data.subscription_tier.slice(1)} plan!`);
                    } else {
                        showToast('error', data.error || 'Could not activate subscription.');
                    }
                })
                .catch(() => showToast('error', 'Network error while verifying subscription.'));
        } else if (payment === 'cancelled') {
            window.history.replaceState({}, '', '/subscription');
            showToast('error', 'Subscription cancelled. No charges were made.');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleConnectStripe = async () => {
        setStripeConnecting(true);
        const token = localStorage.getItem('access_token');
        if (!token) { setStripeConnecting(false); return; }
        try {
            const res = await fetch(`${API_BASE}/stripe-connect/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                if (data.url) window.location.href = data.url;
            }
        } catch { /* silent */ }
        finally { setStripeConnecting(false); }
    };

    const handleSubscribe = async (tierId: string) => {
        setLoadingTier(tierId);
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                showToast('error', 'Please log in first!');
                setLoadingTier(null);
                return;
            }
            const res = await fetch(`${API_BASE}/subscribe/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ tier_id: tierId }),
            });
            const data = await res.json();
            if (res.ok && data.checkout_url) {
                window.location.href = data.checkout_url;
            } else if (data.error === 'stripe_not_connected') {
                setStripeConnected(false);
                setLoadingTier(null);
            } else {
                showToast('error', data.error || 'Subscription checkout failed.');
                setLoadingTier(null);
            }
        } catch {
            showToast('error', 'Something went wrong during checkout.');
            setLoadingTier(null);
        }
    };

    const tierObj = TIERS.find(t => t.id === currentTier);

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">

            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-white text-sm font-medium transition-all ${toast.type === 'success' ? 'bg-[#0E3B1F]' : 'bg-red-600'}`}>
                    {toast.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <XCircle className="w-5 h-5 shrink-0" />}
                    {toast.message}
                </div>
            )}

            <div className="text-center max-w-3xl mx-auto mb-8">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Choose the Right Plan for Your Business</h1>
                <p className="text-xl text-gray-500">Upgrade your tier to unlock bulk uploads, reduce marketplace commissions, and fast-track your POL sales.</p>
            </div>

            {/* Current plan badge */}
            {tierObj && (
                <div className="flex justify-center mb-10">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold shadow-sm" style={{ borderColor: tierObj.tierColor, color: tierObj.tierColor, background: tierObj.tierColor + '12' }}>
                        {React.cloneElement(tierObj.icon as React.ReactElement, { className: 'w-4 h-4' })}
                        Your current plan: <span className="font-bold">{tierObj.name}</span>
                    </div>
                </div>
            )}

            {/* Stripe connect banner */}
            {!stripeConnected && (
                <div className="max-w-2xl mx-auto mb-8">
                    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-800">Stripe account required</p>
                            <p className="text-xs text-amber-700 mt-1">Connect your Stripe account before purchasing a subscription.</p>
                        </div>
                        <button onClick={handleConnectStripe} disabled={stripeConnecting} className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-50 shrink-0" style={{ background: '#635BFF' }}>
                            {stripeConnecting ? 'Connecting...' : 'Connect Stripe'}
                        </button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {TIERS.map((tier) => {
                    const isActive = tier.id === currentTier;
                    return (
                        <div
                            key={tier.id}
                            className={`relative bg-white rounded-2xl shadow-xl border ${tier.badge === 'Most Popular' ? 'border-[#1a2e22] ring-2 ring-green-50 scale-105 z-10' : isActive ? 'border-current' : 'border-gray-200 mt-0 md:mt-4'} overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col`}
                            style={{ minHeight: '480px', borderColor: isActive ? tier.tierColor : undefined }}
                        >
                            {/* Active ribbon */}
                            {isActive && (
                                <div className="absolute top-0 left-0 right-0 text-white text-[10px] font-bold uppercase tracking-wider text-center py-1.5" style={{ background: tier.tierColor }}>
                                    ✓ Current Plan
                                </div>
                            )}
                            {!isActive && tier.badge && (
                                <div className="absolute top-0 left-0 right-0 bg-[#FCD34D] text-[#1a2e22] text-[10px] font-bold uppercase tracking-wider text-center py-1.5">
                                    {tier.badge}
                                </div>
                            )}

                            <div className={`p-6 ${tier.badge || isActive ? 'pt-8' : ''} border-b border-gray-100 flex-none`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                                    <div className="p-2.5 rounded-2xl bg-gray-50">{React.cloneElement(tier.icon as React.ReactElement, { className: 'w-6 h-6' })}</div>
                                </div>
                                <p className="text-gray-500 text-sm mb-4 min-h-[40px] leading-snug">{tier.description}</p>
                                <div className="flex items-baseline text-gray-900">
                                    <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                                    <span className="text-gray-500 ml-1 text-sm font-medium">{tier.period}</span>
                                </div>
                            </div>

                            <div className="p-6 flex-1 flex flex-col bg-gray-50/50">
                                <ul className="space-y-3 mb-6 flex-1">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="flex-shrink-0 mt-1"><Check className="h-5 w-5 text-green-500" /></div>
                                            <p className="ml-3 text-sm text-gray-700">{feature}</p>
                                        </li>
                                    ))}
                                    {tier.missing.map((feature, i) => (
                                        <li key={`missing-${i}`} className="flex items-start opacity-40">
                                            <div className="flex-shrink-0 mt-1">
                                                <div className="h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center">
                                                    <div className="w-2.5 h-[2px] bg-gray-300 rounded-full" />
                                                </div>
                                            </div>
                                            <p className="ml-3 text-sm text-gray-500">{feature}</p>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleSubscribe(tier.id)}
                                    disabled={loadingTier !== null || isActive || !stripeConnected}
                                    className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${tier.buttonColor}`}
                                >
                                    {isActive ? '✓ Active Plan' : !stripeConnected ? '🔒 Connect Stripe First' : loadingTier === tier.id ? 'Processing...' : 'Subscribe'}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Secure payment footer */}
            <div className="mt-16 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Payments are securely processed by Stripe. You can cancel or change your plan at any time.
            </div>
        </div>
    );
}
