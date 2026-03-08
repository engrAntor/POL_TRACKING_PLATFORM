import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
            <Link
                href="/"
                className="px-6 py-2.5 rounded-lg bg-[#0E3B1F] text-white font-medium hover:opacity-90"
            >
                Go Home
            </Link>
        </div>
    );
}
