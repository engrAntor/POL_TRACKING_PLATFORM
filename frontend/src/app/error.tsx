"use client";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error.message || "An unexpected error occurred."}</p>
            <button
                onClick={reset}
                className="px-6 py-2.5 rounded-lg bg-[#0E3B1F] text-white font-medium hover:opacity-90"
            >
                Try Again
            </button>
        </div>
    );
}
