import React from 'react';
import Link from 'next/link';

export default function PasswordSuccessPage() {
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
                <div className="-mt-10 mb-6 text-center">
                    <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight leading-tight">
                        Password Updated<br />Successfully!
                    </h2>
                    <p className="mt-4 text-[16px] text-gray-600 leading-relaxed">
                        Your new password has been saved. You can now<br />continue securely.
                    </p>
                </div>

                {/* Login Button */}
                <div className="mt-10">
                    <Link
                        href="/login"
                        className="block w-full rounded-lg bg-primary py-3 text-center text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
                    >
                        Continue to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
