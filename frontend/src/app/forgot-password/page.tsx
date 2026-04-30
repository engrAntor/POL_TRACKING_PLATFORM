"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getApiUrl } from "@/lib/config";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(getApiUrl(`/auth/send-otp/`), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, purpose: 'reset' }),
            });
            const data = await res.json();

            if (res.ok) {
                router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
            } else {
                setError(data.error || data.email?.[0] || 'Failed to send OTP.');
            }
        } catch {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
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

            {/* Content w/ max width for centering */}
            <div className="w-full max-w-[500px]">
                {/* Header Text */}
                <div className="mb-8 sm:mb-10 text-center">
                    <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">Reset your password</h2>
                    <p className="mt-2 text-[16px] text-gray-800">OTP will be send to your email</p>
                </div>

                {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                        <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                            <span className="text-base font-normal text-gray-400">Email</span>
                        </div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                            placeholder="Enter your email address"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200 disabled:opacity-60"
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
