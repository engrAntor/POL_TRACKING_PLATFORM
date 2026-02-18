import React from 'react';
import Link from 'next/link';

export default function SuperAdminPasswordSuccessPage() {
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
                <div className="mb-6 text-center">
                    <h2 className="text-[2rem] font-semibold text-gray-900 tracking-tight leading-tight">
                        Password Updated<br />Successfully!
                    </h2>
                    <p className="mt-4 text-[16px] text-gray-600 leading-relaxed">
                        Your new password has been saved. You can now continue securely.
                    </p>
                </div>

                <div className="mt-10">
                    <Link
                        href="/superadmindash"
                        className="block w-full rounded-lg bg-primary py-3 text-center text-[17px] font-semibold text-white shadow-sm hover:bg-primary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
                    >
                        Continue to Super Admin Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
