"use client";

import { Package, Clock, TrendingDown, RefreshCw, AlertTriangle, AlertCircle, XCircle, ChevronRight } from 'lucide-react';

const statsCards = [
    {
        title: 'Total POL Items',
        value: '102',
        icon: Package,
        bgColor: 'bg-orange-50',
        iconColor: 'text-orange-500'
    },
    {
        title: 'Near Expiry',
        value: '18',
        icon: Clock,
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-500'
    },
    {
        title: 'Low Stock',
        value: '4',
        icon: TrendingDown,
        bgColor: 'bg-yellow-50',
        iconColor: 'text-yellow-600'
    },
    {
        title: 'Active Transaction',
        value: '10',
        icon: RefreshCw,
        bgColor: 'bg-green-50',
        iconColor: 'text-green-500'
    },
];

const stockData = [
    { name: 'High-Grade Diesel', value: 450, color: 'bg-orange-400' },
    { name: 'Synth-X Engine Oil', value: 350, color: 'bg-blue-400' },
    { name: 'Heavy Duty Grease', value: 280, color: 'bg-teal-400' },
];

const alerts = [
    {
        type: 'warning',
        icon: AlertTriangle,
        iconColor: 'text-yellow-500',
        title: 'Low Stock Detected',
        description: 'Stock for {POL Name} is running low. Replenishment may be required soon.',
    },
    {
        type: 'critical',
        icon: AlertCircle,
        iconColor: 'text-red-500',
        title: 'Critical Stock Level',
        description: '{POL Name} has reached a critical stock level. Immediate action is recommended.',
    },
    {
        type: 'out',
        icon: XCircle,
        iconColor: 'text-red-600',
        title: 'Out of Stock',
        description: '{POL Name} is currently out of stock.',
    },
    {
        type: 'out',
        icon: XCircle,
        iconColor: 'text-red-600',
        title: 'Out of Stock',
        description: '{POL Name} is currently out of stock.',
    },
];

const buyOrders = [
    { id: '1401', name: 'Premium Diesel', buyer: 'Global Fuels Ltd', seller: 'Loxanity', quantity: '1000', status: 'Delivery Pending', updated: 'Just Now' },
    { id: '1401', name: 'Premium Diesel', buyer: 'Global Fuels Ltd', seller: 'Loxanity', quantity: '1000', status: 'Delivery Pending', updated: 'Just Now' },
    { id: '1401', name: 'Premium Diesel', buyer: 'Global Fuels Ltd', seller: 'Loxanity', quantity: '1000', status: 'Delivery Pending', updated: 'Just Now' },
    { id: '1401', name: 'Premium Diesel', buyer: 'Global Fuels Ltd', seller: 'Loxanity', quantity: '1000', status: 'Delivered', updated: '20 min ago' },
    { id: '1401', name: 'Premium Diesel', buyer: 'Global Fuels Ltd', seller: 'Loxanity', quantity: '1000', status: 'Delivered', updated: '20 min ago' },
];

const topProducts = Array(5).fill({
    name: 'Premium Diesel',
    category: 'Petroleum',
    quantity: '1000 gallons',
    revenue: '$ 3,099'
});

export default function OverviewPage() {
    const maxValue = 600;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
                        >
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
                        <h2 className="text-lg font-semibold text-gray-900">Stock Levels by Product</h2>
                        <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                            Manage Inventory <span>↗</span>
                        </a>
                    </div>

                    {/* Bar Chart */}
                    <div className="relative h-[300px]">
                        {/* Y-axis labels */}
                        <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-400">
                            <span>600</span>
                            <span>450</span>
                            <span>300</span>
                            <span>150</span>
                            <span>0</span>
                        </div>

                        {/* Chart area */}
                        <div className="ml-12 h-full flex items-end justify-around pb-8 border-l border-b border-gray-200 border-dashed">
                            {stockData.map((item, index) => (
                                <div key={index} className="flex flex-col items-center gap-3">
                                    <div
                                        className={`w-16 ${item.color} rounded-t-lg transition-all hover:opacity-80`}
                                        style={{ height: `${(item.value / maxValue) * 220}px` }}
                                    />
                                    <span className="text-xs text-gray-600 text-center max-w-[100px]">
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Horizontal grid lines */}
                        <div className="absolute left-12 right-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                            {[0, 1, 2, 3, 4].map((i) => (
                                <div key={i} className="border-t border-gray-200 border-dashed" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alerts Panel */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h2>
                    <div className="space-y-4 max-h-[320px] overflow-y-auto">
                        {alerts.map((alert, index) => {
                            const Icon = alert.icon;
                            return (
                                <div key={index} className="pb-4 border-b border-gray-100 last:border-0">
                                    <div className="flex items-start gap-2">
                                        <Icon className={`h-4 w-4 mt-0.5 ${alert.iconColor}`} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                                            <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <a href="#" className="block text-center text-sm text-primary hover:underline mt-4">
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
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">POL Name</th>
                                <th className="px-6 py-4 font-medium">Buyer</th>
                                <th className="px-6 py-4 font-medium">Seller</th>
                                <th className="px-6 py-4 font-medium">Quantity</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Last Updated</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {buyOrders.map((order, i) => (
                                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{order.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.buyer}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.seller}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.quantity}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block
                                            ${order.status === 'Delivered'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 flex items-center gap-2">
                                        {order.updated}
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 bg-gray-50/30">
                    <a href="#" className="flex items-center justify-center text-sm font-medium text-gray-600 hover:text-gray-900">
                        View All Orders
                    </a>
                </div>
            </div>

            {/* Top Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
                {/* Top 30 POL Sold */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Top 30 POL Sold</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium">POL Name</th>
                                    <th className="px-6 py-4 font-medium text-orange-500">Category</th>
                                    <th className="px-6 py-4 font-medium">Quantity</th>
                                    <th className="px-6 py-4 font-medium text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {topProducts.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-gray-600">{item.name}</td>
                                        <td className="px-6 py-4 text-orange-500">{item.category}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium text-right">{item.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <a href="#" className="flex items-center justify-center text-sm font-medium text-green-700 hover:text-green-800 underline">
                            View All Orders
                        </a>
                    </div>
                </div>

                {/* Top 30 POL Requested */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Top 30 POL Requested</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium">POL Name</th>
                                    <th className="px-6 py-4 font-medium text-orange-500">Category</th>
                                    <th className="px-6 py-4 font-medium">Total Requests</th>
                                    <th className="px-6 py-4 font-medium text-right">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {topProducts.map((item, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-gray-600">{item.name}</td>
                                        <td className="px-6 py-4 text-orange-500">{item.category}</td>
                                        <td className="px-6 py-4 text-gray-600">{item.quantity}</td>
                                        <td className="px-6 py-4 text-gray-900 font-medium text-right">{item.revenue}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                        <a href="#" className="flex items-center justify-center text-sm font-medium text-green-700 hover:text-green-800 underline">
                            View All Orders
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
