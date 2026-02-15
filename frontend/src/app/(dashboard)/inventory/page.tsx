"use client";

import { useState } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

interface InventoryItem {
    id: number;
    brand: string;
    partNumber: string;
    type: string;
    typeColor: string;
    usageRate: string;
    batchNumber: string;
    shelfLife: string;
    expiry: string;
    expiryStatus: 'EXPIRED' | '';
    company: string;
    status: 'Healthy' | 'Expired';
}

const inventoryData: InventoryItem[] = [
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
        expiryStatus: 'EXPIRED', // Kept for consistency if needed, but primary indicator is 'status'
        company: 'Global Fuels Ltd',
        status: 'Healthy',
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
        status: 'Expired',
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
        status: 'Expired',
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
        status: 'Healthy',
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
        status: 'Expired',
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
        status: 'Healthy',
    },
    {
        id: 7,
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
        status: 'Healthy',
    },
];

export default function InventoryPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative w-full max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <button className="flex items-center gap-2 bg-[#0E3B1F] text-white px-6 py-2.5 rounded-lg hover:bg-[#0E3B1F]/90 transition-colors">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                </button>

                {['Brand', 'Type', 'Status'].map((filter) => (
                    <button
                        key={filter}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors min-w-[120px] justify-between"
                    >
                        <span>{filter}</span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto shadow-sm">
                <table className="w-full min-w-[1000px]">
                    <thead>
                        <tr className="border-b border-gray-200 bg-white">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Brand</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Part Number</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Type</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Usage Rate</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Batch Number</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Shelf Life</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Expiry</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Company</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryData.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900 leading-tight">High-Grade</span>
                                        <span className="text-sm font-medium text-gray-900 leading-tight">Diesel</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.partNumber}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm ${item.typeColor}`}>{item.type}</span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.usageRate}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.batchNumber}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.shelfLife}</td>
                                <td className="px-6 py-4 text-sm text-red-500 font-medium">
                                    {item.expiry}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm text-gray-900">Global Fuels</span>
                                        <span className="text-sm text-gray-900">Ltd</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium text-white ${item.status === 'Healthy' ? 'bg-[#65a30d]' : 'bg-red-500'
                                            }`}
                                    >
                                        {item.status} <ChevronDown className="ml-1 h-3 w-3" />
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
