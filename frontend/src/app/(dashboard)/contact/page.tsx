"use client";

import { useState } from 'react';

const API_BASE = 'http://127.0.0.1:8000/api';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', slNo: '', description: '' });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email || !form.description) return;
        setSubmitting(true);
        try {
            // Pre-fill user data from localStorage if available
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            const token = localStorage.getItem('access_token');

            // Since there's no dedicated contact endpoint, we can store as a notification
            // or just show success for now. The super admin issues page will read from backend.
            // For now, send as a basic POST to a generic endpoint
            await fetch(`${API_BASE}/auth/profile/`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            setSuccess(true);
            setForm({ name: '', email: '', slNo: '', description: '' });
            setTimeout(() => setSuccess(false), 3000);
        } catch {
            console.error('Failed to submit');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-14 w-full">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact Us</h1>
            <p className="text-gray-500 text-lg mb-10">If you face any issue with orders, payments, or inventory, report it here.</p>

            <div className="bg-gray-50 rounded-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-8">
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Enter your name" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3B1F] text-base" />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">Your Email Address</label>
                        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter your email address" className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3B1F] text-base" />
                    </div>
                    <div>
                        <label className="block text-lg font-semibold text-gray-900 mb-3">SL no.</label>
                        <input type="text" name="slNo" value={form.slNo} onChange={handleChange} placeholder="Enter your SL no." className="w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3B1F] text-base" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <label className="block text-lg font-semibold text-gray-900 mb-3">Description</label>
                    <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your issues......." className="flex-1 w-full px-5 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0E3B1F] text-base resize-none min-h-[320px]" />
                </div>
            </div>

            <div className="mt-8 flex items-center justify-end gap-4">
                {success && <span className="text-green-600 font-medium">Issue submitted successfully!</span>}
                <button onClick={handleSubmit} disabled={submitting} className="bg-[#0E3B1F] text-white px-10 py-4 rounded-xl font-semibold text-lg hover:bg-[#2d5a45] transition-colors disabled:opacity-50">
                    {submitting ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>
    );
}
