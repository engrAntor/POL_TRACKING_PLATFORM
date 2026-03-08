"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, X, MapPin } from "lucide-react";

const API_BASE = 'http://127.0.0.1:8000/api/superadmin';

interface Order {
    id: number;
    user_name: string;
    product_name: string;
    category: string;
    brand: string;
    phone: string;
    location: string;
    quantity: string;
    quantity_unit: string;
    price_per_unit: string;
    batch_number: string;
    expiry: string | null;
    shelf_life: string;
    status: string;
    is_active: boolean;
    created_at: string;
}

const PAGE_SIZE = 10;

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
    return (
        <button onClick={onToggle} className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${on ? "bg-gray-900" : "bg-gray-300"}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${on ? "translate-x-6" : "translate-x-1"}`} />
        </button>
    );
}

function ViewModal({ order, onClose }: { order: Order; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[380px] mx-4 px-7 py-7" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900"><X className="w-4 h-4 text-white" /></button>
                <h2 className="text-center text-base font-bold text-gray-900 mb-6">View Order Summary</h2>
                <div className="mb-4">
                    <p className="text-lg font-bold text-gray-900">{order.product_name}</p>
                    <p className="text-sm text-gray-400 mt-0.5">( {order.category} )</p>
                    <div className="flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5 text-red-500" /><span className="text-sm text-gray-500">{order.location}</span></div>
                </div>
                <hr className="border-gray-100 mb-4" />
                <div className="flex items-center justify-between py-2"><span className="text-sm font-medium text-gray-700">Brand</span><span className="text-sm font-semibold text-[#0E3B1F]">{order.brand || '-'}</span></div>
                <div className="flex items-center justify-between py-2"><span className="text-sm font-medium text-gray-700">Quantity</span><span className="text-sm text-gray-700">{order.quantity} {order.quantity_unit}</span></div>
                <hr className="border-gray-100 my-3" />
                {order.batch_number && <div className="flex items-center justify-between py-1.5"><span className="text-sm text-gray-500">Batch :</span><span className="text-sm text-gray-700">{order.batch_number}</span></div>}
                {order.expiry && <div className="flex items-center justify-between py-1.5"><span className="text-sm text-gray-500">Expiry :</span><span className="text-sm text-gray-700">{order.expiry}</span></div>}
                {order.shelf_life && <div className="flex items-center justify-between py-1.5"><span className="text-sm text-gray-500">Shelf Life :</span><span className="text-sm text-gray-700">{order.shelf_life}</span></div>}
                <hr className="border-gray-100 mt-3 mb-4" />
                <div className="flex items-center justify-between"><span className="text-sm font-bold text-gray-800">Price</span><span className="text-sm font-bold text-green-600">${order.price_per_unit}/{order.quantity_unit}</span></div>
            </div>
        </div>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [viewOrder, setViewOrder] = useState<Order | null>(null);

    const getToken = () => localStorage.getItem('access_token');

    const fetchOrders = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/orders/`, { headers: { Authorization: `Bearer ${getToken()}` } });
            if (res.ok) {
                const data = await res.json();
                setOrders(Array.isArray(data) ? data : data.results || []);
            }
        } catch { console.error('Failed to fetch orders'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
    const paged = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        await fetch(`${API_BASE}/orders/${orderId}/status/`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus }),
        });
        fetchOrders();
    };

    const handleToggle = async (orderId: number, isActive: boolean) => {
        await fetch(`${API_BASE}/orders/${orderId}/toggle/`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: isActive }),
        });
        fetchOrders();
    };

    const handleDelete = async (orderId: number) => {
        if (!confirm('Delete this order?')) return;
        await fetch(`${API_BASE}/orders/${orderId}/delete/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        fetchOrders();
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading orders...</div>;

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
                            {paged.length === 0 ? (
                                <tr><td colSpan={9} className="px-6 py-8 text-center text-gray-400">No orders found</td></tr>
                            ) : paged.map((order, i) => (
                                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-gray-700">#{order.id}</td>
                                    <td className="px-4 py-4 text-gray-800 font-medium whitespace-nowrap">{order.user_name}</td>
                                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{order.product_name}</td>
                                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{order.phone}</td>
                                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{order.location}</td>
                                    <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{order.quantity} {order.quantity_unit}</td>
                                    <td className="px-4 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            className={`text-sm font-medium rounded-lg px-3 py-1.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0E3B1F]/20 ${
                                                order.status === "approved" ? "text-[#0E3B1F] bg-green-50 border-green-200"
                                                : order.status === "cancelled" ? "text-red-500 bg-red-50 border-red-200"
                                                : "text-yellow-600 bg-yellow-50 border-yellow-200"
                                            }`}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="px-4 py-4">
                                        <Toggle on={order.is_active} onToggle={() => handleToggle(order.id, !order.is_active)} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setViewOrder(order)} className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-sky-50 hover:bg-sky-100 border border-sky-100">View</button>
                                            <button onClick={() => handleDelete(order.id)} className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center hover:bg-red-700" title="Delete">
                                                <Trash2 className="w-3.5 h-3.5 text-white" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-6">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40" style={{ background: "#0E3B1F" }}>&lt; Prev</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button key={n} onClick={() => setPage(n)} className="w-9 h-9 rounded-lg text-sm font-semibold text-white" style={{ background: "#0E3B1F", opacity: n === page ? 1 : 0.55 }}>{n}</button>
                        ))}
                        <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-40" style={{ background: "#0E3B1F" }}>Next &gt;</button>
                    </div>
                )}
            </div>
            {viewOrder && <ViewModal order={viewOrder} onClose={() => setViewOrder(null)} />}
        </>
    );
}
