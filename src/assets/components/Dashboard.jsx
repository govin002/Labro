import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdPeople,
    MdPendingActions,
    MdCheckCircle,
    MdTrendingUp,
    MdAttachMoney,
    MdHistory,
    MdArrowForward,
    MdDateRange,
    MdFilterList
} from 'react-icons/md';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import { format, subDays, subMonths, isWithinInterval, startOfDay, endOfDay, eachDayOfInterval } from 'date-fns';

// Helper to generate mock data for the last 90 days
const generateMockData = () => {
    const data = [];
    const today = new Date();

    // Daily data for last 90 days
    for (let i = 90; i >= 0; i--) {
        const date = subDays(today, i);
        data.push({
            date: date,
            dateStr: format(date, 'yyyy-MM-dd'),
            displayDate: format(date, 'MMM dd'),
            patients: Math.floor(Math.random() * 40) + 10,
            revenue: Math.floor(Math.random() * 15000) + 5000,
            isHourly: false
        });
    }

    // Hourly data for today (to support "Daily" / "Today" view)
    for (let i = 0; i < 24; i++) {
        const date = new Date();
        date.setHours(i, 0, 0, 0);
        data.push({
            date: date,
            dateStr: format(date, 'yyyy-MM-dd HH:mm'),
            displayDate: format(date, 'HH:mm'),
            patients: Math.floor(Math.random() * 10) + 2,
            revenue: Math.floor(Math.random() * 3000) + 500,
            isHourly: true
        });
    }

    return data;
};

const MOCK_DATA = generateMockData();

