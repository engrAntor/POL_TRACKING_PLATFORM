"use client";

import { useState } from 'react';
import { ChevronDown, MapPin, Star } from 'lucide-react';

const products = [
    {
        id: 1,
        name: 'Premium Diesel B7',
        company: 'by Global Fuels Ltd',
        type: 'Petroleum',
        typeBg: 'bg-primary',
        price: '$1.45',
        description: 'Direct from refinery, ultra-low sulfur.',
        location: 'Port Area',
        rating: 4.8,
    },
    {
        id: 2,
        name: 'Multi-Viscosity Oil',
        company: 'by LubriMax Corp',
        type: 'Oil',
        typeBg: 'bg-primary',
        price: '$12',
        description: 'Suitable for heavy machinery.',
        location: 'Industrial Zone',
        rating: 4.5,
    },
    {
        id: 3,
        name: 'Bio-Lubricant 400',
        company: 'by EcoLube Solutions',
        type: 'Lubricant',
        typeBg: 'bg-primary',
        price: '$8.5',
        description: 'Environmentally friendly high-performance grease.',
        location: 'East Warehouse',
        rating: 4.8,
    },
];

export default function MarketplacePage() {
    const [polType, setPolType] = useState('Petroleum');
    const [quantity, setQuantity] = useState('1000');
    const [location, setLocation] = useState('Any location');

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1a2e22] to-[#2d5a45] rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Smart POL Marketplace</h2>
                    <p className="text-white/70 text-sm mb-8">
                        Our AI Agent analyzes local data and global suppliers to match your specific procurement needs.
                    </p>

                    {/* Filter Container */}
                    <div className="bg-[#1f3b2e]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col lg:flex-row lg:items-end gap-6">
                        {/* POL Type */}
                        <div className="w-full lg:flex-1">
                            <label className="block text-sm text-white font-medium mb-2">POL Type</label>
                            <div className="relative">
                                <select
                                    value={polType}
                                    onChange={(e) => setPolType(e.target.value)}
                                    className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 pr-10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500"
                                >
                                    <option value="Petroleum" className="text-gray-900">Petroleum</option>
                                    <option value="Oil" className="text-gray-900">Oil</option>
                                    <option value="Lubricant" className="text-gray-900">Lubricant</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-12 bg-white/10 mb-1"></div>

                        {/* Quantity Needed */}
                        <div className="w-full lg:flex-1">
                            <label className="block text-sm text-white font-medium mb-2">Quantity Needed</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-green-500"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-0.5">
                                    <ChevronDown className="h-4 w-4 text-white/50 rotate-180" />
                                    <ChevronDown className="h-4 w-4 text-white/50" />
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="hidden lg:block w-px h-12 bg-white/10 mb-1"></div>

                        {/* Location */}
                        <div className="w-full lg:flex-1">
                            <label className="block text-sm text-white font-medium mb-2">Location</label>
                            <div className="relative">
                                <select
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 pr-10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500"
                                >
                                    <option value="Any location" className="text-gray-900">Any location</option>
                                    <option value="Port Area" className="text-gray-900">Port Area</option>
                                    <option value="Industrial Zone" className="text-gray-900">Industrial Zone</option>
                                    <option value="East Warehouse" className="text-gray-900">East Warehouse</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                            </div>
                        </div>

                        {/* Match Inventory Button */}
                        <button className="w-full lg:w-auto bg-[#FCD34D] hover:bg-[#F59E0B] text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-lg shadow-yellow-500/20">
                            Match inventory
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                <p className="text-xs text-gray-400">{product.company}</p>
                            </div>
                            <span className={`${product.typeBg} text-white text-xs px-3 py-1 rounded-full`}>
                                {product.type}
                            </span>
                        </div>

                        {/* Price Card */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-4 flex-1">
                            <p className="text-2xl font-bold text-primary">{product.price}</p>
                            <p className="text-xs text-gray-400 mb-2">Price per unit</p>
                            <p className="text-sm text-gray-600">{product.description}</p>
                        </div>

                        {/* Location & Rating */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-4 w-4 text-red-500" />
                                {product.location}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {product.rating} Seller Rating
                            </div>
                        </div>

                        {/* Purchase Button */}
                        <button className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                            Purchase
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
