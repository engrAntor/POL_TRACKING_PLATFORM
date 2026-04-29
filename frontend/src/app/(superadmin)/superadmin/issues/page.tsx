"use client";

import { useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/fetchWithAuth';

import { CheckCircle } from 'lucide-react';

interface Ticket {
    id: string; // e.g. TKT-0001
    name: string;
    email: string;
    description: string;
    status: string;
    created_at: string;
}

export default function UserIssuesPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const aiBaseUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000/api';
            const res = await fetchWithAuth(`${aiBaseUrl}/ai/tickets/admin/`);
            if (res.ok) {
                const data = await res.json();
                setTickets(data.data || []);
            }
        } catch (error) {
            console.error("Failed to fetch tickets");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleUpdateStatus = async (id: string, newStatus: string) => {
        try {
            const aiBaseUrl = process.env.NEXT_PUBLIC_AI_API_URL || 'http://localhost:8000/api';
            const res = await fetchWithAuth(`${aiBaseUrl}/ai/tickets/admin/${id}/`, {
                method: 'PATCH',
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchTickets(); // Refresh list after update
            }
        } catch (error) {
            console.error("Failed to update ticket status");
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">User Issues Tracking</h1>
            {loading ? (
                <div className="flex items-center justify-center p-12 text-gray-400">Loading issues...</div>
            ) : tickets.length === 0 ? (
                <div className="flex items-center justify-center p-12 text-gray-400">No issues reported yet.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 font-semibold text-gray-900">Ticket ID</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">User Details</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">Issue Description</th>
                                <th className="px-4 py-3 font-semibold text-gray-900">Date</th>
                                <th className="px-4 py-3 font-semibold text-gray-900 text-center">Status</th>
                                <th className="px-4 py-3 font-semibold text-gray-900 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{ticket.id}</td>
                                    <td className="px-4 py-4">
                                        <div className="text-sm font-semibold text-gray-900">{ticket.name}</div>
                                        <div className="text-xs text-gray-500">{ticket.email}</div>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-700 max-w-sm">
                                        <p className="line-clamp-2" title={ticket.description}>{ticket.description}</p>
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                                            ticket.status === 'open' ? 'bg-amber-100 text-amber-800' :
                                            ticket.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                            ticket.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        {ticket.status !== 'resolved' && (
                                            <button 
                                                onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                                                className="text-sm bg-green-50 text-green-600 px-3 py-1.5 rounded hover:bg-green-100 transition-colors"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                        {ticket.status === 'resolved' && (
                                            <div className="flex items-center justify-end text-green-600 gap-1.5">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="text-sm font-medium">Resolved</span>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
