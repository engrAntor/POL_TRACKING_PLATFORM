"use client";

import { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, Sparkles, X, Send, MessageSquareText } from 'lucide-react';

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

            {/* AI Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
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
                                <button onClick={sendMessage} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1a2e22] transition-colors">
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
