"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Filter, ChevronDown, Sparkles, X, Send, MessageSquareText, Minus, Plus, Upload, FileText, Download } from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000/api/marketplace';

interface Listing {
    id: number;
    seller_name: string;
    name: string;
    company: string;
    pol_type: string;
    price: string | null;
    price_unit: string;
    description: string;
    location: string;
    brand: string;
    batch_number: string;
    expiry: string | null;
    shelf_life: string;
    quantity: string;
    quantity_unit: string;
    rating: string | null;
    sds_file_url: string | null;
    category: string;
    status: string;
    is_inventory?: boolean;
    _tab?: 'buy' | 'sell';
}

const typeBgColors: Record<string, string> = {
    petroleum: 'bg-blue-600',
    oil: 'bg-amber-600',
    lubricant: 'bg-purple-600',
    other: 'bg-gray-600',
};

export default function MarketplacePage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [myListings, setMyListings] = useState<Listing[]>([]);
    const [myInventory, setMyInventory] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [polType, setPolType] = useState('');
    const [quantity, setQuantity] = useState('1000');
    const [location, setLocation] = useState('');
    const [listingType, setListingType] = useState('all');

    const [selectedProduct, setSelectedProduct] = useState<Listing | null>(null);
    const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

    // Sell form state
    const [sellPrice, setSellPrice] = useState('');
    const [sellQuantity, setSellQuantity] = useState('');
    const [sellLocation, setSellLocation] = useState('');
    const [sellDescription, setSellDescription] = useState('');
    const [sellPolType, setSellPolType] = useState('petroleum');
    const [sellLoading, setSellLoading] = useState(false);
    const [sellSdsFile, setSellSdsFile] = useState<File | null>(null);

    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! I am Lilian. How can I help you today? You can ask me to add inventory or find products in the marketplace.", sender: 'ai' }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const getToken = () => localStorage.getItem('access_token');

    const fetchListings = useCallback(async () => {
        try {
            const headers = { Authorization: `Bearer ${getToken()}` };
            const params = new URLSearchParams();
            if (polType) params.append('pol_type', polType);
            if (location) params.append('location', location);

            const [allRes, myRes, invRes] = await Promise.all([
                fetch(`${API_BASE}/listings/?${params}`, { headers }),
                fetch(`${API_BASE}/listings/my/`, { headers }),
                fetch(`${API_BASE}/listings/inventory/`, { headers }),
            ]);

            if (allRes.ok) {
                const data = await allRes.json();
                setListings(Array.isArray(data) ? data : data.results || []);
            }
            if (myRes.ok) {
                const data = await myRes.json();
                setMyListings(Array.isArray(data) ? data : data.results || []);
            }
            if (invRes.ok) {
                const data = await invRes.json();
                setMyInventory(Array.isArray(data) ? data : data.results || []);
            }
        } catch {
            console.error('Failed to fetch listings');
        } finally {
            setLoading(false);
        }
    }, [polType, location]);

    useEffect(() => { fetchListings(); }, [fetchListings]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const sendMessage = () => {
        if (!chatInput.trim()) return;
        setMessages(prev => [...prev, { id: prev.length + 1, text: chatInput, sender: 'user' }]);
        setChatInput('');
    };

    const handleSearch = () => { setLoading(true); fetchListings(); };

    const handleRemoveListing = async (id: number) => {
        try {
            await fetch(`${API_BASE}/listings/${id}/remove/`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${getToken()}`, 'Content-Type': 'application/json' },
            });
            fetchListings();
        } catch { console.error('Failed to remove listing'); }
    };

    const [orderLoading, setOrderLoading] = useState(false);

    const handlePlaceOrder = async () => {
        if (!selectedProduct) return;
        setOrderLoading(true);
        try {
            const res = await fetch(`${API_BASE}/checkout/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    listing_id: selectedProduct.id,
                    quantity: 1,
                }),
            });
            const data = await res.json();
            if (res.ok && data.checkout_url) {
                window.location.href = data.checkout_url;
            } else {
                setOrderSuccess(data.error || 'Failed to start checkout.');
            }
        } catch {
            setOrderSuccess('Network error. Please try again.');
        } finally {
            setOrderLoading(false);
        }
    };

    const openSellModal = (product: Listing) => {
        setSelectedProduct(product);
        setOrderSuccess(null);
        setSellSdsFile(null);
        if (product.is_inventory) {
            setSellPrice('');
            setSellQuantity(product.quantity || '');
            setSellLocation('');
            setSellDescription('');
            setSellPolType('petroleum');
        } else {
            // Pre-fill with existing listing data for edit
            setSellPrice(product.price || '');
            setSellQuantity(product.quantity || '');
            setSellLocation(product.location || '');
            setSellDescription(product.description || '');
            setSellPolType(product.pol_type || 'petroleum');
        }
    };

    const handleSellListing = async () => {
        if (!selectedProduct || !sellPrice) return;
        setSellLoading(true);
        try {
            let res;
            if (selectedProduct.is_inventory) {
                // Create new listing from inventory (FormData for file upload)
                const formData = new FormData();
                formData.append('pol_item_id', String(selectedProduct.id));
                formData.append('price', sellPrice);
                formData.append('quantity', sellQuantity);
                formData.append('description', sellDescription);
                formData.append('location', sellLocation);
                formData.append('pol_type', sellPolType);
                if (sellSdsFile) formData.append('sds_file', sellSdsFile);
                res = await fetch(`${API_BASE}/listings/sell/`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${getToken()}` },
                    body: formData,
                });
            } else {
                // Update existing listing (FormData for file upload)
                const formData = new FormData();
                formData.append('price', sellPrice);
                formData.append('quantity', sellQuantity);
                formData.append('description', sellDescription);
                formData.append('location', sellLocation);
                formData.append('pol_type', sellPolType);
                if (sellSdsFile) formData.append('sds_file', sellSdsFile);
                res = await fetch(`${API_BASE}/listings/${selectedProduct.id}/update/`, {
                    method: 'PATCH',
                    headers: { Authorization: `Bearer ${getToken()}` },
                    body: formData,
                });
            }
            if (res.ok) {
                setOrderSuccess(selectedProduct.is_inventory ? 'Product listed successfully!' : 'Listing updated!');
                setTimeout(() => { setSelectedProduct(null); setOrderSuccess(null); setSellPrice(''); setSellLocation(''); setSellDescription(''); setSellSdsFile(null); fetchListings(); }, 2000);
            } else {
                const data = await res.json();
                setOrderSuccess(data.error || 'Failed.');
            }
        } catch {
            setOrderSuccess('Network error.');
        } finally {
            setSellLoading(false);
        }
    };

    const buyListings: Listing[] = listings.map(l => ({ ...l, _tab: 'buy' as const }));
    const sellListings: Listing[] = [
        ...myListings.map(l => ({ ...l, _tab: 'sell' as const })),
        ...myInventory.map(l => ({ ...l, _tab: 'sell' as const })),
    ];
    const allProducts = listingType === 'buy' ? buyListings : listingType === 'sell' ? sellListings : [...buyListings, ...sellListings];
    const allLocations = Array.from(new Set([...listings, ...myListings, ...myInventory].map(l => l.location).filter(Boolean)));

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-[#1a2e22] to-[#2d5a45] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="relative z-10">
                    <h2 className="text-3xl font-bold mb-2">Smart POL Marketplace</h2>
                    <p className="text-white/70 text-sm mb-8 max-w-2xl">Browse global listings or manage your own inventory. AI-driven matching for best prices.</p>
                    <div className="bg-[#1f3b2e]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 flex flex-col lg:flex-row lg:items-end gap-6">
                        <div className="w-full lg:flex-1">
                            <label className="block text-sm text-white font-medium mb-2">POL Type</label>
                            <div className="relative">
                                <select value={polType} onChange={(e) => setPolType(e.target.value)} className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 pr-10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 border border-white/5">
                                    <option value="" className="text-gray-900">All Types</option>
                                    <option value="petroleum" className="text-gray-900">Petroleum</option>
                                    <option value="oil" className="text-gray-900">Oil</option>
                                    <option value="lubricant" className="text-gray-900">Lubricant</option>
                                    <option value="other" className="text-gray-900">Other</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                            </div>
                        </div>
                        <div className="hidden lg:block w-px h-12 bg-white/10 mb-1"></div>
                        <div className="w-full lg:flex-1">
                            <label className="block text-sm text-white font-medium mb-2">Quantity</label>
                            <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-1 focus:ring-green-500 border border-white/5" />
                        </div>
                        <div className="hidden lg:block w-px h-12 bg-white/10 mb-1"></div>
                        <div className="w-full lg:flex-1">
                            <label className="block text-sm text-white font-medium mb-2">Location</label>
                            <div className="relative">
                                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-[#152e22] hover:bg-[#1a382a] transition-colors rounded-lg px-4 py-3 pr-10 text-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-green-500 border border-white/5">
                                    <option value="" className="text-gray-900">Any location</option>
                                    {allLocations.map(loc => <option key={loc} value={loc} className="text-gray-900">{loc}</option>)}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white pointer-events-none" />
                            </div>
                        </div>
                        <button onClick={handleSearch} className="w-full lg:w-auto bg-[#FCD34D] hover:bg-[#F59E0B] text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors whitespace-nowrap shadow-lg shadow-yellow-500/20">Search Market</button>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="flex items-center gap-4 py-2 overflow-x-auto">
                <button className="flex items-center gap-2 bg-[#0E3B1F] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors shadow-sm whitespace-nowrap">
                    <Filter className="h-4 w-4" /> Filter
                </button>
                <div className="relative group">
                    <select value={listingType} onChange={(e) => setListingType(e.target.value)} className="appearance-none bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 min-w-[140px] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0E3B1F]/20">
                        <option value="all">All Listings</option>
                        <option value="buy">Buy Only</option>
                        <option value="sell">My Listings</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Product Cards */}
            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading listings...</div>
            ) : allProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No listings found.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allProducts.map((product) => (
                        <div key={`${product._tab}-${product.id}`} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                                    <p className="text-xs text-gray-400">{product._tab === 'buy' ? `by ${product.seller_name || product.company}` : `Qty: ${parseFloat(product.quantity) % 1 === 0 ? parseInt(product.quantity) : product.quantity} ${product.quantity_unit}`}</p>
                                </div>
                                <span className={`${typeBgColors[product.pol_type] || 'bg-gray-600'} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                                    {product.pol_type.charAt(0).toUpperCase() + product.pol_type.slice(1)}
                                </span>
                            </div>
                            {product.price ? (
                                <div className="border border-gray-100 bg-gray-50/50 rounded-lg p-4 mb-4 flex-1">
                                    <p className="text-2xl font-bold text-[#0E3B1F]">${product.price}</p>
                                    <p className="text-xs text-gray-400 mb-2">Price per {product.price_unit}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                                </div>
                            ) : (
                                <div className="border border-gray-100 bg-gray-50/50 rounded-lg p-4 mb-4 flex-1">
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Inventory Details</p>
                                    <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>
                                </div>
                            )}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin className="h-4 w-4 text-[#0E3B1F]" /> {product.location}
                                </div>
                            </div>
                            {product._tab === 'buy' ? (
                                <button onClick={() => { setSelectedProduct(product); setOrderSuccess(null); }}
                                    className="block w-full text-center bg-[#0E3B1F] text-white py-3 rounded-lg font-medium hover:bg-[#0E3B1F]/90 transition-colors shadow-lg shadow-green-900/10">
                                    Purchase Now
                                </button>
                            ) : product.is_inventory ? (
                                <button onClick={() => openSellModal(product)}
                                    className="block w-full text-center bg-[#0E3B1F] text-white py-3 rounded-lg font-medium hover:bg-[#0B2E18] shadow-lg shadow-green-900/10">
                                    Sell Product
                                </button>
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => openSellModal(product)} className="flex-1 text-center bg-white border border-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50">Edit</button>
                                    <button onClick={() => handleRemoveListing(product.id)} className="flex-1 bg-red-50 text-red-600 py-3 rounded-lg font-medium hover:bg-red-100">Remove</button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Order / Sell Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setSelectedProduct(null); setSellPrice(''); setSellLocation(''); setSellDescription(''); setSellSdsFile(null); }} className="absolute top-4 right-4 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700 z-10"><X className="w-4 h-4" /></button>
                        <div className="p-6">
                            <div className="inline-flex items-center bg-[#1a4731] text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-5">
                                {selectedProduct._tab === 'buy' ? 'Order Summary' : selectedProduct.is_inventory ? 'Sell Product' : 'Edit Listing'}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
                            <p className="text-sm text-gray-500 mb-1">( {selectedProduct.pol_type.charAt(0).toUpperCase() + selectedProduct.pol_type.slice(1)} )</p>

                            {selectedProduct._tab === 'sell' ? (
                                <>
                                    {/* Sell / Edit Form */}
                                    <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Price per unit *</label>
                                            <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="e.g. 2.50" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0E3B1F]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity ({selectedProduct.quantity_unit})</label>
                                            <input type="number" value={sellQuantity} onChange={(e) => setSellQuantity(e.target.value)} placeholder="e.g. 500" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0E3B1F]" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                            <input type="text" value={selectedProduct.expiry || 'N/A'} readOnly className="w-full border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                            <textarea value={sellDescription} onChange={(e) => setSellDescription(e.target.value)} placeholder="Brief description..." rows={2} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0E3B1F] resize-none" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Safety Data Sheet Upload</label>
                                            <label className="flex items-center gap-2 w-full border border-dashed border-gray-300 rounded-lg px-3 py-3 cursor-pointer hover:border-[#0E3B1F] hover:bg-green-50/30 transition-colors">
                                                <Upload className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-500 truncate flex-1">
                                                    {sellSdsFile ? sellSdsFile.name : 'Upload PDF file'}
                                                </span>
                                                <input type="file" accept=".pdf" className="hidden" onChange={(e) => setSellSdsFile(e.target.files?.[0] || null)} />
                                            </label>
                                            {sellSdsFile && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <FileText className="h-3.5 w-3.5 text-green-600" />
                                                    <span className="text-xs text-green-700 truncate">{sellSdsFile.name}</span>
                                                    <button type="button" onClick={() => setSellSdsFile(null)} className="text-xs text-red-500 hover:text-red-700 ml-auto">Remove</button>
                                                </div>
                                            )}
                                            {!sellSdsFile && selectedProduct && !selectedProduct.is_inventory && selectedProduct.sds_file_url && (
                                                <a href={selectedProduct.sds_file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 mt-1 text-xs text-blue-600 hover:text-blue-800">
                                                    <FileText className="h-3.5 w-3.5" /> Current SDS attached
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-5">
                                        {orderSuccess ? (
                                            <div className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-semibold text-center border border-green-200">{orderSuccess}</div>
                                        ) : (
                                            <div className="space-y-3">
                                                <button onClick={handleSellListing} disabled={!sellPrice || sellLoading} className="w-full bg-[#1a2e22] text-white py-3 rounded-xl font-semibold hover:bg-[#2d5a45] disabled:opacity-50">
                                                    {sellLoading ? 'Saving...' : selectedProduct.is_inventory ? 'List for Sale' : 'Update Listing'}
                                                </button>
                                                <button onClick={() => { setSelectedProduct(null); setSellPrice(''); setSellLocation(''); setSellDescription(''); setSellSdsFile(null); }} className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50">Cancel</button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Buy / Order Form */}
                                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5"><MapPin className="h-4 w-4 text-[#0E3B1F]" /> {selectedProduct.location}</div>
                                    <div className="border-t border-gray-100 pt-4 space-y-4">
                                        <div className="flex items-center justify-between"><span className="font-semibold text-gray-900">Brand</span><span className="text-[#0E3B1F] font-semibold">{selectedProduct.brand || selectedProduct.company}</span></div>
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-900">Quantity</span>
                                            <span className="text-[#0E3B1F] font-semibold">{parseFloat(selectedProduct.quantity) % 1 === 0 ? parseInt(selectedProduct.quantity) : selectedProduct.quantity} {selectedProduct.quantity_unit}</span>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-100 mt-4 pt-4 space-y-3">
                                        {selectedProduct.batch_number && <div className="flex justify-between text-sm"><span className="text-gray-500">Batch :</span><span className="text-gray-800">{selectedProduct.batch_number}</span></div>}
                                        {selectedProduct.expiry && <div className="flex justify-between text-sm"><span className="text-gray-500">Expiry :</span><span className="text-gray-800">{selectedProduct.expiry}</span></div>}
                                        {selectedProduct.shelf_life && <div className="flex justify-between text-sm"><span className="text-gray-500">Shelf Life :</span><span className="text-gray-800">{selectedProduct.shelf_life}</span></div>}
                                    </div>
                                    {selectedProduct.sds_file_url && (
                                        <div className="border-t border-gray-100 mt-4 pt-4">
                                            <button onClick={async () => {
                                                const res = await fetch(selectedProduct.sds_file_url!);
                                                const blob = await res.blob();
                                                const url = URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `SDS-${selectedProduct.name}.pdf`;
                                                a.click();
                                                URL.revokeObjectURL(url);
                                            }}
                                                className="flex items-center gap-2 w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0E3B1F] font-medium hover:bg-green-50 transition-colors">
                                                <Download className="h-4 w-4" />
                                                Download Safety Data Sheet
                                            </button>
                                        </div>
                                    )}
                                    <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center mb-6">
                                        <span className="font-bold text-gray-900">Price</span>
                                        <span className="text-[#0E3B1F] font-bold">${selectedProduct.price}/{selectedProduct.price_unit || 'Liter'}</span>
                                    </div>
                                    {orderSuccess ? (
                                        <div className="w-full bg-green-50 text-green-700 py-3 rounded-xl font-semibold text-center border border-green-200">{orderSuccess}</div>
                                    ) : (
                                        <div className="space-y-3">
                                            <button onClick={handlePlaceOrder} disabled={orderLoading} className="w-full bg-[#1a2e22] text-white py-3 rounded-xl font-semibold hover:bg-[#2d5a45] disabled:opacity-50">
                                                {orderLoading ? 'Redirecting to Stripe...' : 'Continue To Payment'}
                                            </button>
                                            <button onClick={() => setSelectedProduct(null)} className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50">Back To Marketplace</button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* AI Chat Widget */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
                {isChatOpen && (
                    <div className="mb-4 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col" style={{ height: '500px' }}>
                        <div className="bg-[#1a2e22] px-4 py-3 flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#0d1a10] rounded-xl flex items-center justify-center shadow-lg shadow-green-900/40 border border-green-900/30"><Sparkles className="w-6 h-6 text-green-400" /></div>
                            <div className="flex-1">
                                <h3 className="text-white font-bold text-base leading-none mb-1">Ask Lilian</h3>
                                <div className="flex items-center gap-1.5"><span className="text-gray-400 text-xs">Always Active</span><span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block"></span><span className="text-gray-400 text-xs">v2.5</span></div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 space-y-3">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-[#1a2e22] text-white rounded-br-sm' : 'bg-white text-gray-800 shadow-sm rounded-tl-sm'}`}>{msg.text}</div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="h-px bg-gray-200" />
                        <div className="p-4 bg-white">
                            <div className="flex items-center gap-2 bg-[#e6f4ec] rounded-xl px-4 py-3 border border-green-100">
                                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} placeholder="Ask anything" className="flex-1 bg-transparent text-gray-600 placeholder-gray-400 text-sm focus:outline-none" />
                                <button onClick={sendMessage} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#1a2e22]"><Send className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="w-16 h-16 rounded-full bg-[#b7e4c7]/50 flex items-center justify-center">
                    <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-12 h-12 bg-[#d8f3dc] rounded-full flex items-center justify-center shadow-sm hover:bg-[#c2ebd0]"><MessageSquareText className="w-6 h-6 text-[#2d6a4f]" /></button>
                </div>
            </div>
        </div>
    );
}
