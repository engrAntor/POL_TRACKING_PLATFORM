"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, X, ChevronDown } from "lucide-react";

const allAdmins = [
    { id: "#1233", name: "Devon Lane",    email: "bockely@att.com",    phone: "(201) 555-0124", access: "Admin"       },
    { id: "#1233", name: "Foysal Rahman", email: "csilvers@rizon.com", phone: "(219) 555-0114", access: "Admin"       },
    { id: "#1233", name: "Hari Danang",   email: "qamaho@mail.com",    phone: "(316) 555-0116", access: "Admin"       },
    { id: "#1233", name: "Floyd Miles",   email: "xterris@gmail.com",  phone: "(907) 555-0101", access: "Admin"       },
    { id: "#1233", name: "Eleanor Pena",  email: "xterris@gmail.com",  phone: "(505) 555-0125", access: "Admin"       },
    { id: "#1233", name: "Devon Lane",    email: "xterris@gmail.com",  phone: "(704) 555-0127", access: "Super Admin" },
    { id: "#1233", name: "Hari Danang",   email: "xterris@gmail.com",  phone: "(219) 555-0114", access: "Admin"       },
    { id: "#1233", name: "Devon Lane",    email: "xterris@gmail.com",  phone: "(270) 555-0117", access: "Admin"       },
    { id: "#1233", name: "Hari Danang",   email: "xterris@gmail.com",  phone: "(207) 555-0119", access: "Admin"       },
];

type Admin = typeof allAdmins[0];
const PAGE_SIZE = 10;

// ── Reusable role dropdown ────────────────────────────────────────────────────
function RoleDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative flex-1">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white"
            >
                {value}
                <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            {open && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                    {["Admin", "Super Admin"].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => { onChange(r); setOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${r === value ? "text-[#0E3B1F] font-semibold" : "text-gray-700"}`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AdministratorsPage() {
    const [page, setPage]           = useState(1);

    // Create modal
    const [showCreate, setShowCreate] = useState(false);
    const [createRole, setCreateRole] = useState("Super Admin");

    // Edit modal
    const [editTarget, setEditTarget] = useState<Admin | null>(null);
    const [editRole, setEditRole]     = useState("Admin");

    // Delete modal
    const [deleteTarget, setDeleteTarget] = useState<Admin | null>(null);

    const totalPages = Math.ceil(allAdmins.length / PAGE_SIZE);
    const admins     = allAdmins.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function openEdit(admin: Admin) {
        setEditTarget(admin);
        setEditRole(admin.access);
    }

    return (
        <div className="space-y-5">

            {/* Create button */}
            <div>
                <button
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
                    style={{ background: "#0E3B1F" }}
                >
                    <Plus className="w-4 h-4" />
                    New Administrators Profile Create
                </button>
            </div>

            {/* Table */}
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
                        {admins.map((admin, i) => (
                            <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-4 text-gray-700">{admin.id}</td>
                                <td className="px-6 py-4 text-gray-800 font-medium">{admin.name}</td>
                                <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                                <td className="px-6 py-4 text-gray-600">{admin.phone}</td>
                                <td className="px-6 py-4 text-gray-700">{admin.access}</td>
                                <td className="px-8 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEdit(admin)}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center hover:opacity-90 transition-colors"
                                            style={{ background: "#0E3B1F" }}
                                            title="Edit"
                                        >
                                            <Pencil className="w-3.5 h-3.5 text-white" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(admin)}
                                            className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center hover:bg-red-700 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-white" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
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
            </div>

            {/* ── Create Modal ──────────────────────────────────────────── */}
            {showCreate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setShowCreate(false)}>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[400px] mx-4 px-8 py-8"
                        onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setShowCreate(false)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900 transition-colors">
                            <X className="w-4 h-4 text-white" />
                        </button>
                        <h2 className="text-center text-lg font-bold text-[#2d1b6b] mb-8">
                            New Administrator Profile Create
                        </h2>
                        <div className="space-y-5">
                            {[
                                { label: "First Name", type: "text"     },
                                { label: "Last Name",  type: "text"     },
                                { label: "Email",      type: "email"    },
                                { label: "Password",   type: "password" },
                                { label: "Phone",      type: "tel"      },
                                { label: "Company",    type: "text"     },
                                { label: "Job Title",  type: "text"     },
                            ].map(({ label, type }) => (
                                <div key={label} className="flex items-center gap-4">
                                    <label className="w-20 text-sm font-medium text-gray-700 shrink-0">{label}</label>
                                    <input type={type} placeholder={label}
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                                </div>
                            ))}
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Role</label>
                                <RoleDropdown value={createRole} onChange={setCreateRole} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setShowCreate(false)}
                                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
                                style={{ background: "#0E3B1F" }}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit Modal ────────────────────────────────────────────── */}
            {editTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setEditTarget(null)}>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[400px] mx-4 px-8 py-8"
                        onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setEditTarget(null)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900 transition-colors">
                            <X className="w-4 h-4 text-white" />
                        </button>
                        <h2 className="text-center text-lg font-bold text-[#2d1b6b] mb-8">
                            Edit Administrator
                        </h2>
                        <div className="space-y-5">
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Name</label>
                                <input type="text" defaultValue={editTarget.name}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Email</label>
                                <input type="email" defaultValue={editTarget.email}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Phone</label>
                                <input type="tel" defaultValue={editTarget.phone}
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Password</label>
                                <input type="password" placeholder="New password (optional)"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Company</label>
                                <input type="text"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Job Title</label>
                                <input type="text"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-gray-400" />
                            </div>
                            <div className="flex items-center gap-4">
                                <label className="w-16 text-sm font-medium text-gray-700 shrink-0">Role</label>
                                <RoleDropdown value={editRole} onChange={setEditRole} />
                            </div>
                        </div>
                        <div className="flex gap-3 mt-8">
                            <button onClick={() => setEditTarget(null)}
                                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors"
                                style={{ background: "#0E3B1F" }}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Delete Confirm Modal ──────────────────────────────────── */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
                    onClick={() => setDeleteTarget(null)}>
                    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[360px] mx-4 px-8 py-8"
                        onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setDeleteTarget(null)}
                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-900 transition-colors">
                            <X className="w-4 h-4 text-white" />
                        </button>
                        <h2 className="text-center text-lg font-bold text-[#2d1b6b] mb-8">
                            Confirm Deletion
                        </h2>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteTarget(null)}
                                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                Cancel
                            </button>
                            <button
                                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white hover:opacity-90 transition-colors flex items-center justify-center gap-2"
                                style={{ background: "#0E3B1F" }}>
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
