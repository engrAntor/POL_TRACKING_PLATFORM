"use client";

import React, { useState } from 'react';
import { Check, Crown, Shield, Zap } from 'lucide-react';

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
    }
];

export default function SubscriptionPage() {
    const [loadingTier, setLoadingTier] = useState<string | null>(null);

    const handleSubscribe = async (tierId: string) => {
        setLoadingTier(tierId);
        try {
            const token = localStorage.getItem('access_token');
            // If they are not logged in, they can't subscribe
            if (!token) {
                alert("Please log in first!");
                // Optionally redirect to login here: window.location.href = '/login';
                setLoadingTier(null);
                return;
            }

            const res = await fetch(`http://127.0.0.1:8000/api/auth/subscribe/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ tier_id: tierId })
            });
            const data = await res.json();
            
            if (res.ok && data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                console.error('Subscription failed:', data);
                alert(data.error || 'Subscription checkout failed.');
                setLoadingTier(null);
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Something went wrong during checkout.');
            setLoadingTier(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Choose the Right Plan for Your Business</h1>
                <p className="text-xl text-gray-500">Upgrade your tier to unlock bulk uploads, reduce marketplace commissions, and fast-track your POL sales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {TIERS.map((tier) => (
                    <div 
                        key={tier.id}
                        className={`relative bg-white rounded-2xl shadow-xl border ${tier.badge === 'Most Popular' ? 'border-[#1a2e22] ring-2 ring-green-50 scale-105 z-10' : 'border-gray-200 mt-0 md:mt-4'} overflow-hidden transition-all duration-300 hover:shadow-2xl flex flex-col`}
                        style={{ minHeight: '480px' }}
                    >
                        {tier.badge && (
                            <div className="absolute top-0 left-0 right-0 bg-[#FCD34D] text-[#1a2e22] text-[10px] font-bold uppercase tracking-wider text-center py-1.5">
                                {tier.badge}
                            </div>
                        )}
                        
                        <div className={`p-6 ${tier.badge ? 'pt-8' : ''} border-b border-gray-100 flex-none`}>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                                <div className={`p-2.5 rounded-2xl bg-gray-50`}>{React.cloneElement(tier.icon as React.ReactElement, { className: 'w-6 h-6' })}</div>
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
                                        <div className="flex-shrink-0 mt-1">
                                            <Check className="h-5 w-5 text-green-500" />
                                        </div>
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
                                disabled={loadingTier !== null}
                                className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed ${tier.buttonColor}`}
                            >
                                {loadingTier === tier.id ? 'Processing...' : 'Subscribe'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Secure payment footer */}
            <div className="mt-16 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
                <Shield className="w-5 h-5 text-gray-400" />
                Payments are securely processed by Stripe. You can cancel or change your plan at any time.
            </div>
        </div>
    );
}
