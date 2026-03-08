"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Pencil, Trash2, X, Upload, FileText } from 'lucide-react';

interface POLItem {
    id: number;
    product_name: string;
    part_number: string;
    shelf_life: string;
    expiry: string;
    expiry_status: string;
    status: string;
    quantity: string;
    price_per_unit: string;
    msds_file: string | null;
    created_at: string;
    updated_at: string;
}

const API_BASE = 'http://127.0.0.1:8000/api/dashboard';

export default function TrackerPage() {
    const [pols, setPols] = useState<POLItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [editingItem, setEditingItem] = useState<POLItem | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        product_name: '',
        part_number: '',
        shelf_life: '',
        expiry: '',
        quantity: '',
        price_per_unit: '',
    });

    const getToken = () => localStorage.getItem('access_token');

    const fetchPols = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/tracker/`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setPols(Array.isArray(data) ? data : data.results || []);
            }
        } catch {
            console.error('Failed to fetch tracker data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPols();
    }, [fetchPols]);

    const filteredPols = pols.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
            item.product_name.toLowerCase().includes(q) ||
            item.part_number.toLowerCase().includes(q)
        );
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            product_name: '', part_number: '',
            shelf_life: '', expiry: '',
            quantity: '', price_per_unit: '',
        });
        setEditingItem(null);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingItem
                ? `${API_BASE}/tracker/${editingItem.id}/`
                : `${API_BASE}/tracker/create/`;
            const method = editingItem ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken()}`,
                },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchPols();
            }
        } catch {
            console.error('Failed to save POL item');
        }
    };

    const handleEdit = (item: POLItem) => {
        setFormData({
            product_name: item.product_name,
            part_number: item.part_number,
            shelf_life: item.shelf_life,
            expiry: item.expiry,
            quantity: item.quantity,
            price_per_unit: item.price_per_unit,
        });
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            const res = await fetch(`${API_BASE}/tracker/${id}/`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) fetchPols();
        } catch {
            console.error('Failed to delete POL item');
        }
    };

    const handleFileUpload = async () => {
        if (!uploadFile) return;
        setIsUploading(true);
        setUploadStatus(null);

        const fd = new FormData();
        fd.append('file', uploadFile);

        try {
            const res = await fetch(`${API_BASE}/upload-csv/`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${getToken()}` },
                body: fd,
            });
            const data = await res.json();
            if (res.ok) {
                setUploadStatus({ message: data.message, type: 'success' });
                setUploadFile(null);
                fetchPols();
            } else {
                setUploadStatus({ message: data.error || 'Upload failed.', type: 'error' });
            }
        } catch {
            setUploadStatus({ message: 'Network error. Please try again.', type: 'error' });
        } finally {
            setIsUploading(false);
        }
    };

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            healthy: 'bg-green-100 text-green-700',
            expired: 'bg-red-100 text-red-700',
            low_stock: 'bg-yellow-100 text-yellow-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const expiryBadge = (status: string) => {
        const colors: Record<string, string> = {
            active: 'bg-green-100 text-green-700',
            expired: 'bg-red-100 text-red-700',
            near_expiry: 'bg-orange-100 text-orange-700',
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredPols.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No POL items found.</div>
                ) : (
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Product Name</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Part Number</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Shelf Life</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Expiry</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Expiry Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Quantity</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Price/Unit</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPols.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.product_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.part_number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.shelf_life}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.expiry}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${expiryBadge(item.expiry_status)}`}>
                                            {item.expiry_status === 'near_expiry' ? 'Near Expiry' : item.expiry_status.charAt(0).toUpperCase() + item.expiry_status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge(item.status)}`}>
                                            {item.status === 'low_stock' ? 'Low Stock' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{parseFloat(item.quantity) % 1 === 0 ? parseInt(item.quantity) : item.quantity}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">${item.price_per_unit}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => handleEdit(item)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="bg-[#0E3B1F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload File
                </button>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[#0E3B1F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors"
                >
                    + Add New POL
                </button>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="relative px-6 py-6 flex items-center justify-center border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900">Upload File</h3>
                            <button
                                onClick={() => { setIsUploadModalOpen(false); setUploadFile(null); setUploadStatus(null); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                Upload a <strong>CSV file</strong> to bulk import POL items, or a <strong>PDF (MSDS)</strong> document.
                            </p>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#0E3B1F] transition-colors"
                            >
                                {uploadFile ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <FileText className="w-6 h-6 text-[#0E3B1F]" />
                                        <span className="text-sm font-medium text-gray-900">{uploadFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Click to select a file</p>
                                        <p className="text-xs text-gray-400 mt-1">CSV or PDF supported</p>
                                    </>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv,.pdf"
                                className="hidden"
                                onChange={(e) => { setUploadFile(e.target.files?.[0] || null); setUploadStatus(null); }}
                            />
                            {uploadStatus && (
                                <p className={`text-sm ${uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                    {uploadStatus.message}
                                </p>
                            )}
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setIsUploadModalOpen(false); setUploadFile(null); setUploadStatus(null); }}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleFileUpload}
                                    disabled={!uploadFile || isUploading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#0E3B1F] rounded-lg hover:bg-[#0E3B1F]/90 disabled:opacity-50"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="relative px-6 py-6 flex items-center justify-center border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900">
                                {editingItem ? 'Edit POL Item' : 'Add New POL'}
                            </h3>
                            <button
                                onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Product Name</label>
                                    <input type="text" name="product_name" value={formData.product_name} onChange={handleInputChange} required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Part Number</label>
                                    <input type="text" name="part_number" value={formData.part_number} onChange={handleInputChange} required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Shelf Life</label>
                                        <input type="text" name="shelf_life" value={formData.shelf_life} onChange={handleInputChange} required placeholder="e.g. 5 years"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Expiry Date</label>
                                        <input type="date" name="expiry" value={formData.expiry} onChange={handleInputChange} required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Quantity</label>
                                        <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} step="0.01" placeholder="0.00"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Price Per Unit</label>
                                        <input type="number" name="price_per_unit" value={formData.price_per_unit} onChange={handleInputChange} step="0.01" placeholder="0.00"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    Cancel
                                </button>
                                <button type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#0E3B1F] rounded-lg hover:bg-[#0E3B1F]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                    {editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
