"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

const API_AUTH = 'http://127.0.0.1:8000/api/auth';

function StripeReturnContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your Stripe account integration...');

    useEffect(() => {
        const verifyStripe = async () => {
            // If it's a refresh URL, user backed out or session expired
            if (searchParams.get('refresh')) {
                setStatus('error');
                setMessage('Stripe connection session expired or was interrupted. Please try again.');
                setTimeout(() => router.replace('/overview'), 3000);
                return;
            }

            const token = localStorage.getItem('access_token');
            if (!token) {
                setStatus('error');
                setMessage('You are not authenticated. Redirecting to login...');
                setTimeout(() => router.replace('/login'), 2000);
                return;
            }

            try {
                const res = await fetch(`${API_AUTH}/stripe-verify/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === 'complete') {
                        setStatus('success');
                        setMessage('Your Stripe account has been successfully linked!');
                    } else {
                        setStatus('error');
                        setMessage(data.message || 'Stripe onboarding is incomplete. Please try again.');
                    }
                } else {
                    setStatus('error');
                    setMessage('Failed to verify Stripe connection. Our servers might be busy.');
                }
            } catch (err) {
                setStatus('error');
                setMessage('A network error occurred while verifying your Stripe connection.');
            }

            // Redirect back to overview after showing the result
            setTimeout(() => {
                router.replace('/overview');
            }, 3000);
        };

        verifyStripe();
    }, [router, searchParams]);

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 max-w-md w-full text-center">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-12 w-12 text-[#635BFF] animate-spin mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Connecting to Stripe</h2>
                        <p className="text-gray-500 text-sm">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Connected!</h2>
                        <p className="text-gray-500 text-sm mb-6">{message}</p>
                        <p className="text-xs text-gray-400">Redirecting to dashboard...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <XCircle className="h-12 w-12 text-red-500 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Failed</h2>
                        <p className="text-gray-500 text-sm mb-6">{message}</p>
                        <button 
                            onClick={() => router.replace('/overview')}
                            className="px-6 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
                            style={{ background: '#0E3B1F' }}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function StripeReturnPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[80vh] items-center justify-center">
                <Loader2 className="h-12 w-12 text-[#635BFF] animate-spin" />
            </div>
        }>
            <StripeReturnContent />
        </Suspense>
    );
}
