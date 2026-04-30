"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, ShieldCheck, Truck, X, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { CONFIG } from '@/lib/config';

const API_BASE = CONFIG.API_URL + '/marketplace';

interface Listing {
    id: number;
    name: string;
    company: string;
    seller_name: string;
    pol_type: string;
    price: string;
    price_unit: string;
    brand: string;
    batch_number: string;
    expiry: string | null;
    shelf_life: string;
    description: string;
    location: string;
    rating: string | null;
}

const typeBgColors: Record<string, string> = { petroleum: 'bg-blue-600', oil: 'bg-amber-600', lubricant: 'bg-purple-600', other: 'bg-gray-600' };

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = React.use(params);
    const [product, setProduct] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(true);
    const [showOrderSummary, setShowOrderSummary] = useState(false);
    const [quantity, setQuantity] = useState(1000);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

    const handleCheckout = async () => {
        if (!product) return;
        setCheckoutLoading(true);
        try {
            const token = localStorage.getItem('access_token');
            const res = await fetch(`${API_BASE}/checkout/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ listing_id: product.id, quantity: quantity })
            });
            const data = await res.json();
            if (res.ok && data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                console.error('Checkout failed', data);
                alert(data.error || 'Checkout failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Something went wrong during checkout.');
        } finally {
            setCheckoutLoading(false);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const res = await fetch(`${API_BASE}/listings/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) setProduct(await res.json());
            } catch { console.error('Failed to fetch product'); }
            finally { setLoading(false); }
        };
        fetchProduct();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
    if (!product) return (
        <div className="p-8 text-center text-gray-500">
            <h2 className="text-xl font-bold mb-4">Product Not Found</h2>
            <Link href="/marketplace" className="text-[#0E3B1F] hover:underline">Return to Marketplace</Link>
        </div>
    );

    const typeBg = typeBgColors[product.pol_type] || 'bg-gray-600';

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <Link href="/marketplace" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Marketplace
            </Link>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-[#1a2e22] to-[#2d5a45] p-8 text-white relative">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`${typeBg} text-white text-xs px-3 py-1 rounded-full font-medium`}>{product.pol_type.charAt(0).toUpperCase() + product.pol_type.slice(1)}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold mb-1">{product.name}</h1>
                            <p className="text-white/80">by {product.seller_name || product.company}</p>
                        </div>
                        <div className="text-left md:text-right bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 w-full md:w-auto">
                            <p className="text-sm text-white/70 mb-1">Price per {product.price_unit}</p>
                            <p className="text-3xl font-bold text-white mb-2">${product.price}</p>
                            <button onClick={() => setShowOrderSummary(true)} className="w-full bg-[#FCD34D] text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-[#F59E0B] transition-colors shadow-lg">
                                Proceed to Buy
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
                        </section>
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShieldCheck className="h-5 w-5" /></div>
                                <div><h4 className="font-semibold text-gray-900">Verified Supplier</h4><p className="text-sm text-gray-500">Identity and license verified by Start POL</p></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3">
                                <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Truck className="h-5 w-5" /></div>
                                <div><h4 className="font-semibold text-gray-900">Fast Delivery</h4><p className="text-sm text-gray-500">Available for next-day shipping in your region</p></div>
                            </div>
                        </section>
                    </div>
                    <div className="space-y-6">
                        <div className="border border-gray-200 rounded-xl p-5">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Location</h3>
                            <div className="flex items-center gap-3 text-gray-700 bg-gray-50 p-3 rounded-lg mb-4">
                                <MapPin className="h-5 w-5 text-[#0E3B1F]" /> <span className="font-medium">{product.location}</span>
                            </div>
                            <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">Map Preview</div>
                        </div>
                    </div>
                </div>
            </div>

            {showOrderSummary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative">
                        <button onClick={() => setShowOrderSummary(false)} className="absolute top-5 right-5 w-9 h-9 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 z-10"><X className="w-5 h-5" /></button>
                        <div className="p-8">
                            <div className="inline-flex items-center bg-[#1a4731] text-white text-sm font-semibold px-5 py-2 rounded-full mb-6">Order Summary</div>
                            <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                            <p className="text-base text-gray-500 mb-1">( {product.pol_type.charAt(0).toUpperCase() + product.pol_type.slice(1)} )</p>
                            <div className="flex items-center gap-1.5 text-base text-gray-500 mb-6"><MapPin className="h-5 w-5 text-[#0E3B1F]" /> {product.location}</div>
                            <div className="grid grid-cols-2 gap-6 border-t border-gray-100 pt-5">
                                <div className="space-y-4">
                                    <div><span className="text-gray-500 text-sm">Brand</span><p className="text-[#0E3B1F] font-semibold text-base mt-0.5">{product.brand || '-'}</p></div>
                                    {product.batch_number && <div><span className="text-gray-500 text-sm">Batch</span><p className="text-gray-800 font-medium text-base mt-0.5">{product.batch_number}</p></div>}
                                    {product.expiry && <div><span className="text-gray-500 text-sm">Expiry</span><p className="text-gray-800 font-medium text-base mt-0.5">{product.expiry}</p></div>}
                                    {product.shelf_life && <div><span className="text-gray-500 text-sm">Shelf Life</span><p className="text-gray-800 font-medium text-base mt-0.5">{product.shelf_life}</p></div>}
                                </div>
                                <div className="space-y-5">
                                    <div>
                                        <span className="text-gray-500 text-sm mb-2 block">Quantity</span>
                                        <div className="flex items-center gap-2 border border-[#1a4731] rounded-lg overflow-hidden w-fit">
                                            <button onClick={() => setQuantity(q => Math.max(100, q - 100))} className="px-4 py-2 text-[#1a4731] hover:bg-green-50 font-bold"><Minus className="w-4 h-4" /></button>
                                            <span className="px-3 py-2 text-base font-medium text-gray-800 min-w-[100px] text-center">{quantity} {product.price_unit || 'liter'}</span>
                                            <button onClick={() => setQuantity(q => q + 100)} className="px-4 py-2 text-[#1a4731] hover:bg-green-50 font-bold"><Plus className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-lg">Price</span>
                                        <span className="text-[#0E3B1F] font-bold text-lg">${product.price}/{product.price_unit}</span>
                                    </div>
                                    <div className="space-y-3 pt-1">
                                        <button 
                                            onClick={handleCheckout} 
                                            disabled={checkoutLoading}
                                            className="w-full bg-[#1a2e22] text-white py-3.5 rounded-xl font-semibold text-base hover:bg-[#2d5a45] disabled:opacity-50 disabled:cursor-not-allowed">
                                            {checkoutLoading ? 'Processing...' : 'Continue To Payment'}
                                        </button>
                                        <button onClick={() => setShowOrderSummary(false)} className="w-full border border-gray-300 text-gray-700 py-3.5 rounded-xl font-semibold text-base hover:bg-gray-50">Back To Marketplace</button>
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
