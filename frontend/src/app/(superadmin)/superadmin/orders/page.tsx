"use client";

import { useState } from "react";
import { Trash2, X, MapPin } from "lucide-react";

const allOrders = [
    { id: "#1233", name: "Kathryn Murp",  order: "Premium Diesel B7", phone: "(201) 555-0124", location: "Dhaka, Bangladesh", qty: "1000 liter", status: "Approved",  active: true  },
    { id: "#1233", name: "Devon Lane",    order: "Premium Diesel B7", phone: "(219) 555-0114", location: "Karachi, Pakistan", qty: "1000 liter", status: "Cancelled", active: false },
    { id: "#1233", name: "Foysal Rahman", order: "Premium Diesel B7", phone: "(316) 555-0116", location: "Karachi, Pakistan", qty: "1000 liter", status: "Approved",  active: true  },
    { id: "#1233", name: "Hari Danang",   order: "Premium Diesel B7", phone: "(907) 555-0101", location: "Delhi, India",      qty: "1000 liter", status: "Approved",  active: true  },
    { id: "#1233", name: "Floyd Miles",   order: "Premium Diesel B7", phone: "(505) 555-0125", location: "Lahore",            qty: "1000 liter", status: "Approved",  active: true  },
    { id: "#1233", name: "Eleanor Pena",  order: "Premium Diesel B7", phone: "(704) 555-0127", location: "Pune, India",       qty: "1000 liter", status: "Approved",  active: true  },
    { id: "#1233", name: "Devon Lane",    order: "Premium Diesel B7", phone: "(219) 555-0114", location: "Los Angeles",       qty: "1000 liter", status: "Approved",  active: true  },
    { id: "#1233", name: "Hari Danang",   order: "Premium Diesel B7", phone: "(270) 555-0117", location: "India",             qty: "1000 liter", status: "Approved",  active: true  },
    { id: "#1233", name: "Devon Lane",    order: "Premium Diesel B7", phone: "(207) 555-0119", location: "Oman",              qty: "1000 liter", status: "Approved",  active: true  },
];

type Order = typeof allOrders[0];
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

// ── View Order Summary Modal ──────────────────────────────────────────────────
function ViewModal({ order, onClose }: { order: Order; onClose: () => void }) {
    const [qty, setQty] = useState(1000);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[380px] mx-4 px-7 py-7"
                onClick={(e) => e.stopPropagation()}>

                {/* Close */}
                <button onClick={onClose}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900 transition-colors">
                    <X className="w-4 h-4 text-white" />
                </button>

                {/* Title */}
                <h2 className="text-center text-base font-bold text-gray-900 mb-6">
                    View Order Summary
                </h2>

                {/* Product info */}
                <div className="mb-4">
                    <p className="text-lg font-bold text-gray-900">{order.order}</p>
                    <p className="text-sm text-gray-400 mt-0.5">( Petroleum )</p>
                    <div className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span className="text-sm text-gray-500">Port Area</span>
                    </div>
                </div>

                <hr className="border-gray-100 mb-4" />

                {/* Brand */}
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-700">Brand</span>
                    <span className="text-sm font-semibold text-orange-500">Shell</span>
                </div>

                {/* Quantity */}
                <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-700">Quantity</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setQty((q) => Math.max(100, q - 100))}
                            className="w-6 h-6 rounded flex items-center justify-center border border-green-500 text-green-600 text-base font-bold hover:bg-green-50 transition-colors leading-none"
                        >
                            −
                        </button>
                        <span className="text-sm text-gray-700 min-w-[70px] text-center">
                            {qty} liter
                        </span>
                        <button
                            onClick={() => setQty((q) => q + 100)}
                            className="w-6 h-6 rounded flex items-center justify-center border border-green-500 text-green-600 text-base font-bold hover:bg-green-50 transition-colors leading-none"
                        >
                            +
                        </button>
                    </div>
                </div>

                <hr className="border-gray-100 my-3" />

                {/* Details */}
                {[
                    { label: "Batch :",      value: "B- 001122"    },
                    { label: "Expiry :",     value: "12 Sept 2027" },
                    { label: "Shelf Life :", value: "5 Years"      },
                ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-1.5">
                        <span className="text-sm text-gray-500">{label}</span>
                        <span className="text-sm text-gray-700">{value}</span>
                    </div>
                ))}

                <hr className="border-gray-100 mt-3 mb-4" />

                {/* Price */}
                <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800">Price</span>
                    <span className="text-sm font-bold text-green-600">$1.45/Liter</span>
                </div>
            </div>
        </div>
    );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function OrdersPage() {
    const [page, setPage]       = useState(1);
    const [toggles, setToggles] = useState<boolean[]>(allOrders.map((o) => o.active));
    const [viewOrder, setViewOrder] = useState<Order | null>(null);

    const totalPages = Math.ceil(allOrders.length / PAGE_SIZE);
    const orders     = allOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function flip(globalIndex: number) {
        setToggles((prev) => prev.map((v, i) => (i === globalIndex ? !v : v)));
    }

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[860px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left px-6 py-5 text-gray-500 font-medium">SL no.</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Full Name</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Order</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Phone Number</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Location</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Quantity</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Status</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Switch</th>
                            <th className="text-right px-6 py-5 text-gray-500 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, i) => {
                            const globalIndex = (page - 1) * PAGE_SIZE + i;
                            return (
                                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-700">{order.id}</td>
                                    <td className="px-4 py-4 text-gray-800 font-medium whitespace-nowrap">{order.name}</td>
                                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{order.order}</td>
                                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{order.phone}</td>
                                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{order.location}</td>
                                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{order.qty}</td>
                                    <td className="px-4 py-4">
                                        <span className={order.status === "Approved" ? "text-orange-500 font-medium" : "text-gray-400 font-medium"}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Toggle on={toggles[globalIndex]} onToggle={() => flip(globalIndex)} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setViewOrder(order)}
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
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
                        style={{ background: "#0E3B1F" }}>
                        &lt; Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button key={n} onClick={() => setPage(n)}
                            className="w-9 h-9 rounded-lg text-sm font-semibold text-white"
                            style={{ background: "#0E3B1F", opacity: n === page ? 1 : 0.55 }}>
                            {n}
                        </button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40"
                        style={{ background: "#0E3B1F" }}>
                        Next &gt;
                    </button>
                </div>
            </div>

            {/* View Order Summary Modal */}
            {viewOrder && <ViewModal order={viewOrder} onClose={() => setViewOrder(null)} />}
        </>
    );
}
