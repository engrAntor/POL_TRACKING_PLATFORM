"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";

const API_BASE = 'http://127.0.0.1:8000/api/auth';
const GOOGLE_CLIENT_ID = "833764980640-9g96fhodvltlvmj55kd3o21fgg4ifui2.apps.googleusercontent.com";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [googleError, setGoogleError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    // Load remembered credentials on mount
    useEffect(() => {
        const savedEmail = localStorage.getItem("remembered_email");
        const savedPassword = localStorage.getItem("remembered_password");
        if (savedEmail && savedPassword) {
            setEmail(savedEmail);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);

    // Handle Google callback token from URL hash
    useEffect(() => {
        const hash = window.location.hash;
        if (!hash.includes("id_token=")) return;

        const params = new URLSearchParams(hash.substring(1));
        const idToken = params.get("id_token");
        if (!idToken) return;

        window.history.replaceState(null, "", window.location.pathname);

        (async () => {
            try {
                const res = await fetch(`${API_BASE}/google-login/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ credential: idToken }),
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem("access_token", data.tokens.access);
                    localStorage.setItem("refresh_token", data.tokens.refresh);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    window.location.href = "/overview";
                } else {
                    setGoogleError(data.error || "Google login failed.");
                }
            } catch {
                setGoogleError("Network error. Please try again.");
            }
        })();
    }, []);

    const handleGoogleClick = () => {
        const redirectUri = window.location.origin + "/login";
        const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=id_token&scope=openid%20email%20profile&nonce=${Date.now()}`;
        window.location.href = url;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE}/login/`, {
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
                    localStorage.setItem("remembered_email", email);
                    localStorage.setItem("remembered_password", password);
                } else {
                    localStorage.removeItem("remembered_email");
                    localStorage.removeItem("remembered_password");
                }
                window.location.href = "/overview";
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
        <div className="flex flex-col items-center">
            <div className="-mt-14 mb-14 text-center">
                <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">Log in to continue</h2>
                <p className="mt-4 text-[16px] text-gray-800">Please share your email &nbsp;to take the next step forward</p>
            </div>

            {error && <p className="text-sm text-red-500 text-center mb-4 w-full">{error}</p>}

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

                    <Link href="/forgot-password" className="text-base font-medium text-primary hover:text-primary-light">
                        Forgot Password ?
                    </Link>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-5 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200 disabled:opacity-60"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>
            </form>

            {/* Divider */}
            <div className="relative my-5 w-full">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-4 text-sm text-gray-900">or</span>
                </div>
            </div>

            {/* Google Button */}
            {googleError && (
                <p className="text-sm text-red-500 text-center mb-2">{googleError}</p>
            )}
            <button
                type="button"
                onClick={handleGoogleClick}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-base font-medium text-primary shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                Continue with Google
            </button>

            {/* Footer */}
            <p className="mt-5 text-center text-base text-gray-800">
                Don&apos;t have an account ?{" "}
                <Link href="/register" className="font-semibold text-red-500 hover:text-red-400">
                    Sign up
                </Link>
            </p>
        </div >
    );
}
