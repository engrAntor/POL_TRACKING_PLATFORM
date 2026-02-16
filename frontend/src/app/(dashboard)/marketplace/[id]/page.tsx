"use client";

import React from 'react';
import { ChevronLeft, MapPin, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

// Mock data (duplicated for prototype simplicity)
const allProducts = [
    {
        id: 1,
        name: 'Premium Diesel B7',
        company: 'by Global Fuels Ltd',
        type: 'Petroleum',
        typeBg: 'bg-blue-600',
        price: '$1.45',
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
                            <h1 className="text-3xl font-bold mb-1">{product.name}</h1>
                            <p className="text-white/80">{product.company}</p>
                        </div>
                        <div className="text-right bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
                            <p className="text-sm text-white/70 mb-1">Price per unit</p>
                            <p className="text-3xl font-bold text-white mb-2">{product.price}</p>
                            <button className="w-full bg-[#FCD34D] text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-[#F59E0B] transition-colors shadow-lg">
                                Proceed to Buy
                            </button>
                        </div>
                    </div>
                    {/* Background decoration */}
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
                                <MapPin className="h-5 w-5 text-[#F97316]" />
                                <span className="font-medium">{product.location}</span>
                            </div>
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                                Map Preview
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
