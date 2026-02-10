"use client";

import { useState } from 'react';
import { Search, Pencil, Trash2 } from 'lucide-react';

const polData = [
    {
        id: 1,
        product: 'High-Grade Diesel',
        type: 'Petroleum',
        typeColor: 'text-primary',
        stock: '500Liters',
        stockStatus: '',
        usageRate: '25 / day',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
    },
    {
        id: 2,
        product: 'High-Grade Diesel',
        type: 'Oil',
        typeColor: 'text-primary',
        stock: '500Liters',
        stockStatus: 'Critical Stock',
        usageRate: '25 / day',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
    },
    {
        id: 3,
        product: 'High-Grade Diesel',
        type: 'Lubricant',
        typeColor: 'text-primary',
        stock: '500Liters',
        stockStatus: 'Critical Stock',
        usageRate: '25 / day',
        expiry: '2025-05-20',
        expiryStatus: 'EXPIRED',
    },
];

export default function TrackerPage() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="space-y-6">
            {/* Search and Add Button Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Search Bar */}
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

                {/* Add New POL Button */}
                <button className="w-full md:w-auto bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                    + Add New POL
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Product</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Type</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Stock</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Usage Rate</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Expiry</th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {polData.map((item) => (
                            <tr key={item.id} className="border-b border-gray-100 last:border-0">
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{item.product}</p>
                                        <p className="text-xs text-gray-400">ID: {item.id}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm font-medium ${item.typeColor}`}>{item.type}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm text-gray-900">{item.stock}</p>
                                        {item.stockStatus && (
                                            <p className="text-xs text-primary">{item.stockStatus}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-900">{item.usageRate}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <p className="text-sm text-gray-900">{item.expiry}</p>
                                        {item.expiryStatus && (
                                            <p className="text-xs text-red-500">{item.expiryStatus}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                                            <Pencil className="h-4 w-4" />
                                        </button>
                                        <button className="p-2 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
