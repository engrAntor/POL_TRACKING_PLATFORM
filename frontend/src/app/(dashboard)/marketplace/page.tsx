"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MapPin, Filter, ChevronDown, Sparkles, X, Send, MessageSquareText, Minus, Plus } from 'lucide-react';

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

    // Order Summary state
    const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
    const [orderQty, setOrderQty] = useState(1000);

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am Marie. How can I help you today? You can ask me to add inventory or find products in the marketplace.", sender: 'ai' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { id: prev.length + 1, text: chatInput, sender: 'user' }]);
        setChatInput('');
    };

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
                            <button
                                onClick={() => { setSelectedProduct(product); setOrderQty(1000); }}
                                className="block w-full text-center bg-[#0E3B1F] text-white py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors shadow-lg shadow-green-900/10"
                            >
                                Purchase Now
                            </button>
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

            {/* Order Summary Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="p-6">
                            <div className="inline-flex items-center bg-[#1a4731] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
                                Order Summary
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 leading-tight">{selectedProduct.name}</h2>
                            <p className="text-sm text-gray-500 mb-1">( {selectedProduct.type} )</p>
                            <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
                                <MapPin className="h-4 w-4 text-[#F97316]" />
                                {selectedProduct.location}
                            </div>
                            <div className="border-t border-gray-100 pt-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">Brand</span>
                                    <span className="text-[#F97316] font-semibold">Shell</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-900">Quantity</span>
                                    <div className="flex items-center border border-[#1a4731] rounded-lg overflow-hidden">
                                        <button onClick={() => setOrderQty(q => Math.max(100, q - 100))} className="px-3 py-1.5 text-[#1a4731] hover:bg-green-50 transition-colors">
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <span className="px-3 py-1.5 text-sm font-medium text-gray-800 min-w-[90px] text-center">{orderQty} liter</span>
                                        <button onClick={() => setOrderQty(q => q + 100)} className="px-3 py-1.5 text-[#1a4731] hover:bg-green-50 transition-colors">
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Batch :</span><span className="text-gray-800">B- 001122</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Expiry :</span><span className="text-gray-800">12 Sept 2027</span></div>
                                <div className="flex justify-between text-sm"><span className="text-gray-500">Shelf Life :</span><span className="text-gray-800">5 Years</span></div>
                            </div>
                            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center mb-6">
                                <span className="font-bold text-gray-900">Price</span>
                                <span className="text-[#F97316] font-bold">{selectedProduct.price}/Liter</span>
                            </div>
                            <div className="space-y-3">
                                <button className="w-full bg-[#1a2e22] text-white py-3 rounded-xl font-semibold hover:bg-[#2d5a45] transition-colors">
                                    Continue To Payment
                                </button>
                                <button onClick={() => setSelectedProduct(null)} className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                                    Back To Marketplace
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {/* Chat Panel */}
                {isChatOpen && (
                    <div className="mb-4 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
                        {/* Header */}
                        <div className="bg-[#1a2e22] px-4 py-3 flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#0d1a10] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/40 border border-green-900/30">
                                <Sparkles className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-base leading-none mb-1">Ask Marie</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-gray-400 text-xs">Always Active</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span>
                                    <span className="text-gray-400 text-xs">v2.5</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsChatOpen(false)}
                                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-3">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                        msg.sender === 'user'
                                            ? 'bg-[#1a2e22] text-white rounded-br-sm'
                                            : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200" />

                        {/* Input Area */}
                        <div className="p-4 bg-white">
                            <div className="flex items-center gap-2 bg-[#e6f4ec] rounded-xl px-4 py-3 border border-green-100">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Ask anything"
                                    className="flex-1 bg-transparent text-gray-600 placeholder-gray-400 text-sm focus:outline-none"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1a2e22] transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Floating Chat Button */}
                <div className="w-16 h-16 rounded-full bg-[#b7e4c7]/50 flex items-center justify-center">
                    <button
                        onClick={() => setIsChatOpen(!isChatOpen)}
                        className="w-12 h-12 bg-[#d8f3dc] rounded-full flex items-center justify-center shadow-sm hover:bg-[#c2ebd0] transition-colors"
                    >
                        <MessageSquareText className="w-6 h-6 text-[#2d6a4f]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
