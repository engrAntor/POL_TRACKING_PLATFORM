"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown, Sparkles, X, Send, MessageSquareText } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/dashboard';

interface InventoryItem {
    id: number;
    product_name: string;
    part_number: string;
    shelf_life: string;
    expiry: string;
    expiry_status: string;
    status: string;
    quantity: string;
    price_per_unit: string;
}

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterExpiry, setFilterExpiry] = useState('');

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am Marie. How can I help you today? You can ask me to add inventory or find products in the marketplace.", sender: 'ai' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const getToken = () => localStorage.getItem('access_token');

    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 400);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const fetchInventory = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (debouncedSearch) params.append('search', debouncedSearch);
            if (filterStatus) params.append('status', filterStatus);
            if (filterExpiry) params.append('expiry_status', filterExpiry);
            const res = await fetch(`${API_BASE}/inventory/?${params}`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setItems(Array.isArray(data) ? data : data.results || []);
            }
        } catch {
            console.error('Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    }, [debouncedSearch, filterStatus, filterExpiry]);

    useEffect(() => { fetchInventory(); }, [fetchInventory]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { id: prev.length + 1, text: chatInput, sender: 'user' }]);
        setChatInput('');
    };

    const statusBadge = (s: string) => {
        if (s === 'healthy') return 'bg-[#65a30d] text-white';
        if (s === 'expired') return 'bg-red-500 text-white';
        if (s === 'low_stock') return 'bg-yellow-500 text-white';
        return 'bg-gray-300 text-gray-700';
    };

    const statusLabel = (s: string) => {
        if (s === 'low_stock') return 'Low Stock';
        return s.charAt(0).toUpperCase() + s.slice(1);
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

                <div className="relative">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="appearance-none flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors min-w-[120px] cursor-pointer pr-8"
                    >
                        <option value="">All Status</option>
                        <option value="healthy">Healthy</option>
                        <option value="expired">Expired</option>
                        <option value="low_stock">Low Stock</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={filterExpiry}
                        onChange={(e) => setFilterExpiry(e.target.value)}
                        className="appearance-none flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors min-w-[140px] cursor-pointer pr-8"
                    >
                        <option value="">All Expiry</option>
                        <option value="active">Active</option>
                        <option value="near_expiry">Near Expiry</option>
                        <option value="expired">Expired</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto shadow-sm">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No inventory items found.</div>
                ) : (
                    <table className="w-full min-w-[900px]">
                        <thead>
                            <tr className="border-b border-gray-200 bg-white">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Product Name</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Part Number</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Shelf Life</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Expiry</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Qty</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.product_name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.part_number}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{item.shelf_life}</td>
                                    <td className="px-6 py-4 text-sm text-red-500 font-medium">{item.expiry}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{parseFloat(item.quantity) % 1 === 0 ? parseInt(item.quantity) : item.quantity}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${statusBadge(item.status)}`}>
                                            {statusLabel(item.status)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* AI Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {isChatOpen && (
                    <div className="mb-4 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
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
                            <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-3">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-[#1a2e22] text-white rounded-br-sm' : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="p-4 bg-white">
                            <div className="flex items-center gap-2 bg-[#e6f4ec] rounded-xl px-4 py-3 border border-green-100">
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask anything" className="flex-1 bg-transparent text-gray-600 placeholder-gray-400 text-sm focus:outline-none" />
                                <button onClick={sendMessage} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1a2e22] transition-colors">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-16 h-16 rounded-full bg-[#b7e4c7]/50 flex items-center justify-center">
                    <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-12 h-12 bg-[#d8f3dc] rounded-full flex items-center justify-center shadow-sm hover:bg-[#c2ebd0] transition-colors">
                        <MessageSquareText className="w-6 h-6 text-[#2d6a4f]" />
                    </button>
                </div>
            </div>
        </div>
    );
}
