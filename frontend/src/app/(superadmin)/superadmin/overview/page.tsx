"use client";

import { useState } from "react";
import { Users, BarChart2, ChevronDown } from "lucide-react";

// ── Chart data ────────────────────────────────────────────────────────────────
const monthlyData = [
    { month: "JAN", value: 1050 },
    { month: "FEB", value: 820 },
    { month: "MAR", value: 760 },
    { month: "APR", value: 900 },
    { month: "MAY", value: 820 },
    { month: "JUN", value: 870 },
    { month: "JUL", value: 770 },
    { month: "AUG", value: 820 },
    { month: "SEP", value: 950 },
    { month: "OCT", value: 840 },
    { month: "NOV", value: 2400 },
    { month: "DEC", value: 4000 },
];

// ── SVG helpers ───────────────────────────────────────────────────────────────
const CW = 580, CH = 170;
const PL = 52, PR = 16, PT = 10, PB = 32;
const MAX_VAL = 4000;

const gx = (i: number) =>
    PL + (i / (monthlyData.length - 1)) * (CW - PL - PR);

const gy = (v: number) =>
    PT + (CH - PT - PB) * (1 - v / MAX_VAL);

function buildLine() {
    const pts = monthlyData.map((d, i) => ({ x: gx(i), y: gy(d.value) }));
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
        const prev = pts[i - 1];
        const curr = pts[i];
        const cx = (prev.x + curr.x) / 2;
        path += ` C ${cx} ${prev.y} ${cx} ${curr.y} ${curr.x} ${curr.y}`;
    }
    return path;
}

function buildArea() {
    const bot = CH - PB;
    const lastX = gx(monthlyData.length - 1);
    const firstX = gx(0);
    return `${buildLine()} L ${lastX} ${bot} L ${firstX} ${bot} Z`;
}

const YEARS = ["2021", "2022", "2023", "2024"];
const Y_TICKS = [4000, 3000, 2000, 1000, 0];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SuperAdminOverview() {
    const [year, setYear] = useState("2023");
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Greeting box */}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 font-normal">Hi, Good Morning</p>
                <p className="text-xl font-bold text-gray-900 leading-tight">Antor Das</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-5">

                {/* ── User's Overview ── */}
                <div className="bg-white rounded-2xl p-6 w-full lg:w-[310px] shrink-0 shadow-sm border border-gray-100">
                    <h2 className="text-sm font-bold text-gray-800 mb-5">User&apos;s Overview</h2>
                    <div className="flex gap-3">
                        {[
                            { Icon: Users,     count: "1320", label: "Total Users" },
                            { Icon: BarChart2, count: "8",    label: "Today's New Users" },
                        ].map(({ Icon, count, label }) => (
                            <div
                                key={label}
                                className="flex-1 bg-gray-100 rounded-xl p-4 flex flex-col items-center justify-center gap-2 min-h-[110px]"
                            >
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                    <Icon className="w-5 h-5 text-gray-500" />
                                </div>
                                <p className="text-2xl font-bold text-gray-800 leading-none">{count}</p>
                                <p className="text-[11px] text-gray-500 text-center leading-tight">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Overall User Activity ── */}
                <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-w-0">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-sm font-bold text-gray-800">Overall User Activity</h2>

                        {/* Year picker */}
                        <div className="relative">
                            <button
                                onClick={() => setOpen(!open)}
                                className="flex items-center gap-1 text-sm font-semibold text-gray-800 select-none"
                            >
                                {year}
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            {open && (
                                <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-xl z-30 overflow-hidden w-[80px]">
                                    {YEARS.map((y) => (
                                        <button
                                            key={y}
                                            onClick={() => { setYear(y); setOpen(false); }}
                                            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${y === year ? "text-violet-600 font-semibold" : "text-gray-700"}`}
                                        >
                                            {y}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Responsive SVG line chart */}
                    <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full">
                        <defs>
                            <linearGradient id="sa-area-grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%"   stopColor="#7c3aed" stopOpacity="0.18" />
                                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.01" />
                            </linearGradient>
                        </defs>

                        {/* Grid lines + Y-axis labels */}
                        {Y_TICKS.map((v) => (
                            <g key={v}>
                                <line
                                    x1={PL} y1={gy(v)}
                                    x2={CW - PR} y2={gy(v)}
                                    stroke="#f0f0f0" strokeWidth="1"
                                />
                                <text
                                    x={PL - 6} y={gy(v) + 4}
                                    textAnchor="end" fontSize="9" fill="#aaa"
                                >
                                    {v}
                                </text>
                            </g>
                        ))}

                        {/* Area fill */}
                        <path d={buildArea()} fill="url(#sa-area-grad)" />

                        {/* Line */}
                        <path
                            d={buildLine()}
                            fill="none"
                            stroke="#7c3aed"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* X-axis month labels */}
                        {monthlyData.map((d, i) => (
                            <text
                                key={d.month}
                                x={gx(i)} y={CH - 10}
                                textAnchor="middle" fontSize="9" fill="#aaa"
                            >
                                {d.month}
                            </text>
                        ))}
                    </svg>
                </div>

            </div>
        </div>
    );
}
