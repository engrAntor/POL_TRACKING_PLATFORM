"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col items-center">
            {/* Header Text */}
            <div className="-mt-12 mb-12 text-center">
                <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">Sign up to continue</h2>
                <p className="mt-4 text-[16px] text-gray-800">Please share your details to take the next step forward</p>
            </div>

            <form className="w-full space-y-5">
                {/* Full Name */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Full Name</span>
                    </div>
                    <input
                        type="text"
                        name="fullname"
                        id="fullname"
                        className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                        placeholder="Enter your full name"
                    />
                </div>

                {/* Company */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Company</span>
                    </div>
                    <input
                        type="text"
                        name="company"
                        id="company"
                        className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                        placeholder="Enter your company name"
                    />
                </div>

                {/* Mobile */}
                <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                    <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                        <span className="text-base font-normal text-gray-400">Mobile</span>
                    </div>
                    <input
                        type="tel"
                        name="mobile"
                        id="mobile"
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
                        name="email"
                        id="email"
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
                            name="password"
                            id="password"
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
                            name="confirmPassword"
                            id="confirmPassword"
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
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label
                        htmlFor="terms"
                        className="ml-2 block text-sm text-gray-900"
                    >
                        I agree to all the <Link href="/terms" className="text-primary underline">Terms</Link> and <Link href="/privacy" className="text-primary underline">Privacy Policies</Link>
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        className="mt-4 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
                    >
                        Sign Up
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
                <Link
                    href="/login"
                    className="font-semibold text-red-500 hover:text-red-400"
                >
                    Login
                </Link>
            </p>
        </div>
    );
}
