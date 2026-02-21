"use client";

import React, { useState } from 'react';
import { ChevronLeft, MapPin, ShieldCheck, Truck, X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';

const allProducts = [
    {
        id: 1,
        name: 'Premium Diesel B7',
        company: 'by Global Fuels Ltd',
        type: 'Petroleum',
        typeBg: 'bg-blue-600',
        price: '$1.45',
        priceNum: 1.45,
        priceUnit: 'Liter',
        brand: 'Shell',
        batch: 'B- 001122',
        expiry: '12 Sept 2027',
        shelfLife: '5 Years',
        description: 'Direct from refinery, ultra-low sulfur. Compliant with all regional standards. Bulk discounts available for orders over 10,000 Gallons.',
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
        priceNum: 12,
        priceUnit: 'Liter',
        brand: 'Mobil',
        batch: 'B- 002233',
        expiry: '10 Jan 2028',
        shelfLife: '4 Years',
        description: 'Suitable for heavy machinery. High thermal stability and oxidation resistance.',
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
        priceNum: 8.5,
        priceUnit: 'Liter',
        brand: 'EcoLube',
        batch: 'B- 003344',
        expiry: '05 Mar 2026',
        shelfLife: '3 Years',
        description: 'Environmentally friendly high-performance grease. Biodegradable and non-toxic.',
        location: 'East Warehouse',
        rating: 4.8,
        category: 'buy',
        status: 'listed'
    }
];

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
    const { id } = params;
    const product = allProducts.find(p => p.id === Number(id));
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [quantity, setQuantity] = useState(1000);

    if (!product) {
        return (
            <div className="p-8 text-center text-gray-500">
                <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
                <Link href="/marketplace" className="text-[#0E3B1F] hover:underline">Return to Marketplace</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Link href="/marketplace" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Marketplace
            </Link>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#1a2e22] to-[#2d5a45] p-8 text-white relative">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`${product.typeBg} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                                    {product.type}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{product.name}</h1>
                            <p className="text-white/80">{product.company}</p>
                        </div>
                        <div className="text-left md:text-right bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 w-full md:w-auto">
                            <p className="text-sm text-white/70 mb-1">Price per unit</p>
                            <p className="text-3xl font-bold text-white mb-2">{product.price}</p>
                            <button
                                onClick={() => setShowOrderSummary(true)}
                                className="w-full bg-[#FCD34D] text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-[#F59E0B] transition-colors shadow-lg"
                            >
                                Proceed to Buy
                            </button>
                        </div>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {product.description}
                            </p>
                            <p className="text-gray-600 leading-relaxed mt-4">
                                This product is sourced directly from certified suppliers and undergoes rigorous quality checks before listing. Ideal for industrial and commercial applications requiring high reliability.
                            </p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Verified Supplier</h4>
                                    <p className="text-sm text-gray-500">Identity and license verified by Start POL</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                    <Truck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900">Fast Delivery</h4>
                                    <p className="text-sm text-gray-500">Available for next-day shipping in your region</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="space-y-6">
                        <div className="border border-gray-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Location</h3>
                            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg mb-4">
                                <MapPin className="h-5 w-5 text-[#0E3B1F]" />
                                <span className="font-medium">{product.location}</span>
                            </div>
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                Map Preview
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Order Summary Modal */}
            {showOrderSummary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowOrderSummary(false)}
                            className="absolute top-5 right-5 w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8">
                            {/* Badge */}
                            <div className="inline-flex items-center bg-[#1a4731] text-white text-sm font-semibold px-5 py-2 rounded-full mb-6">
                                Order Summary
                            </div>

                            {/* Product Info */}
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{product.name}</h2>
                            <p className="text-base text-gray-500 mb-1">( {product.type} )</p>
                            <div className="flex items-center gap-1.5 text-base text-gray-500 mb-6">
                                <MapPin className="h-5 w-5 text-[#0E3B1F]" />
                                {product.location}
                            </div>

                            {/* Two-column layout */}
                            <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-5">
                                {/* Left column: details */}
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-gray-500 text-sm">Brand</span>
                                        <p className="text-[#0E3B1F] font-semibold text-base mt-0.5">{product.brand}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm">Batch</span>
                                        <p className="text-gray-800 font-medium text-base mt-0.5">{product.batch}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm">Expiry</span>
                                        <p className="text-gray-800 font-medium text-base mt-0.5">{product.expiry}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 text-sm">Shelf Life</span>
                                        <p className="text-gray-800 font-medium text-base mt-0.5">{product.shelfLife}</p>
                                    </div>
                                </div>

                                {/* Right column: quantity, price, actions */}
                                <div className="space-y-5">
                                    <div>
                                        <span className="text-gray-500 text-sm mb-2 block">Quantity</span>
                                        <div className="flex items-center gap-2 border border-[#1a4731] rounded-lg overflow-hidden w-fit">
                                            <button
                                                onClick={() => setQuantity(q => Math.max(100, q - 100))}
                                                className="px-4 py-2 text-[#1a4731] hover:bg-green-50 transition-colors font-bold"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="px-3 py-2 text-base font-medium text-gray-800 min-w-[100px] text-center">
                                                {quantity} liter
                                            </span>
                                            <button
                                                onClick={() => setQuantity(q => q + 100)}
                                                className="px-4 py-2 text-[#1a4731] hover:bg-green-50 transition-colors font-bold"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-lg">Price</span>
                                        <span className="text-[#0E3B1F] font-bold text-lg">{product.price}/{product.priceUnit}</span>
                                    </div>

                                    <div className="space-y-3 pt-1">
                                        <button className="w-full bg-[#1a2e22] text-white py-3.5 rounded-xl font-semibold text-base hover:bg-[#2d5a45] transition-colors">
                                            Continue To Payment
                                        </button>
                                        <button
                                            onClick={() => setShowOrderSummary(false)}
                                            className="w-full border border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-50 transition-colors"
                                        >
                                            Back To Marketplace
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
