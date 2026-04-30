"use client";

import React, { useState, Suspense } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CONFIG } from '@/lib/config';

const API_BASE = CONFIG.API_URL + '/auth';

function ResetPasswordContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const code = searchParams.get('code') || '';

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/reset-password/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    code,
                    new_password: newPassword,
                    confirm_new_password: confirmPassword,
                }),
            });
            const data = await res.json();

            if (res.ok) {
                router.push('/password-success');
            } else {
                setError(data.error || data.new_password?.[0] || 'Failed to reset password.');
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
                    <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">Enter new password</h2>
                </div>

                {error && <p className="text-sm text-red-500 text-center mb-4">{error}</p>}

                <form className="w-full space-y-5" onSubmit={handleSubmit}>
                    {/* Password Input */}
                    <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                        <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                            <span className="text-base font-normal text-gray-400">Password</span>
                        </div>
                        <div className="relative flex flex-1 items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                minLength={8}
                                className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="mr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-5 w-5" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                        <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                            <span className="text-base font-normal text-gray-400">Confirm</span>
                        </div>
                        <div className="relative flex flex-1 items-center">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                                className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                                placeholder="Enter your password again"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="mr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                                ) : (
                                    <Eye className="h-5 w-5" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-6 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200 disabled:opacity-60"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
