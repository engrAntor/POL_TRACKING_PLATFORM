"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react";

function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"pending" | "loading" | "success" | "error">(
        token ? "pending" : "error"
    );
    const [message, setMessage] = useState(
        token ? "" : "Invalid verification link. No token provided."
    );

    const handleConfirm = async () => {
        setStatus("loading");
        try {
            const res = await fetch(
                getApiUrl(`/auth/verify-email/?token=${token}`)
            );
            const data = await res.json();

            if (res.ok) {
                setStatus("success");
                setMessage(data.message || "Email verified successfully!");
            } else {
                setStatus("error");
                setMessage(data.error || "Verification failed. Please try again.");
            }
        } catch {
            setStatus("error");
            setMessage("Unable to connect to server. Please try again later.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-lg text-center">
                {/* Pending State - Waiting for user to click Confirm */}
                {status === "pending" && (
                    <div className="space-y-4">
                        <Mail className="mx-auto h-14 w-14 text-[#0E3B1F]" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Confirm Your Email
                        </h2>
                        <p className="text-gray-600">
                            Click the button below to verify your email address and activate your account.
                        </p>
                        <button
                            onClick={handleConfirm}
                            className="mt-6 w-full rounded-lg bg-[#0E3B1F] py-3 text-base font-semibold text-white shadow-sm hover:bg-[#0d1f14] transition-colors duration-200"
                        >
                            Confirm Email
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {status === "loading" && (
                    <div className="space-y-4">
                        <Loader2 className="mx-auto h-16 w-16 animate-spin text-[#0E3B1F]" />
                        <h2 className="text-xl font-semibold text-gray-900">
                            Verifying your email...
                        </h2>
                        <p className="text-gray-500">Please wait a moment.</p>
                    </div>
                )}

                {/* Success State */}
                {status === "success" && (
                    <div className="space-y-4">
                        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Email Verified!
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <Link
                            href="/login"
                            className="mt-6 inline-block w-full rounded-lg bg-[#0E3B1F] py-3 text-base font-semibold text-white shadow-sm hover:bg-[#0d1f14] transition-colors duration-200"
                        >
                            Continue to Login
                        </Link>
                    </div>
                )}

                {/* Error State */}
                {status === "error" && (
                    <div className="space-y-4">
                        <XCircle className="mx-auto h-16 w-16 text-red-500" />
                        <h2 className="text-2xl font-bold text-gray-900">
                            Verification Failed
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <div className="mt-6 space-y-3">
                            <Link
                                href="/register"
                                className="inline-block w-full rounded-lg bg-[#0E3B1F] py-3 text-base font-semibold text-white shadow-sm hover:bg-[#0d1f14] transition-colors duration-200"
                            >
                                Register Again
                            </Link>
                            <Link
                                href="/login"
                                className="inline-block w-full rounded-lg border border-gray-300 bg-white py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors duration-200"
                            >
                                Go to Login
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-gray-50">
                    <Loader2 className="h-12 w-12 animate-spin text-[#0E3B1F]" />
                </div>
            }
        >
            <VerifyEmailContent />
        </Suspense>
    );
}
