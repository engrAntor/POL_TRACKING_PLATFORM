"use client";

import { useState, useEffect, useCallback } from "react";
import { Ban, X, Trash2 } from "lucide-react";

const API_BASE = 'http://127.0.0.1:8000/api/superadmin';

interface User {
    id: number;
    full_name: string;
    email: string;
    phone: string;
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

function ActionModal({ user, onClose, onToggle, onDelete }: { user: User; onClose: () => void; onToggle: (active: boolean) => void; onDelete: () => void }) {
    const [disabled, setDisabled] = useState(!user.is_active);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[360px] mx-4 px-7 py-7" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900">
                    <X className="w-4 h-4 text-white" />
                </button>
                <h2 className="text-center text-base font-bold text-gray-900 mb-5">Action - {user.full_name}</h2>
                <div className="flex items-center justify-between border border-dashed border-blue-300 rounded-xl px-4 py-3 mb-3">
                    <span className="text-sm font-medium text-gray-700">Disable User Access</span>
                    <Toggle on={disabled} onToggle={() => { setDisabled(v => !v); onToggle(!disabled ? false : true); }} />
                </div>
                <div className="flex items-center justify-between border border-dashed border-blue-300 rounded-xl px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">Delete User Account</span>
                    <button onClick={onDelete} className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ background: "#0E3B1F" }}>
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [actionUser, setActionUser] = useState<User | null>(null);

    const getToken = () => localStorage.getItem('access_token');

    const fetchUsers = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/users/`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setUsers(Array.isArray(data) ? data : data.results || []);
            }
        } catch { console.error('Failed to fetch users'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
    const paged = users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleToggle = async (userId: number, isActive: boolean) => {
        await fetch(`${API_BASE}/users/${userId}/toggle/`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_active: isActive }),
        });
        fetchUsers();
    };

    const handleDelete = async (userId: number) => {
        await fetch(`${API_BASE}/users/${userId}/delete/`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        setActionUser(null);
        fetchUsers();
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

    return (
        <>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[560px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-8 py-5 text-gray-500 font-medium">SL no.</th>
                                <th className="text-left px-6 py-5 text-gray-500 font-medium">Full Name</th>
                                <th className="text-left px-6 py-5 text-gray-500 font-medium">Email</th>
                                <th className="text-left px-6 py-5 text-gray-500 font-medium">Phone Number</th>
                                <th className="text-right px-8 py-5 text-gray-500 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>
                            ) : paged.map((user, i) => (
                                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-8 py-4 text-gray-700">#{(page - 1) * PAGE_SIZE + i + 1}</td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{user.full_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.phone || '-'}</td>
                                    <td className="px-8 py-4 text-right">
                                        <button onClick={() => setActionUser(user)} className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center ml-auto hover:bg-red-700" title="Action">
                                            <Ban className="w-4 h-4 text-white" />
                                        </button>
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
            {actionUser && (
                <ActionModal
                    user={actionUser}
                    onClose={() => setActionUser(null)}
                    onToggle={(active) => handleToggle(actionUser.id, active)}
                    onDelete={() => handleDelete(actionUser.id)}
                />
            )}
        </>
    );
}
