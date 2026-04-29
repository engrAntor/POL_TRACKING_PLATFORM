"use client";

import { useState, useEffect, useCallback } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api') + '/superadmin';

interface Admin {
    id: number;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string;
    company: string;
    job_title: string;
    role: string;
    is_active: boolean;
}

const PAGE_SIZE = 10;

export default function AdministratorsPage() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [editTarget, setEditTarget] = useState<Admin | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);

    // Create form
    const [createForm, setCreateForm] = useState({ first_name: '', last_name: '', email: '', password: 'Admin@123', phone: '', company: '', job_title: '' });
    // Edit form
    const [editForm, setEditForm] = useState({ first_name: '', last_name: '', email: '', phone: '', company: '', job_title: '' });

    const getToken = () => localStorage.getItem('access_token');

    const fetchAdmins = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/administrators/`, { headers: { Authorization: `Bearer ${getToken()}` } });
            if (res.ok) {
                const data = await res.json();
                setAdmins(Array.isArray(data) ? data : data.results || []);
            }
        } catch { console.error('Failed to fetch admins'); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAdmins(); }, [fetchAdmins]);

    const totalPages = Math.max(1, Math.ceil(admins.length / PAGE_SIZE));
    const paged = admins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const handleCreate = async () => {
        try {
            const res = await fetch(`${API_BASE}/administrators/create/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(createForm),
            });
            if (res.ok) {
                setShowCreate(false);
                setCreateForm({ first_name: '', last_name: '', email: '', password: 'Admin@123', phone: '', company: '', job_title: '' });
                fetchAdmins();
            }
        } catch { console.error('Failed to create admin'); }
    };

    const openEdit = (admin: Admin) => {
        setEditTarget(admin);
        setEditForm({ first_name: admin.first_name, last_name: admin.last_name, email: admin.email, phone: admin.phone || '', company: admin.company || '', job_title: admin.job_title || '' });
    };

    const handleUpdate = async () => {
        if (!editTarget) return;
        try {
            const res = await fetch(`${API_BASE}/administrators/${editTarget.id}/update/`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm),
            });
            if (res.ok) { setEditTarget(null); fetchAdmins(); }
        } catch { console.error('Failed to update admin'); }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            await fetch(`${API_BASE}/administrators/${deleteTarget.id}/delete/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            setDeleteTarget(null);
            fetchAdmins();
        } catch { console.error('Failed to delete admin'); }
    };

    const roleLabel = (r: string) => r === 'superadmin' ? 'Super Admin' : 'Admin';

    if (loading) return <div className="p-8 text-center text-gray-500">Loading administrators...</div>;

    return (
        <div className="space-y-5">
            <div>
                <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ background: "#0E3B1F" }}>
                    <Plus className="w-4 h-4" /> New Administrators Profile Create
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[620px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-8 py-5 text-gray-500 font-medium">SL no.</th>
                                <th className="text-left px-6 py-5 text-gray-500 font-medium">Full Name</th>
                                <th className="text-left px-6 py-5 text-gray-500 font-medium">Email</th>
                                <th className="text-left px-6 py-5 text-gray-500 font-medium">Contact Number</th>
                                <th className="text-left px-6 py-5 text-gray-500 font-medium">Has Access to</th>
                                <th className="text-right px-8 py-5 text-gray-500 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paged.length === 0 ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No administrators found</td></tr>
                            ) : paged.map((admin, i) => (
                                <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                                    <td className="px-8 py-4 text-gray-700">#{(page - 1) * PAGE_SIZE + i + 1}</td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{admin.full_name}</td>
                                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{admin.phone || '-'}</td>
                                    <td className="px-6 py-4 text-gray-700">{roleLabel(admin.role)}</td>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(admin)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-90" style={{ background: "#0E3B1F" }} title="Edit">
                                                <Pencil className="w-3.5 h-3.5 text-white" />
                                            </button>
                                            <button onClick={() => setDeleteTarget(admin)} className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center hover:bg-red-700" title="Delete">
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

            {/* Create Modal */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowCreate(false)}>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[400px] mx-4 px-8 py-8" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowCreate(false)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900"><X className="w-4 h-4 text-white" /></button>
                        <h2 className="text-center text-lg font-bold text-[#2d1b6b] mb-8">New Administrator Profile Create</h2>
                        <div className="space-y-5">
                            {[
                                { label: "First Name", key: "first_name", type: "text" },
                                { label: "Last Name", key: "last_name", type: "text" },
                                { label: "Email", key: "email", type: "email" },
                                { label: "Password", key: "password", type: "password" },
                                { label: "Phone", key: "phone", type: "tel" },
                                { label: "Company", key: "company", type: "text" },
                                { label: "Job Title", key: "job_title", type: "text" },
                            ].map(({ label, key, type }) => (
                                <div key={key} className="flex items-center gap-4">
                                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">{label}</label>
                                    <input type={type} placeholder={label} value={(createForm as Record<string, string>)[key]}
                                        onChange={(e) => setCreateForm(prev => ({ ...prev, [key]: e.target.value }))}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                                </div>
                            ))}
                            <div className="flex items-center gap-4">
                                <label className="w-20 text-sm font-medium text-gray-700 shrink-0">Role</label>
                                <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100">Super Admin</div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowCreate(false)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleCreate} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ background: "#0E3B1F" }}>Create</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setEditTarget(null)}>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[400px] mx-4 px-8 py-8" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setEditTarget(null)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900"><X className="w-4 h-4 text-white" /></button>
                        <h2 className="text-center text-lg font-bold text-[#2d1b6b] mb-8">Edit Administrator</h2>
                        <div className="space-y-5">
                            {[
                                { label: "First Name", key: "first_name" },
                                { label: "Last Name", key: "last_name" },
                                { label: "Email", key: "email" },
                                { label: "Phone", key: "phone" },
                                { label: "Company", key: "company" },
                                { label: "Job Title", key: "job_title" },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex items-center gap-4">
                                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">{label}</label>
                                    <input type="text" value={(editForm as Record<string, string>)[key]}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, [key]: e.target.value }))}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                                </div>
                            ))}
                            <div className="flex items-center gap-4">
                                <label className="w-20 text-sm font-medium text-gray-700 shrink-0">Role</label>
                                <div className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 bg-gray-100">{roleLabel(editTarget.role)}</div>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setEditTarget(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleUpdate} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90" style={{ background: "#0E3B1F" }}>Save</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setDeleteTarget(null)}>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[360px] mx-4 px-8 py-8" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setDeleteTarget(null)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900"><X className="w-4 h-4 text-white" /></button>
                        <h2 className="text-center text-lg font-bold text-[#2d1b6b] mb-4">Confirm Deletion</h2>
                        <p className="text-center text-sm text-gray-500 mb-6">Delete administrator <strong>{deleteTarget.full_name}</strong>?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 flex items-center justify-center gap-2" style={{ background: "#0E3B1F" }}>
                                <Trash2 className="w-4 h-4" /> Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
