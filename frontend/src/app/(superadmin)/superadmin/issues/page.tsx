"use client";

import { useState } from "react";
import { Trash2, X } from "lucide-react";

const allIssues = [
    { id: "#1233", name: "Kathryn Murp",  email1: "bockely@att.com",    email2: "bockely@att.com",    status: "Pending",  active: true  },
    { id: "#1233", name: "Devon Lane",    email1: "csilvers@rizon.com",  email2: "csilvers@rizon.com", status: "Resolved", active: false },
    { id: "#1233", name: "Foysal Rahman", email1: "qamaho@mail.com",     email2: "qamaho@mail.com",    status: "Pending",  active: true  },
    { id: "#1233", name: "Hari Danang",   email1: "xterris@gmail.com",   email2: "xterris@gmail.com",  status: "Pending",  active: true  },
    { id: "#1233", name: "Floyd Miles",   email1: "xterris@gmail.com",   email2: "xterris@gmail.com",  status: "Pending",  active: true  },
    { id: "#1233", name: "Eleanor Pena",  email1: "xterris@gmail.com",   email2: "xterris@gmail.com",  status: "Pending",  active: true  },
    { id: "#1233", name: "Devon Lane",    email1: "xterris@gmail.com",   email2: "xterris@gmail.com",  status: "Pending",  active: true  },
    { id: "#1233", name: "Hari Danang",   email1: "xterris@gmail.com",   email2: "xterris@gmail.com",  status: "Pending",  active: true  },
    { id: "#1233", name: "Devon Lane",    email1: "xterris@gmail.com",   email2: "xterris@gmail.com",  status: "Pending",  active: true  },
];

const PAGE_SIZE = 10;

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
        <button
            onClick={onToggle}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${on ? "bg-gray-900" : "bg-gray-300"}`}
        >
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-6" : "translate-x-1"}`} />
        </button>
    );
}

// ── Description Modal ─────────────────────────────────────────────────────────
function DescriptionModal({ onClose }: { onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[400px] mx-4 px-7 py-7"
                onClick={(e) => e.stopPropagation()}>

                {/* Close */}
                <button onClick={onClose}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900 transition-colors">
                    <X className="w-4 h-4 text-white" />
                </button>

                {/* Title */}
                <h2 className="text-base font-bold text-gray-900 mb-5">Description</h2>

                {/* Description box */}
                <div className="border border-gray-200 rounded-xl px-4 py-4 min-h-[140px]">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat
                    </p>
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function UserIssuesPage() {
    const [page, setPage]           = useState(1);
    const [toggles, setToggles]     = useState<boolean[]>(allIssues.map((o) => o.active));
    const [showDesc, setShowDesc]   = useState(false);

    const totalPages = Math.ceil(allIssues.length / PAGE_SIZE);
    const issues     = allIssues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function flip(globalIndex: number) {
        setToggles((prev) => prev.map((v, i) => (i === globalIndex ? !v : v)));
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
                <thead>
                    <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-5 text-gray-500 font-medium">SL no.</th>
                        <th className="text-left px-4 py-5 text-gray-500 font-medium">Full Name</th>
                        <th className="text-left px-4 py-5 text-gray-500 font-medium">Email</th>
                        <th className="text-left px-4 py-5 text-gray-500 font-medium">Email</th>
                        <th className="text-left px-4 py-5 text-gray-500 font-medium">Status</th>
                        <th className="text-left px-4 py-5 text-gray-500 font-medium">Switch</th>
                        <th className="text-right px-6 py-5 text-gray-500 font-medium">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {issues.map((issue, i) => {
                        const globalIndex = (page - 1) * PAGE_SIZE + i;
                        return (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-gray-700">{issue.id}</td>
                                <td className="px-4 py-4 text-gray-800 font-medium whitespace-nowrap">{issue.name}</td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{issue.email1}</td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{issue.email2}</td>
                                <td className="px-4 py-4">
                                    <span className={issue.status === "Pending" ? "text-orange-500 font-medium" : "text-gray-400 font-medium"}>
                                        {issue.status}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <Toggle on={toggles[globalIndex]} onToggle={() => flip(globalIndex)} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => setShowDesc(true)}
                                            className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-sky-50 hover:bg-sky-100 transition-colors border border-sky-100">
                                            View
                                        </button>
                                        <button className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors" title="Delete">
                                            <Trash2 className="w-3.5 h-3.5 text-white" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 py-6">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
                    style={{ background: "#0E3B1F" }}
                >
                    &lt; Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                        key={n}
                        onClick={() => setPage(n)}
                        className="w-9 h-9 rounded-lg text-sm font-semibold text-white"
                        style={{ background: "#0E3B1F", opacity: n === page ? 1 : 0.55 }}
                    >
                        {n}
                    </button>
                ))}
                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
                    style={{ background: "#0E3B1F" }}
                >
                    Next &gt;
                </button>
            </div>

            {/* Description Modal */}
            {showDesc && <DescriptionModal onClose={() => setShowDesc(false)} />}
        </div>
    );
}
