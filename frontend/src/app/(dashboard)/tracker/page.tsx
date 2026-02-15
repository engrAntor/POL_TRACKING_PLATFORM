"use client";

import { useState } from 'react';
import { Search, Pencil, Trash2, X } from 'lucide-react';

interface POLItem {
    id: number;
    productName: string;
    brand: string;
    partNumber: string;
    type: string;
    typeColor: string;
    usageRate: string;
    batchNumber: string;
    shelfLife: string;
    expiry: string;
    expiryStatus: 'EXPIRED' | 'Active' | '';
    company: string;
    location: string;
}

const initialPolData: POLItem[] = [
    {
        id: 1,
        brand: 'High-Grade Diesel',
        partNumber: 'PD - 100',
        type: 'Petroleum',
        typeColor: 'text-orange-500',
        usageRate: '500Liters',
        batchNumber: 'B-001',
        shelfLife: '5 years',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
        company: 'Global Fuels Ltd',
        location: 'Port Area',
        productName: 'Diesel', // Inferred as needed for edit/view logic if distinct from Brand
    },
    {
        id: 2,
        brand: 'High-Grade Diesel',
        partNumber: 'PD - 100',
        type: 'Petroleum',
        typeColor: 'text-orange-500',
        usageRate: '500Liters',
        batchNumber: 'B-001',
        shelfLife: '5 years',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
        company: 'Global Fuels Ltd',
        location: 'Port Area',
        productName: 'Diesel',
    },
    {
        id: 3,
        brand: 'High-Grade Diesel',
        partNumber: 'PD - 100',
        type: 'Petroleum',
        typeColor: 'text-orange-500',
        usageRate: '500Liters',
        batchNumber: 'B-001',
        shelfLife: '5 years',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
        company: 'Global Fuels Ltd',
        location: 'Port Area',
        productName: 'Diesel',
    },
    {
        id: 4,
        brand: 'High-Grade Diesel',
        partNumber: 'PD - 100',
        type: 'Petroleum',
        typeColor: 'text-orange-500',
        usageRate: '500Liters',
        batchNumber: 'B-001',
        shelfLife: '5 years',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
        company: 'Global Fuels Ltd',
        location: 'Port Area',
        productName: 'Diesel',
    },
    {
        id: 5,
        brand: 'High-Grade Diesel',
        partNumber: 'PD - 100',
        type: 'Petroleum',
        typeColor: 'text-orange-500',
        usageRate: '500Liters',
        batchNumber: 'B-001',
        shelfLife: '5 years',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
        company: 'Global Fuels Ltd',
        location: 'Port Area',
        productName: 'Diesel',
    },
    {
        id: 6,
        brand: 'High-Grade Diesel',
        partNumber: 'PD - 100',
        type: 'Petroleum',
        typeColor: 'text-orange-500',
        usageRate: '500Liters',
        batchNumber: 'B-001',
        shelfLife: '5 years',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
        company: 'Global Fuels Ltd',
        location: 'Port Area',
        productName: 'Diesel',
    },
];

export default function TrackerPage() {
    const [pols, setPols] = useState<POLItem[]>(initialPolData);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        productName: '',
        brand: '',
        batchNumber: '',
        partNumber: '',
        shelfLife: '',
        usageRate: '',
        expiry: '',
        company: '',
        location: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        const newPol: POLItem = {
            id: pols.length + 1,
            productName: formData.productName,
            brand: formData.brand,
            partNumber: formData.partNumber,
            type: 'Petroleum', // Default or derived
            typeColor: 'text-orange-500',
            usageRate: formData.usageRate,
            batchNumber: formData.batchNumber,
            shelfLife: formData.shelfLife,
            expiry: formData.expiry,
            expiryStatus: 'Active', // Default
            company: formData.company,
            location: formData.location,
        };
        setPols([...pols, newPol]);
        setIsModalOpen(false);
        setFormData({
            productName: '',
            brand: '',
            batchNumber: '',
            partNumber: '',
            shelfLife: '',
            usageRate: '',
            expiry: '',
            company: '',
            location: '',
        });
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
                <table className="w-full min-w-[1000px]">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Brand</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Part Number</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Usage Rate</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Batch Number</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Shelf Life</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Expiry</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Company</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Location</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {pols.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{item.brand}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.partNumber}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm ${item.typeColor}`}>{item.type}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.usageRate}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.batchNumber}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.shelfLife}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className={`text-sm ${item.expiryStatus === 'EXPIRED' ? 'text-red-500' : 'text-gray-900'
                                            }`}>
                                            {item.expiry}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.company}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.location}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        {/* Actions if needed */}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-8 flex gap-4">
                <button
                    className="bg-[#0E3B1F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors"
                >
                    Upload File
                </button>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#0E3B1F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors"
                >
                    + Add New POL
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Modal Header */}
                        <div className="relative px-6 py-6 flex items-center justify-center border-b border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900">Add New POL</h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        name="productName"
                                        value={formData.productName}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Brand Name</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Batch Number</label>
                                    <input
                                        type="text"
                                        name="batchNumber"
                                        value={formData.batchNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Part Number</label>
                                    <input
                                        type="text"
                                        name="partNumber"
                                        value={formData.partNumber}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Shelf Life</label>
                                    <input
                                        type="text"
                                        name="shelfLife"
                                        value={formData.shelfLife}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Usage Rate</label>
                                    <input
                                        type="text"
                                        name="usageRate"
                                        value={formData.usageRate}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Expiry</label>
                                    <input
                                        type="date"
                                        name="expiry"
                                        value={formData.expiry}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Company</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-1">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                                    />
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="flex items-center gap-3 pt-4 mt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#0E3B1F] rounded-lg hover:bg-[#0E3B1F]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
