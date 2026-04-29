"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Pencil, Trash2, X, Upload, FileText, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ImageIcon, Crown } from 'lucide-react';

interface POLItem {
    id: number;
    part_number: string;
    description: string;
    pol_type: string;
    uom: string;
    quantity: string;
    shelf_life: string;
    expiry: string;
    expiry_status: string;
    condition: string;
    price_per_unit: string;
    status: string;
    // Optional
    product_name: string;
    alt_part_number: string;
    manufacturer_part_number: string;
    mil_spec: string;
    serial_number: string;
    batch_number: string;
    source: string;
    balance: string;
    notes: string;
    image: string | null;
    msds_file: string | null;
    created_at: string;
    updated_at: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api') + '/dashboard';

const typeLabels: Record<string, string> = {
    petroleum: 'Petroleum', oil: 'Oil', lubricant: 'Lubricant',
};

const conditionLabels: Record<string, string> = {
    new_pol: 'New POL', leftover_pol: 'Leftover POL', opened_pol: 'Opened POL',
};

const uomLabels: Record<string, string> = {
    QT: 'Quart', OZ: 'Ounce', LB: 'Pound', RL: 'Roll', EA: 'Each',
    GAL: 'Gallon', ML: 'Millilitre', PT: 'Pint', KT: 'Kit',
    GM: 'Gram', FT: 'Feet', 'SQ ST': 'Square Feet', YD: 'Yard', CC: 'Cubic Centimeter',
};

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
    const [userTier, setUserTier] = useState<string>('basic');
    const [showOptional, setShowOptional] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const itemsPerPage = 10;
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        part_number: '', description: '', pol_type: 'petroleum', uom: 'GAL',
        quantity: '', shelf_life: '', expiry: '', condition: 'new_pol', price_per_unit: '',
        product_name: '', alt_part_number: '', manufacturer_part_number: '',
        mil_spec: '', serial_number: '', batch_number: '',
        source: '', balance: '', notes: '',
    });

    const getToken = () => localStorage.getItem('access_token');

    const refreshAccessToken = async (): Promise<string | null> => {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) return null;
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('access_token', data.access);
                return data.access;
            }
        } catch { /* ignore */ }
        return null;
    };

    const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
        const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
        headers['Authorization'] = `Bearer ${getToken()}`;
        let res = await fetch(url, { ...options, headers });
        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                headers['Authorization'] = `Bearer ${newToken}`;
                res = await fetch(url, { ...options, headers });
            }
        }
        return res;
    };

    const fetchPols = useCallback(async () => {
        try {
            const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/tracker/`);
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
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const userObj = JSON.parse(userStr);
                if (userObj.subscription_tier) setUserTier(userObj.subscription_tier);
            } catch (e) { }
        }
    }, [fetchPols]);

    const filteredPols = pols.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
            item.part_number.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            (item.product_name || '').toLowerCase().includes(q)
        );
    });

    const totalPages = Math.ceil(filteredPols.length / itemsPerPage);
    const paginatedPols = filteredPols.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({
            part_number: '', description: '', pol_type: 'petroleum', uom: 'GAL',
            quantity: '', shelf_life: '', expiry: '', condition: 'new_pol', price_per_unit: '',
            product_name: '', alt_part_number: '', manufacturer_part_number: '',
            mil_spec: '', serial_number: '', batch_number: '',
            source: '', balance: '', notes: '',
        });
        setEditingItem(null);
        setShowOptional(false);
        setImageFile(null);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingItem
                ? `${process.env.NEXT_PUBLIC_API_URL}/dashboard/tracker/${editingItem.id}/`
                : `${process.env.NEXT_PUBLIC_API_URL}/dashboard/tracker/create/`;
            const method = editingItem ? 'PATCH' : 'POST';

            // Build FormData to support image upload
            const fd = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === 'quantity' && value === '') fd.append(key, '0');
                else if (key === 'price_per_unit' && value === '') fd.append(key, '0');
                else fd.append(key, value);
            });
            if (imageFile) fd.append('image', imageFile);

            const res = await authFetch(url, {
                method,
                body: fd,
            });
            if (res.ok) {
                setIsModalOpen(false);
                resetForm();
                fetchPols();
            } else {
                const err = await res.json();
                console.error('Save failed:', err);
                alert('Failed to save: ' + JSON.stringify(err));
            }
        } catch {
            console.error('Failed to save POL item');
        }
    };

    const handleEdit = (item: POLItem) => {
        setFormData({
            part_number: item.part_number,
            description: item.description,
            pol_type: item.pol_type,
            uom: item.uom,
            quantity: item.quantity,
            shelf_life: item.shelf_life,
            expiry: item.expiry,
            condition: item.condition,
            price_per_unit: item.price_per_unit,
            product_name: item.product_name,
            alt_part_number: item.alt_part_number,
            manufacturer_part_number: item.manufacturer_part_number,
            mil_spec: item.mil_spec,
            serial_number: item.serial_number,
            batch_number: item.batch_number,
            source: item.source,
            balance: item.balance,
            notes: item.notes,
        });
        setEditingItem(item);
        const hasOptional = !!(item.product_name || item.alt_part_number || item.manufacturer_part_number || item.mil_spec || item.serial_number || item.batch_number || item.source || item.balance || item.notes);
        setShowOptional(hasOptional);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/tracker/${id}/`, {
                method: 'DELETE',
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
            const res = await authFetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/upload-csv/`, {
                method: 'POST',
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

    const conditionBadge = (s: string) => {
        const c: Record<string, string> = { new_pol: 'bg-blue-100 text-blue-700', leftover_pol: 'bg-yellow-100 text-yellow-700', opened_pol: 'bg-orange-100 text-orange-700' };
        return c[s] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-full md:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredPols.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No POL items found.</div>
                ) : (
                    <table className="w-full min-w-[2000px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                {/* Required columns */}
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Image</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Part Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Description</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Type</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">UOM</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Stock</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Shelf Life</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Expiry</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Condition</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Price</th>
                                {/* Optional columns */}
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Product Name</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Alt Part Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Mfr Part Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">MIL Spec</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Serial Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Batch Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Source</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Balance</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Notes</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedPols.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                    {/* Required columns */}
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {item.image ? (
                                            <img src={item.image} alt={item.product_name || item.part_number} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{item.part_number}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] truncate">{item.description}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{typeLabels[item.pol_type] || item.pol_type}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{uomLabels[item.uom] || item.uom}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{parseFloat(item.quantity) % 1 === 0 ? parseInt(item.quantity) : item.quantity}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.shelf_life}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.expiry}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${conditionBadge(item.condition)}`}>
                                            {conditionLabels[item.condition] || item.condition}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">${item.price_per_unit}</td>
                                    {/* Optional columns — empty if no data */}
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.product_name || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.alt_part_number || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.manufacturer_part_number || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.mil_spec || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.serial_number || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.batch_number || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.source || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.balance || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] truncate">{item.notes || ''}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1">
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

            {/* Pagination */}
            {filteredPols.length > itemsPerPage && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredPols.length)} of {filteredPols.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 text-sm rounded-lg border ${page === currentPage ? 'bg-[#0E3B1F] text-white border-[#0E3B1F]' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                                {page}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="mt-8 flex flex-wrap gap-4">
                {userTier !== 'basic' ? (
                    <button onClick={() => setIsUploadModalOpen(true)}
                        className="bg-[#0E3B1F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors flex items-center gap-2">
                        <Upload className="w-4 h-4" /> Upload File
                    </button>
                ) : (
                    <div className="relative group flex items-center">
                        <button disabled
                            className="bg-gray-300 text-white px-8 py-3 rounded-lg font-medium flex items-center gap-2 cursor-not-allowed">
                            <Upload className="w-4 h-4" /> Upload File
                            <Crown className="w-4 h-4 ml-1 text-yellow-500" />
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                            Upgrade to Business or Premium to use Bulk Upload
                        </div>
                    </div>
                )}
                <button onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="bg-[#0E3B1F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors">
                    + Add New POL
                </button>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="relative px-6 py-6 flex items-center justify-center border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900">Upload File</h3>
                            <button onClick={() => { setIsUploadModalOpen(false); setUploadFile(null); setUploadStatus(null); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-600">
                                Upload a <strong>CSV</strong> or <strong>Excel (XLS/XLSX)</strong> file to bulk import POL items.
                            </p>
                            <div onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#0E3B1F] transition-colors">
                                {uploadFile ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <FileText className="w-6 h-6 text-[#0E3B1F]" />
                                        <span className="text-sm font-medium text-gray-900">{uploadFile.name}</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Click to select a file</p>
                                        <p className="text-xs text-gray-400 mt-1">CSV, XLS, or XLSX supported</p>
                                    </>
                                )}
                            </div>
                            <input ref={fileInputRef} type="file" accept=".csv,.xls,.xlsx" className="hidden"
                                onChange={(e) => { setUploadFile(e.target.files?.[0] || null); setUploadStatus(null); }} />
                            {uploadStatus && (
                                <p className={`text-sm ${uploadStatus.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>{uploadStatus.message}</p>
                            )}
                            <div className="flex items-center gap-3 pt-2">
                                <button type="button" onClick={() => { setIsUploadModalOpen(false); setUploadFile(null); setUploadStatus(null); }}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                                <button type="button" onClick={handleFileUpload} disabled={!uploadFile || isUploading}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#0E3B1F] rounded-lg hover:bg-[#0E3B1F]/90 disabled:opacity-50">
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
                            <button onClick={() => { setIsModalOpen(false); resetForm(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            {/* Required Fields */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Part Number *</label>
                                        <input type="text" name="part_number" value={formData.part_number} onChange={handleInputChange} required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Type *</label>
                                        <select name="pol_type" value={formData.pol_type} onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                                            <option value="petroleum">Petroleum</option>
                                            <option value="oil">Oil</option>
                                            <option value="lubricant">Lubricant</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Description *</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none" />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">UOM *</label>
                                        <select name="uom" value={formData.uom} onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                                            <option value="QT">QT - Quart</option>
                                            <option value="OZ">OZ - Ounce</option>
                                            <option value="LB">LB - Pound</option>
                                            <option value="RL">RL - Roll</option>
                                            <option value="EA">EA - Each</option>
                                            <option value="GAL">GAL - Gallon</option>
                                            <option value="ML">ML - Millilitre</option>
                                            <option value="PT">PT - Pint</option>
                                            <option value="KT">KT - Kit</option>
                                            <option value="GM">GM - Gram</option>
                                            <option value="FT">FT - Feet</option>
                                            <option value="SQ ST">SQ ST - Square Feet</option>
                                            <option value="YD">YD - Yard</option>
                                            <option value="CC">CC - Cubic Centimeter</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Stock/Qty</label>
                                        <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} step="0.01" placeholder="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Price/Unit</label>
                                        <input type="number" name="price_per_unit" value={formData.price_per_unit} onChange={handleInputChange} step="0.01" placeholder="0.00"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Shelf Life *</label>
                                        <input type="text" name="shelf_life" value={formData.shelf_life} onChange={handleInputChange} required placeholder="e.g. 5 years"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Expiry Date *</label>
                                        <input type="date" name="expiry" value={formData.expiry} onChange={handleInputChange} required
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Condition *</label>
                                    <select name="condition" value={formData.condition} onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                                        <option value="new_pol">New POL</option>
                                        <option value="leftover_pol">Leftover POL</option>
                                        <option value="opened_pol">Opened POL</option>
                                    </select>
                                </div>
                            </div>

                            {/* Product Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-1">Product Image</label>
                                <label className="flex items-center gap-2 w-full border border-dashed border-gray-300 rounded-lg px-3 py-3 cursor-pointer hover:border-[#0E3B1F] hover:bg-green-50/30 transition-colors">
                                    <ImageIcon className="h-4 w-4 text-gray-400" />
                                    <span className="text-sm text-gray-500 truncate flex-1">
                                        {imageFile ? imageFile.name : 'Upload JPG, PNG, or JPEG'}
                                    </span>
                                    <input type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                                </label>
                                {imageFile && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-green-700 truncate">{imageFile.name}</span>
                                        <button type="button" onClick={() => setImageFile(null)} className="text-xs text-red-500 hover:text-red-700 ml-auto">Remove</button>
                                    </div>
                                )}
                                {!imageFile && editingItem?.image && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <img src={editingItem.image} alt="Current" className="w-8 h-8 rounded object-cover" />
                                        <span className="text-xs text-gray-500">Current image attached</span>
                                    </div>
                                )}
                            </div>

                            {/* Optional Fields Toggle */}
                            <button type="button" onClick={() => setShowOptional(!showOptional)}
                                className="flex items-center gap-2 text-sm text-[#0E3B1F] font-medium hover:text-[#0E3B1F]/80">
                                {showOptional ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                {showOptional ? 'Hide' : 'Show'} Optional Fields
                            </button>

                            {showOptional && (
                                <div className="space-y-4 border-t border-gray-100 pt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Product Name</label>
                                        <input type="text" name="product_name" value={formData.product_name} onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">Alt Part Number</label>
                                            <input type="text" name="alt_part_number" value={formData.alt_part_number} onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">Manufacturer Part #</label>
                                            <input type="text" name="manufacturer_part_number" value={formData.manufacturer_part_number} onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">MIL Spec</label>
                                            <input type="text" name="mil_spec" value={formData.mil_spec} onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">Serial Number</label>
                                            <input type="text" name="serial_number" value={formData.serial_number} onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">Batch Number</label>
                                            <input type="text" name="batch_number" value={formData.batch_number} onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-900 mb-1">Source</label>
                                            <input type="text" name="source" value={formData.source} onChange={handleInputChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Balance</label>
                                        <input type="text" name="balance" value={formData.balance} onChange={handleInputChange} placeholder="e.g. 400L remaining"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1">Notes</label>
                                        <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows={2}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none" />
                                    </div>
                                </div>
                            )}

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
