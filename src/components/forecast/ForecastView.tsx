import React from 'react';
import {
  TrendingUp,
  Target,
  ShieldCheck,
  Award,
  Sparkles,
  DollarSign,
  Layers,
  ArrowUpRight,
  PieChart as PieIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import { useCRM } from '../../context/CRMContext';

export const ForecastView: React.FC = () => {
  const { forecast, metrics, deals } = useCRM();

  if (!forecast) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Loading revenue forecasting models...</p>
      </div>
    );
  }

  // Monthly forecast chart data
  const monthlyData = [
    { month: 'Oct 2025', actual: 180000, projected: 195000 },
    { month: 'Nov 2025', actual: 240000, projected: 250000 },
    { month: 'Dec 2025', actual: 310000, projected: 320000 },
    { month: 'Jan 2026', actual: 345000, projected: 360000 },
    { month: 'Feb 2026 (Est)', actual: null, projected: 410000 },
    { month: 'Mar 2026 (Est)', actual: null, projected: 475000 },
  ];

  const target = forecast.quarterTarget || 1000000;
  const quotaProgress = Math.min(100, Math.round((forecast.weightedPipeline / target) * 100));

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          Revenue Forecasting & Pipeline Intelligence
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {forecast.period || 'FY26 Q1'} Weighted Revenue Projections & Quota Attainment
        </p>
      </div>

      {/* 4 Scenario Cards: Target, Commit, Weighted, Best Case */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Target Quota */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Target Quota ({forecast.period})</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            ${(target / 1000).toFixed(0)}k
          </p>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            <span>Company baseline goal</span>
          </div>
        </div>

        {/* Commit Forecast */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Commit (80%+ Prob.)</span>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
            ${(forecast.committedRevenue / 1000).toFixed(1)}k
          </p>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>High certainty ARR</span>
          </div>
        </div>

        {/* Weighted Pipeline */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Weighted Pipeline</span>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
            ${(forecast.weightedPipeline / 1000).toFixed(1)}k
          </p>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{quotaProgress}% quota covered</span>
          </div>
        </div>

        {/* Best Case */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Best Case (Upside)</span>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            ${(forecast.bestCaseRevenue / 1000).toFixed(1)}k
          </p>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Max potential closure</span>
          </div>
        </div>
      </div>

      {/* Main Trajectory Area Chart */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Revenue Trajectory vs Projected Run-Rate</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Actual recognized billing vs weighted predictive model</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Actual Revenue
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span> Projected Run-Rate
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#64748b" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={val => `$${val / 1000}k`} />
              <Tooltip
                formatter={(val: any) => [`$${Number(val).toLocaleString()}`, '']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#1e293b',
                  color: '#fff',
                  borderRadius: '6px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="actual" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
              <Area type="monotone" dataKey="projected" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#colorProjected)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
