"use client";

import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Clock } from "lucide-react";

const API_BASE = 'http://127.0.0.1:8000/api/dashboard';

interface Notification {
    id: number;
    title: string;
    message: string;
    status: string;
    created_at: string;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const getToken = () => localStorage.getItem('access_token');

    const fetchNotifications = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/notifications/`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(Array.isArray(data) ? data : data.results || []);
            }
        } catch {
            console.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const runExpiryCheckAndFetch = async () => {
            try {
                await fetch(`${API_BASE}/notifications/trigger-expiry/`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
            } catch {
                // silent — alerts may already exist
            }
            fetchNotifications();
        };
        runExpiryCheckAndFetch();
    }, [fetchNotifications]);

    const formatTimestamp = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Communication Logs</h1>
                <p className="mt-2 text-sm text-gray-500">View automated AI notifications regarding usage and expiry.</p>
            </div>

            {loading ? (
                <div className="p-8 text-center text-gray-500">Loading notifications...</div>
            ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No notifications yet.</div>
            ) : (
                <div className="space-y-4">
                    {notifications.map((notification) => (
                        <div key={notification.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                            <div className="flex items-center gap-4 p-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                                    <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">{notification.title}</h3>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{formatTimestamp(notification.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
                                <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
