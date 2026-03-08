"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, X } from "lucide-react";

const API_BASE = 'http://127.0.0.1:8000/api/superadmin';

interface SANotification {
    id: number;
    type: string;
    title: string;
    description: string;
    is_read: boolean;
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

function DescriptionModal({ item, onClose }: { item: SANotification; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[400px] mx-4 px-7 py-7" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900">
                    <X className="w-4 h-4 text-white" />
                </button>
                <h2 className="text-base font-bold text-gray-900 mb-2">{item.title}</h2>
                <p className="text-xs text-gray-400 mb-4">{new Date(item.created_at).toLocaleString()}</p>
                <div className="border border-gray-200 rounded-xl px-4 py-4 min-h-[140px]">
                    <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
            </div>
        </div>
    );
}

export default function UserIssuesPage() {
    const [items, setItems] = useState<SANotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [viewItem, setViewItem] = useState<SANotification | null>(null);

    const getToken = () => localStorage.getItem('access_token');

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/notifications/`, { headers: { Authorization: `Bearer ${getToken()}` } });
            if (res.ok) {
                const data = await res.json();
                setItems(Array.isArray(data) ? data : data.results || []);
            }
        } catch { console.error('Failed to fetch notifications'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchNotifications(); }, [fetchNotifications]);

    const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
    const paged = items.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleMarkRead = async (id: number) => {
        await fetch(`${API_BASE}/notifications/${id}/read/`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
        });
        fetchNotifications();
    };

    const typeLabel = (t: string) => {
        const labels: Record<string, string> = { new_order: 'New Order', new_user: 'New User', new_issue: 'New Issue' };
        return labels[t] || t;
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[700px]">
                    <thead>
                        <tr className="border-b border-gray-100">
                            <th className="text-left px-6 py-5 text-gray-500 font-medium">SL no.</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Type</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Title</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Date</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Status</th>
                            <th className="text-left px-4 py-5 text-gray-500 font-medium">Read</th>
                            <th className="text-right px-6 py-5 text-gray-500 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paged.length === 0 ? (
                            <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No notifications found</td></tr>
                        ) : paged.map((item, i) => (
                            <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-gray-700">#{(page - 1) * PAGE_SIZE + i + 1}</td>
                                <td className="px-4 py-4 text-gray-800 font-medium whitespace-nowrap">{typeLabel(item.type)}</td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap max-w-[200px] truncate">{item.title}</td>
                                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{new Date(item.created_at).toLocaleDateString()}</td>
                                <td className="px-4 py-4">
                                    <span className={item.is_read ? "text-gray-400 font-medium" : "text-[#0E3B1F] font-medium"}>
                                        {item.is_read ? "Read" : "Unread"}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <Toggle on={item.is_read} onToggle={() => handleMarkRead(item.id)} />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button onClick={() => setViewItem(item)} className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-700 bg-sky-50 hover:bg-sky-100 border border-sky-100">View</button>
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

            {viewItem && <DescriptionModal item={viewItem} onClose={() => setViewItem(null)} />}
        </div>
    );
}
