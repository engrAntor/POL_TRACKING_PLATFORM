"use client";

import { Mail, Clock, Check } from "lucide-react";

interface Notification {
    id: number;
    title: string;
    timestamp: string;
    recipient: string;
    message: string;
    status: 'Sent';
}

const notifications: Notification[] = [
    {
        id: 1,
        title: "EXPIRY ALERT: High-Grade Diesel",
        timestamp: "14/02/2026, 16:36:32",
        recipient: "operations-manager@customer.com",
        message: "Automated notice: Your stock of High-Grade Diesel expires in -270 days (2025-05-20). Please plan for replenishment.",
        status: "Sent"
    },
    {
        id: 2,
        title: "EXPIRY ALERT: High-Grade Diesel",
        timestamp: "14/02/2026, 16:36:32",
        recipient: "operations-manager@customer.com",
        message: "Automated notice: Your stock of High-Grade Diesel expires in -270 days (2025-05-20). Please plan for replenishment.",
        status: "Sent"
    },
    {
        id: 3,
        title: "EXPIRY ALERT: High-Grade Diesel",
        timestamp: "14/02/2026, 16:36:32",
        recipient: "operations-manager@customer.com",
        message: "Automated notice: Your stock of High-Grade Diesel expires in -270 days (2025-05-20). Please plan for replenishment.",
        status: "Sent"
    },
    {
        id: 4,
        title: "EXPIRY ALERT: High-Grade Diesel",
        timestamp: "14/02/2026, 16:36:32",
        recipient: "operations-manager@customer.com",
        message: "Automated notice: Your stock of High-Grade Diesel expires in -270 days (2025-05-20). Please plan for replenishment.",
        status: "Sent"
    },
];

export default function NotificationsPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Communication Logs</h1>
                <p className="mt-2 text-sm text-gray-500">
                    View automated AI notifications sent to customers regarding usage and expiry.
                </p>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden"
                    >
                        {/* Top Section */}
                        <div className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-primary">
                                    <Mail className="h-5 w-5" />
                                </div>

                                {/* Title & Timestamp */}
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {notification.title}
                                    </h3>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{notification.timestamp}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="flex items-center gap-1.5 rounded-full bg-[#65a30d] px-3 py-1 text-xs font-medium text-white">
                                <Check className="h-3 w-3" />
                                <span>{notification.status}</span>
                            </div>
                        </div>

                        {/* Bottom Content Section */}
                        <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400">
                                    Recipient: {notification.recipient}
                                </p>
                                <p className="text-sm font-medium text-gray-900">
                                    {notification.message}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
