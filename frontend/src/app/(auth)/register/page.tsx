"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL + '/auth';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        company: '',
        job_title: '',
        phone: '',
        email: '',
        password: '',
        confirm_password: '',
    });

    const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirm_password) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/register/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Registration successful! Please check your email to verify your account.");
                router.push("/login");
            } else {
                const msg = data.email?.[0] || data.password?.[0] || data.confirm_password?.[0] || data.non_field_errors?.[0] || data.detail || "Registration failed.";
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
            {/* Header Text */}
            <div className="-mt-12 mb-12 text-center">
                <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">Sign up to continue</h2>
                <p className="mt-4 text-[16px] text-gray-800">Please share your details to take the next step forward</p>
            </div>

            {error && <p className="text-sm text-red-500 text-center mb-4 w-full">{error}</p>}

            <form className="w-full space-y-5" onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">First Name</span>
                    </div>
                    <input
                        type="text"
                        value={form.first_name}
                        onChange={(e) => update('first_name', e.target.value)}
                        required
                        className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                        placeholder="Enter your first name"
                    />
                </div>

                {/* Last Name */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Last Name</span>
                    </div>
                    <input
                        type="text"
                        value={form.last_name}
                        onChange={(e) => update('last_name', e.target.value)}
                        required
                        className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                        placeholder="Enter your last name"
                    />
                </div>

                {/* Company */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Company</span>
                    </div>
                    <input
                        type="text"
                        value={form.company}
                        onChange={(e) => update('company', e.target.value)}
                        className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                        placeholder="Enter your company name"
                    />
                </div>

                {/* Job Title */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Job Title</span>
                    </div>
                    <input
                        type="text"
                        value={form.job_title}
                        onChange={(e) => update('job_title', e.target.value)}
                        className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                        placeholder="Enter your job title"
                    />
                </div>

                {/* Mobile */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Mobile</span>
                    </div>
                    <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => update('phone', e.target.value)}
                        className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                        placeholder="Enter your mobile number"
                    />
                </div>

                {/* Email */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Email</span>
                    </div>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => update('email', e.target.value)}
                        required
                        className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                        placeholder="Enter your email address"
                    />
                </div>

                {/* Password */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Password</span>
                    </div>
                    <div className="relative flex flex-1 items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={form.password}
                            onChange={(e) => update('password', e.target.value)}
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

                {/* Confirm Password */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Confirm</span>
                    </div>
                    <div className="relative flex flex-1 items-center">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={form.confirm_password}
                            onChange={(e) => update('confirm_password', e.target.value)}
                            required
                            minLength={8}
                            className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                            placeholder="Confirm your password"
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

                <div className="flex items-center pt-2">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        required
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                        I agree to all the <Link href="/terms" className="text-primary underline">Terms</Link> and <Link href="/privacy" className="text-primary underline">Privacy Policies</Link>
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200 disabled:opacity-60"
                    >
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </div>
            </form>

            <div className="relative mt-6 w-full">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white px-2 text-sm text-gray-500">or</span>
                </div>
            </div>

            <div className="mt-4 w-full">
                <button
                    type="button"
                    className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-3" />
                    Continue with Google
                </button>
            </div>

            <p className="mt-5 text-center text-base text-gray-800">
                Already have an account ?{" "}
                <Link href="/login" className="font-semibold text-red-500 hover:text-red-400">
                    Login
                </Link>
            </p>
        </div>
    );
}
