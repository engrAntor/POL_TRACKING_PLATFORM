"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Filter, ChevronDown, ShoppingCart, Tag } from 'lucide-react';

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
    const [listingType, setListingType] = useState('all'); // 'all', 'buy', 'sell'

    // Mock data
    const allProducts = [
        // Buyable items (Listed by others)
        {
            id: 1,
            name: 'Premium Diesel B7',
            company: 'by Global Fuels Ltd',
            type: 'Petroleum',
            typeBg: 'bg-blue-600',
            price: '$1.45',
            description: 'Direct from refinery, ultra-low sulfur.',
            location: 'Port Area',
            rating: 4.8,
            category: 'buy',
            status: 'listed'
        },
        {
            id: 2,
            name: 'Multi-Viscosity Oil',
            company: 'by LubriMax Corp',
            type: 'Oil',
            typeBg: 'bg-amber-600',
            price: '$12',
            description: 'Suitable for heavy machinery.',
            location: 'Industrial Zone',
            rating: 4.5,
            category: 'buy',
            status: 'listed'
        },
        {
            id: 3,
            name: 'Bio-Lubricant 400',
            company: 'by EcoLube Solutions',
            type: 'Lubricant',
            typeBg: 'bg-purple-600',
            price: '$8.5',
            description: 'Environmentally friendly high-performance grease.',
            location: 'East Warehouse',
            rating: 4.8,
            category: 'buy',
            status: 'listed'
        },
        // Sellable items (User's Inventory)
        {
            id: 4,
            name: 'Surplus Aviation Fuel',
            company: 'Qty: 5000 Gal',
            type: 'Petroleum',
            typeBg: 'bg-blue-600',
            price: '$2.10', // Listed item has price
            description: 'Excess inventory from Q3, stored in compliant tanks.',
            location: 'Hangar 4',
            rating: 5.0,
            category: 'sell',
            status: 'listed' // Already added for sell
        },
        {
            id: 5,
            name: 'Hydraulic Fluid Drum',
            company: 'Qty: 5 Barrels',
            type: 'Oil',
            typeBg: 'bg-amber-600',
            price: null, // Not listed yet
            description: 'Unopened drum, expiry 2026.',
            location: 'Storage B',
            rating: null,
            category: 'sell',
            status: 'unlisted' // Not added for sell
        },
        {
            id: 6,
            name: 'Used Engine Oil',
            company: 'Qty: 200 Liters',
            type: 'Lubricant',
            typeBg: 'bg-purple-600',
            price: null,
            description: 'Requires filtration. Available for immediate pickup.',
            location: 'Maintenance Bay',
            rating: null,
            category: 'sell',
            status: 'unlisted'
        },
        {
            id: 7,
            name: 'Industrial Solvent 500',
            company: 'Qty: 10 Drums',
            type: 'Other',
            typeBg: 'bg-gray-600',
            price: null,
            description: 'Surplus solvent sitting in warehouse. Good condition.',
            location: 'West Wing',
            rating: null,
            category: 'sell',
            status: 'unlisted'
        },
        {
            id: 8,
            name: 'Transmission Fluid X',
            company: 'Qty: 150 Gallons',
            type: 'Oil',
            typeBg: 'bg-amber-600',
            price: null,
            description: 'Unopened containers. Expiry 2027.',
            location: 'Storage A',
            rating: null,
            category: 'sell',
            status: 'unlisted'
        }
    ];

    const displayedProducts = allProducts.filter(p => listingType === 'all' || p.category === listingType);

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1a2e22] to-[#2d5a45] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Smart POL Marketplace</h2>
                    <p className="text-white/70 text-sm mb-8 max-w-2xl">
                        Browse global listings or manage your own inventory. AI-driven matching for best prices.
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
                                    className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 pr-10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 border border-white/5"
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
                            <label className="block text-sm text-white font-medium mb-2">Quantity</label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-green-500 border border-white/5"
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
                                    className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 pr-10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 border border-white/5"
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
                            Search Market
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 py-2 overflow-x-auto">
                <button className="flex items-center gap-2 bg-[#0E3B1F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors shadow-sm whitespace-nowrap">
                    <Filter className="h-4 w-4" />
                    Filter
                </button>

                <div className="relative group">
                    <select
                        value={listingType}
                        onChange={(e) => setListingType(e.target.value)}
                        className="appearance-none flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap min-w-[140px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0E3B1F]/20"
                    >
                        <option value="all">All Listings</option>
                        <option value="buy">Buy Only</option>
                        <option value="sell">Sell Only</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative group">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap min-w-[120px] justify-between">
                        Type
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                </div>

                <div className="relative group">
                    <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap min-w-[120px] justify-between">
                        Status
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:shadow-lg transition-shadow">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                <p className="text-xs text-gray-400">{product.company}</p>
                            </div>
                            <span className={`${product.typeBg} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                                {product.type}
                            </span>
                        </div>

                        {/* Price Card Logic */}
                        {(product.category === 'buy' || product.status === 'listed') ? (
                            <div className="border border-gray-100 bg-gray-50/50 rounded-lg p-4 mb-4 flex-1">
                                <p className="text-2xl font-bold text-[#0E3B1F]">{product.price}</p>
                                <p className="text-xs text-gray-400 mb-2">Price per unit</p>
                                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                            </div>
                        ) : (
                            <div className="border border-gray-100 bg-gray-50/50 rounded-lg p-4 mb-4 flex-1">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Inventory Details</p>
                                <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                            </div>
                        )}

                        {/* Location & Rating */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-4 w-4 text-[#F97316]" />
                                {product.location}
                            </div>

                        </div>

                        {/* Action Buttons Logic */}
                        {product.category === 'buy' ? (
                            <Link
                                href={`/marketplace/${product.id}`}
                                className="block w-full text-center bg-[#0E3B1F] text-white py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors shadow-lg shadow-green-900/10"
                            >
                                Purchase Now
                            </Link>
                        ) : (
                            // Sell Tab Actions
                            product.status === 'listed' ? (
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                        Edit
                                    </button>
                                    <button className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100 transition-colors">
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <Link
                                    href={`/marketplace/sell/${product.id}`}
                                    className="block w-full text-center bg-[#0E3B1F] text-white py-3 rounded-lg font-medium hover:bg-[#0B2E18] transition-colors shadow-lg shadow-green-900/10"
                                >
                                    Sell Product
                                </Link>
                            )
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
