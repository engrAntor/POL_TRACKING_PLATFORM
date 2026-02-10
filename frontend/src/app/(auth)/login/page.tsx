"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col items-center">
            {/* Header Text */}


            <div className="-mt-14 mb-14 text-center">
                <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">Log in to continue</h2>
                <p className="mt-4 text-[16px] text-gray-800">Please share your email &nbsp;to take the next step forward</p>
            </div>

            <form className="w-full space-y-5">
                {/* Email Input */}
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

                {/* Password Input */}
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

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            defaultChecked
                            className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 text-base font-medium text-gray-700"
                        >
                            Remember Password
                        </label>
                    </div>

                    <Link
                        href="/forgot-password"
                        className="text-base font-medium text-primary hover:text-primary-light"
                    >
                        Forgot Password ?
                    </Link>
                </div>

                <div>
                    <button
                        type="submit"
                        className="mt-5 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
                    >
                        Login
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
            <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white py-3 text-base font-medium text-primary shadow-sm hover:bg-gray-50 focus:outline-none transition-colors"
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5" />
                Continue with Google
            </button>

            {/* Footer */}
            <p className="mt-5 text-center text-base text-gray-800">
                Don't have an account ?{" "}
                <Link
                    href="/register"
                    className="font-semibold text-red-500 hover:text-red-400"
                >
                    Sign up
                </Link>
            </p>
        </div >
    );
}
