"use client";

import React, { useState } from 'react';
import { ChevronLeft, Info, DollarSign } from 'lucide-react';
import Link from 'next/link';

// Mock data (duplicated for prototype simplicity)
const unlistedInventory = [
    {
        id: 4,
        name: 'Surplus Aviation Fuel',
        company: 'Qty: 5000 Gal',
        type: 'Petroleum',
        typeBg: 'bg-blue-600',
        description: 'Excess inventory from Q3, stored in compliant tanks.',
        location: 'Hangar 4'
    },
    {
        id: 5,
        name: 'Hydraulic Fluid Drum',
        company: 'Qty: 5 Barrels',
        type: 'Oil',
        typeBg: 'bg-amber-600',
        description: 'Unopened drum, expiry 2026.',
        location: 'Storage B'
    },
    {
        id: 6,
        name: 'Used Engine Oil',
        company: 'Qty: 200 Liters',
        type: 'Lubricant',
        typeBg: 'bg-purple-600',
        description: 'Requires filtration. Available for immediate pickup.',
        location: 'Maintenance Bay'
    },
    {
        id: 7,
        name: 'Industrial Solvent 500',
        company: 'Qty: 10 Drums',
        type: 'Other',
        typeBg: 'bg-gray-600',
        description: 'Surplus solvent sitting in warehouse. Good condition.',
        location: 'West Wing'
    },
    {
        id: 8,
        name: 'Transmission Fluid X',
        company: 'Qty: 150 Gallons',
        type: 'Oil',
        typeBg: 'bg-amber-600',
        description: 'Unopened containers. Expiry 2027.',
        location: 'Storage A'
    }
];

export default function SellListingPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const product = unlistedInventory.find(p => p.id === Number(id));

    const [price, setPrice] = useState('');
    const [description, setDescription] = useState(product ? product.description : '');

    if (!product) {
        return (
            <div className="p-8 text-center text-gray-500">
                <h2 className="text-xl font-bold mb-4">Item Not Found</h2>
                <Link href="/marketplace" className="text-[#0E3B1F] hover:underline">Return to Marketplace</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 md:p-8">
            <Link href="/marketplace" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Cancel Listing
            </Link>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-[#1f2937] p-6 text-white border-b border-gray-700">
                    <h1 className="text-2xl font-bold">List Item for Sale</h1>
                    <p className="text-gray-400 text-sm">Convert your inventory into a marketplace listing</p>
                </div>

                <div className="p-8 space-y-6">
                    {/* Item Preview */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg ${product.typeBg} flex items-center justify-center text-white font-bold text-xl`}>
                            {product.type[0]}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-sm text-gray-500">{product.company} • {product.location}</p>
                        </div>
                    </div>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Set Asking Price ($)
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0E3B1F] focus:border-transparent transition-all text-lg font-medium"
                                />
                            </div>
                            <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                                <Info className="h-3.5 w-3.5" />
                                Recommended market price: $12-15 per unit based on recent sales.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Listing Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0E3B1F] focus:border-transparent transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-2 text-right">
                                {description.length} characters
                            </p>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4">
                            <Link href="/marketplace" className="flex-1 text-center py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                                Cancel
                            </Link>
                            <button type="button" className="flex-1 bg-[#0E3B1F] text-white py-3 rounded-lg font-bold hover:bg-[#0E3B1F]/90 transition-colors shadow-lg shadow-green-900/10">
                                Add to Marketplace
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
