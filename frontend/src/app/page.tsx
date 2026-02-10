import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center bg-gray-50">
            <h1 className="text-3xl md:text-5xl font-bold mb-8 text-[#0E3B1F]">POL Tracking Platform</h1>
            <p className="text-gray-600 mb-8 max-w-md">
                Inventory management and intelligent tracking to optimize POL operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/login" className="px-8 py-3 bg-[#0E3B1F] text-white rounded-lg hover:bg-[#0A2916] transition-colors font-medium text-lg w-full sm:w-auto">
                    Login
                </Link>
                <Link href="/signup" className="px-8 py-3 border-2 border-[#0E3B1F] text-[#0E3B1F] rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg w-full sm:w-auto">
                    Sign Up
                </Link>
            </div>
        </main>
    );
}
