"use client";

import { useState, useEffect, useCallback } from 'react';
import { Package, Clock, TrendingDown, RefreshCw, AlertTriangle, AlertCircle, XCircle, ChevronRight } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface StockLevel {
    status: string;
    total_qty: number;
}

interface RecentOrder {
    id: number;
    product_name: string;
    quantity: string;
    status: string;
    updated_at: string;
}

interface OverviewData {
    total_pol_items: number;
    near_expiry: number;
    low_stock: number;
    active_transactions: number;
    stock_levels: StockLevel[];
    recent_orders: RecentOrder[];
}

interface POLItem {
    id: number;
    product_name: string;
    status: string;
    quantity: string;
    expiry_status: string;
}

const statusColors: Record<string, string> = {
    healthy: 'bg-[#65a30d]',
    low_stock: 'bg-yellow-500',
    expired: 'bg-red-500',
};

const statusLabels: Record<string, string> = {
    healthy: 'Healthy',
    low_stock: 'Low Stock',
    expired: 'Expired',
};

export default function OverviewPage() {
    const [data, setData] = useState<OverviewData | null>(null);
    const [alerts, setAlerts] = useState<POLItem[]>([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem('access_token');

    const fetchData = useCallback(async () => {
        try {
            const headers = { Authorization: `Bearer ${getToken()}` };
            const [overviewRes, trackerRes] = await Promise.all([
                fetch(`${API_BASE}/dashboard/overview/`, { headers }),
                fetch(`${API_BASE}/dashboard/tracker/`, { headers }),
            ]);

            if (overviewRes.ok) {
                const overview = await overviewRes.json();
                setData(overview);
            }

            if (trackerRes.ok) {
                const items = await trackerRes.json();
                const arr = Array.isArray(items) ? items : items.results || [];
                // Get items that are low_stock or expired
                const alertItems = arr.filter((i: POLItem) =>
                    i.status === 'low_stock' || i.status === 'expired' || i.expiry_status === 'expired' || i.expiry_status === 'near_expiry'
                );
                setAlerts(alertItems.slice(0, 6));
            }
        } catch {
            console.error('Failed to fetch overview data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    }

    const statsCards = [
        { title: 'Total POL Items', value: data?.total_pol_items ?? 0, icon: Package, bgColor: 'bg-green-50', iconColor: 'text-[#0E3B1F]' },
        { title: 'Near Expiry', value: data?.near_expiry ?? 0, icon: Clock, bgColor: 'bg-blue-50', iconColor: 'text-blue-500' },
        { title: 'Low Stock', value: data?.low_stock ?? 0, icon: TrendingDown, bgColor: 'bg-yellow-50', iconColor: 'text-yellow-600' },
        { title: 'Active Transaction', value: data?.active_transactions ?? 0, icon: RefreshCw, bgColor: 'bg-green-50', iconColor: 'text-green-500' },
    ];

    const stockData = (data?.stock_levels || []).map(s => ({
        name: statusLabels[s.status] || s.status,
        value: Number(s.total_qty) || 0,
        color: statusColors[s.status] || 'bg-gray-400',
    }));

    const maxValue = Math.max(...stockData.map(s => s.value), 1);

    const recentOrders = data?.recent_orders || [];

    const getAlertInfo = (item: POLItem) => {
        if (item.status === 'expired' || item.expiry_status === 'expired') {
            return { icon: XCircle, iconColor: 'text-red-600', title: 'Expired', description: `${item.product_name} has expired.` };
        }
        if (item.expiry_status === 'near_expiry') {
            return { icon: AlertCircle, iconColor: 'text-red-500', title: 'Near Expiry', description: `${item.product_name} is nearing expiry date.` };
        }
        if (item.status === 'low_stock') {
            return { icon: AlertTriangle, iconColor: 'text-yellow-500', title: 'Low Stock', description: `${item.product_name} stock is running low. Replenishment may be required.` };
        }
        return { icon: AlertTriangle, iconColor: 'text-gray-500', title: 'Alert', description: item.product_name };
    };

    const formatTime = (iso: string) => {
        const diff = Date.now() - new Date(iso).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just Now';
        if (mins < 60) return `${mins} min ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                                <p className="text-3xl font-semibold text-gray-900">{card.value}</p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.bgColor}`}>
                                <Icon className={`h-6 w-6 ${card.iconColor}`} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts and Alerts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Stock Levels Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-gray-900">Stock Levels by Status</h2>
                        <a href="/inventory" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Manage Inventory <span>↗</span>
                        </a>
                    </div>

                    {stockData.length === 0 ? (
                        <div className="h-[300px] flex items-center justify-center text-gray-400">No stock data available</div>
                    ) : (
                        <div className="relative h-[300px]">
                            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400">
                                <span>{maxValue}</span>
                                <span>{Math.round(maxValue * 0.75)}</span>
                                <span>{Math.round(maxValue * 0.5)}</span>
                                <span>{Math.round(maxValue * 0.25)}</span>
                                <span>0</span>
                            </div>
                            <div className="ml-12 h-full flex items-end justify-around pb-8 border-l border-b border-gray-200 border-dashed">
                                {stockData.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center gap-3">
                                        <div
                                            className={`w-16 ${item.color} rounded-t-lg transition-all hover:opacity-80`}
                                            style={{ height: `${(item.value / maxValue) * 220}px` }}
                                        />
                                        <span className="text-xs text-gray-600 text-center max-w-[100px]">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute left-12 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                                {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="border-t border-gray-200 border-dashed" />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Alerts Panel */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
                    <div className="space-y-4 max-h-[320px] overflow-y-auto">
                        {alerts.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">No alerts</p>
                        ) : (
                            alerts.map((item, index) => {
                                const info = getAlertInfo(item);
                                const Icon = info.icon;
                                return (
                                    <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                                        <div className="flex items-start gap-2">
                                            <Icon className={`h-4 w-4 mt-0.5 ${info.iconColor}`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">{info.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{info.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <a href="/notifications" className="block text-center text-sm text-primary hover:underline mt-4">
                        View All Alerts
                    </a>
                </div>
            </div>

            {/* Buy Order Status Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Buy Order Status</h2>
                </div>
                <div className="overflow-x-auto">
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No recent orders</div>
                    ) : (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Order ID</th>
                                    <th className="px-6 py-4 font-medium">POL Name</th>
                                    <th className="px-6 py-4 font-medium">Quantity</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Last Updated</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500">#{order.id}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">{order.product_name}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.quantity}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                                                order.status === 'approved' ? 'bg-green-100 text-green-700'
                                                : order.status === 'cancelled' ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 flex items-center gap-2">
                                            {formatTime(order.updated_at)}
                                            <ChevronRight className="h-4 w-4 text-gray-400" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