const Dashboard = () => {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('week'); // 'day', 'week', 'month', 'custom'
    const [customRange, setCustomRange] = useState({
        start: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd')
    });

    const stats = [
        { label: "Today's Patients", value: "42", icon: <MdPeople />, color: "bg-blue-600", trend: "+12%" },
        { label: "Pending Tests", value: "18", icon: <MdPendingActions />, color: "bg-amber-500", trend: "5 Urgent" },
        { label: "Completed", value: "24", icon: <MdCheckCircle />, color: "bg-emerald-500", trend: "86% Rate" },
    ];

    const recentActivity = [
        { id: "10228", name: "Jamuna Rajkarnikar", test: "Vit B12", time: "10:45 AM", status: "Verified" },
        { id: "10234", name: "Shanti Pandit", test: "Thyroid", time: "11:20 AM", status: "Pending" },
        { id: "10238", name: "Bishnu Khatri", test: "Vit D", time: "12:15 PM", status: "Authorized" },
        { id: "10239", name: "Sita Kumari", test: "Urine RE", time: "01:05 PM", status: "Completed" },
    ];

    const chartData = useMemo(() => {
        const today = new Date();

        if (timeRange === 'day') {
            return MOCK_DATA.filter(d => d.isHourly && format(d.date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd'));
        }

        let start;
        let end = endOfDay(today);

        if (timeRange === 'week') {
            start = subDays(today, 6);
        } else if (timeRange === 'month') {
            start = subMonths(today, 1);
        } else if (timeRange === 'custom') {
            start = startOfDay(new Date(customRange.start));
            end = endOfDay(new Date(customRange.end));
        }

        return MOCK_DATA.filter(d =>
            !d.isHourly && isWithinInterval(d.date, { start, end })
        );
    }, [timeRange, customRange]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-slate-200 shadow-xl rounded-xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{payload[0]?.payload?.displayDate}</p>
                    <div className="space-y-1">
                        {payload[0] && (
                            <p className="text-xs font-black text-blue-600 flex justify-between gap-4">
                                <span>Patients:</span>
                                <span>{payload[0].value}</span>
                            </p>
                        )}
                        {payload[1] && (
                            <p className="text-xs font-black text-emerald-600 flex justify-between gap-4">
                                <span>Revenue:</span>
                                <span>NPR {payload[1].value?.toLocaleString()}</span>
                            </p>
                        )}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex-1 h-full overflow-hidden p-4 bg-[#f1f5f9] font-sans flex flex-col gap-4">
            {/* Compact Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Analytics Dashboard</h1>
                    <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-1">Govinda Pathology Lab</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-200">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Live Updates</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-all group cursor-pointer">
                        <div className={`${stat.color} p-2.5 rounded-xl text-white shadow-md`}>
                            {React.cloneElement(stat.icon, { size: 20 })}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-none mb-1">{stat.label}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black text-slate-800 leading-none">{stat.value}</span>
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">{stat.trend}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Advanced Patient Traffic Chart */}
                <div className="lg:col-span-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] flex items-center gap-2">
                            <MdTrendingUp className="text-blue-600" size={16} /> Patient Flow Analysis
                        </h3>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex bg-slate-100 p-1 rounded-xl">
                                {[
                                    { id: 'day', label: 'Daily' },
                                    { id: 'week', label: 'Weekly' },
                                    { id: 'month', label: 'Last Month' },
                                    { id: 'custom', label: 'Period' }
                                ].map((range) => (
                                    <button
                                        key={range.id}
                                        onClick={() => setTimeRange(range.id)}
                                        className={`px-3 py-1.5 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all ${timeRange === range.id
                                            ? 'bg-white text-blue-600 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>

                            {timeRange === 'custom' && (
                                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                                    <input
                                        type="date"
                                        value={customRange.start}
                                        onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                                        className="text-[9px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400"
                                    />
                                    <span className="text-[9px] font-black text-slate-400">TO</span>
                                    <input
                                        type="date"
                                        value={customRange.end}
                                        onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                                        className="text-[9px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-blue-400"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="displayDate"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 800, fill: '#64748b', textTransform: 'uppercase' }}
                                    dy={10}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 800, fill: '#2563eb' }}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 800, fill: '#10b981' }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="patients"
                                    stroke="#2563eb"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorPatients)"
                                    animationDuration={1500}
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={false}
                                    animationDuration={1500}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 flex items-center gap-6 justify-center border-t border-slate-50 pt-4">
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-sm shadow-blue-200" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Patients</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Revenue Growth</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 min-h-0">
                    <div className="bg-[#003366] p-4 rounded-2xl shadow-lg text-white relative overflow-hidden shrink-0 group hover:shadow-xl transition-all">
                        <div className="absolute -right-2 -top-2 w-16 h-16 bg-blue-600/20 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500" />
                        <h3 className="font-black uppercase tracking-widest text-[9px] mb-2 opacity-60">Estimated Revenue Today</h3>
                        <div className="flex items-center gap-2">
                            <MdAttachMoney size={20} className="text-emerald-400" />
                            <span className="text-2xl font-black">NPR 18,450</span>
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full ml-auto">+8.4%</span>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-0">
                        <h3 className="font-black text-slate-800 uppercase tracking-widest text-[11px] mb-3 flex items-center gap-2">
                            <MdHistory className="text-slate-400" size={16} /> Recent Activity
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-1">
                            {recentActivity.map((act, i) => (
                                <div key={i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 border border-slate-200 group-hover:bg-white group-hover:text-blue-600 transition-colors">
                                        {act.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-[10px] font-black text-slate-800 truncate leading-none mb-1">{act.name}</h4>
                                        <div className="flex items-center gap-2">
                                            <p className="text-[8px] font-bold text-slate-400 uppercase truncate">{act.test}</p>
                                            <span className="text-[7px] text-slate-300">•</span>
                                            <p className="text-[8px] font-bold text-slate-400">{act.time}</p>
                                        </div>
                                    </div>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-lg border ${act.status === 'Pending'
                                            ? 'text-amber-600 bg-amber-50 border-amber-100'
                                            : act.status === 'Verified'
                                                ? 'text-blue-600 bg-blue-50 border-blue-100'
                                                : act.status === 'Authorized'
                                                    ? 'text-indigo-600 bg-indigo-50 border-indigo-100'
                                                    : 'text-emerald-600 bg-emerald-50 border-emerald-100'
                                        }`}>
                                        {act.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() => navigate('/Home/ServiceQueue')}
                            className="w-full mt-3 py-2 text-[9px] font-black text-blue-600 uppercase tracking-widest border-t border-slate-100 flex items-center justify-center gap-2 hover:bg-blue-50/50 rounded-b-xl transition-all"
                        >
                            View All Activity <MdArrowForward size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Department Workload Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-1">
                {[
                    { name: 'Hematology', count: 12, color: 'border-l-blue-500', bg: 'bg-blue-50/30' },
                    { name: 'Biochemistry', count: 8, color: 'border-l-emerald-500', bg: 'bg-emerald-50/30' },
                    { name: 'Immunology', count: 4, color: 'border-l-purple-500', bg: 'bg-purple-50/30' },
                    { name: 'Microbiology', count: 2, color: 'border-l-amber-500', bg: 'bg-amber-50/30' },
                ].map((dept, i) => (
                    <div key={i} className={`bg-white p-2.5 rounded-xl border border-slate-200 border-l-4 ${dept.color} shadow-sm flex justify-between items-center hover:scale-[1.02] transition-transform cursor-pointer`}>
                        <div className="flex flex-col">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter truncate">{dept.name}</p>
                            <p className="text-[7px] font-bold text-slate-400 uppercase">Active Workload</p>
                        </div>
                        <span className={`text-sm font-black text-slate-800 px-2 py-1 ${dept.bg} rounded-lg`}>{dept.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
