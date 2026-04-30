"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CONFIG } from '@/lib/config';

const API_BASE = CONFIG.API_URL + '/auth';

export default function SuperAdminLoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedEmail = localStorage.getItem("superadmin_remembered_email");
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/superadmin-login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("access_token", data.tokens.access);
                localStorage.setItem("refresh_token", data.tokens.refresh);
                localStorage.setItem("user", JSON.stringify(data.user));
                if (rememberMe) {
                    localStorage.setItem("superadmin_remembered_email", email);
                } else {
                    localStorage.removeItem("superadmin_remembered_email");
                }
                window.location.href = "/superadmin/overview";
            } else {
                const msg = data.error || data.non_field_errors?.[0] || data.detail || "Login failed.";
                setError(msg);
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* Left Side */}
            <div className="relative hidden w-[55%] flex-col justify-center px-20 lg:flex xl:w-[50%] bg-[#122b1c] text-white z-0">
                <div className="absolute inset-0 bg-black/40 z-10"></div>
                <img
                    src="/assets/images/profile.png"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                <div className="relative z-20 space-y-4 max-w-xl text-white">
                    <h1 className="text-[3.5rem] font-bold leading-[1.1] tracking-tight">
                        POL Tracking
                    </h1>
                    <h1 className="text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-6">
                        Platform
                    </h1>
                    <p className="text-[1.15rem] leading-relaxed opacity-90 pr-10">
                        Inventory management and intelligent tracking to optimize POL operations and reduce waste
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex w-full flex-col items-center justify-start px-4 sm:px-6 pt-0 pb-16 sm:pb-32 lg:w-[45%] xl:w-[50%] bg-white overflow-y-auto">
                <div className="w-full max-w-[600px] space-y-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <div className="flex flex-col items-center">
                            <img
                                src="/assets/logo/logo.png"
                                alt="AVN Logo"
                                className="w-auto max-w-[180px] sm:max-w-[240px] lg:max-w-[300px]"
                            />
                        </div>
                    </div>

                    {/* Header */}
                    <div className="-mt-14 mb-14 text-center">
                        <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">
                            Super Admin Login
                        </h2>
                        <p className="mt-4 text-[16px] text-gray-800">
                            Restricted access — authorized personnel only
                        </p>
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

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

                        {/* Password Input */}
                        <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                            <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                                <span className="text-base font-normal text-gray-400">Password</span>
                            </div>
                            <div className="relative flex flex-1 items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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

                        {/* Remember & Forgot Password */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-base font-medium text-gray-700">
                                    Remember Password
                                </label>
                            </div>
                            <a href="/superadmindash/forgot-password" className="text-base font-medium text-primary hover:text-primary-light">
                                Forgot Password ?
                            </a>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-5 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200 disabled:opacity-60"
                            >
                                {loading ? "Logging in..." : "Login to Super Admin"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
