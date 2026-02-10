"use client";

import React from 'react';

export default function VerifyOtpPage() {
    return (
        <div className="flex h-screen flex-col items-center justify-start bg-white p-6 pt-12 overflow-hidden">
            {/* Logo */}
            <div className="mb-10">
                <img
                    src="/assets/logo/logo.png"
                    alt="AVN Logo"
                    width={300}
                    height={300}
                />
            </div>

            {/* Content w/ max width for centering */}
            <div className="w-full max-w-[500px]">
                {/* Header Text */}
                <div className="-mt-10 mb-10 text-center">
                    <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight">Enter verification code</h2>
                    <p className="mt-2 text-[16px] text-gray-800">Please enter the OTP sent to your email</p>
                </div>

                <form className="w-full space-y-5">
                    {/* OTP Input */}
                    <div className="group relative flex items-center rounded-lg border border-gray-300 bg-white px-0 py-2.5 transition-all focus-within:border-primary hover:border-gray-400">
                        <div className="flex min-w-[110px] justify-center border-r border-gray-200 py-0">
                            <span className="text-base font-normal text-gray-400">OTP</span>
                        </div>
                        <input
                            type="text"
                            name="otp"
                            id="otp"
                            maxLength={6}
                            className="flex-1 border-none bg-transparent px-5 text-base text-gray-900 placeholder-gray-300 outline-none focus:ring-0"
                            placeholder="Enter your OTP"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="mt-6 w-full rounded-lg bg-primary py-3 text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
                        >
                            Submit
                        </button>
                    </div>
                </form>

                {/* Resend OTP */}
                <p className="mt-6 text-center text-base text-gray-600">
                    Didn't receive the code?{" "}
                    <button
                        type="button"
                        className="font-semibold text-primary hover:text-primary-hover"
                    >
                        Resend OTP
                    </button>
                </p>
            </div>
        </div>
    );
}
