"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';
import { Search, Sparkles, X, Send, MessageSquareText, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/dashboard';

interface InventoryItem {
    id: number;
    part_number: string;
    description: string;
    pol_type: string;
    uom: string;
    quantity: string;
    shelf_life: string;
    expiry: string;
    expiry_status: string;
    condition: string;
    price_per_unit: string;
    status: string;
    // Optional
    product_name: string;
    alt_part_number: string;
    manufacturer_part_number: string;
    mil_spec: string;
    serial_number: string;
    batch_number: string;
    source: string;
    balance: string;
    notes: string;
    image: string | null;
    msds_file: string | null;
    created_at: string;
    updated_at: string;
}

const typeLabels: Record<string, string> = {
    petroleum: 'Petroleum', oil: 'Oil', lubricant: 'Lubricant',
};

const conditionLabels: Record<string, string> = {
    new_pol: 'New POL', leftover_pol: 'Leftover POL', opened_pol: 'Opened POL',
};

const uomLabels: Record<string, string> = {
    QT: 'Quart', OZ: 'Ounce', LB: 'Pound', RL: 'Roll', EA: 'Each',
    GAL: 'Gallon', ML: 'Millilitre', PT: 'Pint', KT: 'Kit',
    GM: 'Gram', FT: 'Feet', 'SQ ST': 'Square Feet', YD: 'Yard', CC: 'Cubic Centimeter',
};

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Chat state
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am Lilian. How can I help you manage your inventory today? You can ask me to track items or find expiries.", sender: 'ai' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const getToken = () => localStorage.getItem('access_token');

    const refreshAccessToken = async (): Promise<string | null> => {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) return null;
        try {
            const res = await fetch('http://127.0.0.1:8000/api/accounts/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh }),
            });
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('access_token', data.access);
                return data.access;
            }
        } catch { /* ignore */ }
        return null;
    };

    const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
        const headers: Record<string, string> = { ...(options.headers as Record<string, string> || {}) };
        headers['Authorization'] = `Bearer ${getToken()}`;
        let res = await fetch(url, { ...options, headers });
        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (newToken) {
                headers['Authorization'] = `Bearer ${newToken}`;
                res = await fetch(url, { ...options, headers });
            }
        }
        return res;
    };

    const fetchInventory = useCallback(async () => {
        try {
            const res = await authFetch(`${API_BASE}/inventory/`);
            if (res.ok) {
                const data = await res.json();
                setItems(Array.isArray(data) ? data : data.results || []);
            }
        } catch {
            console.error('Failed to fetch inventory');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchInventory(); }, [fetchInventory]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!chatInput.trim()) return;
        const userMsg = chatInput;
        setMessages(prev => [...prev, { id: prev.length + 1, text: userMsg, sender: 'user' }]);
        setChatInput('');

        try {
            const aiBaseUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://127.0.0.1:8001';
            const res = await fetchWithAuth(`${aiBaseUrl}/api/ai/chat/`, {
                method: 'POST',
                body: JSON.stringify({ query: userMsg }),
            });
            
            if (res.status === 429) {
                setMessages(prev => [...prev, { id: prev.length + 1, text: 'Rate limit reached. Please wait a minute.', sender: 'ai' }]);
                return;
            }

            const data = await res.json();
            if (data.success && data.message) {
                setMessages(prev => [...prev, { id: prev.length + 1, text: data.message, sender: 'ai' }]);
            } else {
                setMessages(prev => [...prev, { id: prev.length + 1, text: 'Sorry, I encountered an error processing that request.', sender: 'ai' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { id: prev.length + 1, text: 'Sorry, I am unable to connect to the server right now.', sender: 'ai' }]);
        }
    };

    const filteredItems = items.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
            item.part_number.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            (item.product_name || '').toLowerCase().includes(q)
        );
    });

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
    const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const conditionBadge = (s: string) => {
        const c: Record<string, string> = { new_pol: 'bg-blue-100 text-blue-700', leftover_pol: 'bg-yellow-100 text-yellow-700', opened_pol: 'bg-orange-100 text-orange-700' };
        return c[s] || 'bg-gray-100 text-gray-700';
    };

    return (
        <div className="space-y-6">
            {/* Search Bar */}
            <div className="relative w-full max-w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : filteredItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No inventory items found.</div>
                ) : (
                    <table className="w-full min-w-[2000px]">
                        <thead>
                            <tr className="border-b border-gray-200">
                                {/* Required columns */}
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Image</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Part Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Description</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Type</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">UOM</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Stock</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Shelf Life</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Expiry</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Condition</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Price</th>
                                {/* Optional columns */}
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Product Name</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Alt Part Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Mfr Part Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">MIL Spec</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Serial Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Batch Number</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Source</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Balance</th>
                                <th className="text-left px-4 py-4 text-sm font-semibold text-gray-900 whitespace-nowrap">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedItems.map((item) => (
                                <tr key={item.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
                                    {/* Required columns */}
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {item.image ? (
                                            <img src={item.image} alt={item.product_name || item.part_number} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <ImageIcon className="w-4 h-4 text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{item.part_number}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] truncate">{item.description}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{typeLabels[item.pol_type] || item.pol_type}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{uomLabels[item.uom] || item.uom}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{parseFloat(item.quantity) % 1 === 0 ? parseInt(item.quantity) : item.quantity}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.shelf_life}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.expiry}</td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${conditionBadge(item.condition)}`}>
                                            {conditionLabels[item.condition] || item.condition}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">${item.price_per_unit}</td>
                                    {/* Optional columns */}
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.product_name || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.alt_part_number || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.manufacturer_part_number || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.mil_spec || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.serial_number || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.batch_number || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.source || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 whitespace-nowrap">{item.balance || ''}</td>
                                    <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] truncate">{item.notes || ''}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {filteredItems.length > itemsPerPage && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                        Showing {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredItems.length)} of {filteredItems.length}
                    </p>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1.5 text-sm rounded-lg border ${page === currentPage ? 'bg-[#0E3B1F] text-white border-[#0E3B1F]' : 'border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                                {page}
                            </button>
                        ))}
                        <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* AI Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {isChatOpen && (
                    <div className="mb-4 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
                        <div className="bg-[#1a2e22] px-4 py-3 flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#0d1a10] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/40 border border-green-900/30">
                                <Sparkles className="w-6 h-6 text-green-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-base leading-none mb-1">Ask Lilian</h3>
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
