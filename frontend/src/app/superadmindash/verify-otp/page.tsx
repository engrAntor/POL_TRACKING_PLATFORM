"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { CONFIG } from '@/lib/config';

const API_BASE = CONFIG.API_URL + '/auth';

function VerifyOtpContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/verify-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otp, purpose: 'reset' }),
            });
            const data = await res.json();

            if (res.ok) {
                router.push(`/superadmindash/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(otp)}`);
            } else {
                setError(data.error || 'Invalid OTP. Please try again.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError('');
        try {
            const res = await fetch(`${API_BASE}/send-otp/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose: 'reset' }),
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to resend OTP.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-start bg-white px-4 py-8 sm:px-6 sm:pt-12">
            {/* Logo */}
            <div className="mb-8 sm:mb-10">
                <img
                    src="/assets/logo/logo.png"
                    alt="AVN Logo"
                    className="w-auto max-w-[160px] sm:max-w-[220px] mx-auto"
                />
            </div>

            <div className="w-full max-w-[500px]">
                <div className="mb-8 sm:mb-10 text-center">
                    <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">Enter verification code</h2>
                    <p className="mt-2 text-[16px] text-gray-800">Please enter the OTP sent to your email</p>
                </div>

                {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                    <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                        <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                            <span className="text-base font-normal text-gray-400">OTP</span>
                        </div>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            required
                            className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                            placeholder="Enter your OTP"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200 disabled:opacity-60"
                        >
                            {loading ? "Verifying..." : "Submit"}
                        </button>
                    </div>
                </form>

                <p className="mt-6 text-center text-base text-gray-600">
                    Didn&apos;t receive the code?{" "}
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={resending}
                        className="font-semibold text-primary hover:text-primary-hover disabled:opacity-60"
                    >
                        {resending ? "Sending..." : "Resend OTP"}
                    </button>
                </p>
            </div>
        </div>
    );
}

export default function SuperAdminVerifyOtpPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}>
            <VerifyOtpContent />
        </Suspense>
    );
}
