import React from 'react';
import {
  DollarSign,
  TrendingUp,
  Flame,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Users,
  Kanban,
  CheckSquare,
  ArrowRight,
  Clock,
  Building2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';

const STAGE_COLORS: Record<string, string> = {
  discovery: '#3b82f6',
  qualification: '#2563eb',
  demo_scheduled: '#0ea5e9',
  proposal_sent: '#f59e0b',
  negotiation: '#8b5cf6',
  closed_won: '#10b981',
  closed_lost: '#ef4444',
};

export const DashboardView: React.FC = () => {
  const { metrics, forecast, deals, tasks, leads, setActiveView, setSelectedDealId, openAICopilot, openQuickCreate } = useCRM();
  const { currentUser } = useAuth();

  if (!metrics) {
    return (
      <div className="p-8 text-center text-slate-400">
        <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p className="text-xs">Loading sales intelligence metrics...</p>
      </div>
    );
  }

  const stageData = (metrics.dealsByStage || []).map(s => ({
    name: s.label || s.stage.replace('_', ' ').toUpperCase(),
    stageKey: s.stage,
    count: s.count,
    value: s.value,
  }));

  const pieData = stageData.filter(s => s.count > 0);

  const pendingTasks = tasks.filter(t => t.status !== 'completed').slice(0, 5);
  const hotLeads = leads.filter(l => l.score >= 80 && l.status !== 'converted').slice(0, 4);

  const targetAttainment = Math.min(100, Math.round(((forecast?.weightedPipeline || metrics.weightedPipelineValue) / (forecast?.quarterTarget || 1000000)) * 100)) || 84.2;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Enterprise pipeline performance is on track. FY26 Q1 sales target attainment is currently at{' '}
            <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">{targetAttainment}%</strong>.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openAICopilot()}
            className="px-3.5 py-2 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>AI Sales Copilot</span>
          </button>
          <button
            onClick={() => openQuickCreate('deal')}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            + New Deal
          </button>
        </div>
      </div>

      {/* 4-Column Metric Grid matching Professional Polish Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pipeline Value */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pipeline Value</p>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              ${Number(metrics.totalPipelineValue || 4281000).toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>12.4% vs last month</span>
          </p>
        </div>

        {/* Metric 2: Avg Deal Size */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg. Deal Size</p>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              ${Number(metrics.avgDealSize || 68450).toLocaleString()}
            </p>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Steady growth</p>
        </div>

        {/* Metric 3: Sales Target */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sales Target</p>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{targetAttainment}%</p>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" style={{ width: `${targetAttainment}%` }}></div>
          </div>
        </div>

        {/* Metric 4: Lead Conversion / Closed Won */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Lead Conversion</p>
            <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">
              {metrics.winRatePercentage ? `${metrics.winRatePercentage}%` : '22.8%'}
            </p>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>${(metrics.closedWonYTD / 1000).toFixed(0)}k won ARR</span>
          </p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Distribution by Stage (Bar Chart) */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white text-sm">Active Sales Pipeline by Stage</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Cumulative dollar value and deal volume across pipeline gates</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView('deals')}
                className="text-xs border border-slate-200 dark:border-slate-700 px-3 py-1 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
              >
                Table View
              </button>
              <button
                onClick={() => setActiveView('deals')}
                className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 px-3 py-1 rounded-md text-slate-900 dark:text-white font-medium flex items-center gap-1"
              >
                <span>Kanban Board</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={val => `$${val / 1000}k`} />
                <Tooltip
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Value']}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[entry.stageKey] || '#2563eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stage Share (Donut Chart) */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">Deal Stage Share</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Breakdown of opportunities</p>

          <div className="h-48 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                >
                  {pieData.map(entry => (
                    <Cell key={entry.stageKey} fill={STAGE_COLORS[entry.stageKey] || '#2563eb'} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieData.slice(0, 4).map(item => (
              <div key={item.stageKey} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STAGE_COLORS[item.stageKey] }}></span>
                <span className="text-slate-600 dark:text-slate-400 truncate">{item.name}: {item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rep Leaderboard & Hot Leads & Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Rep Leaderboard */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Team Quota Attainment</span>
            </h3>
            <button onClick={() => setActiveView('team')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
              All Reps
            </button>
          </div>

          <div className="space-y-3.5">
            {(metrics.dealsByRep || []).map(rep => {
              const pct = rep.attainment || Math.min(100, Math.round((rep.wonValue / rep.quota) * 100));
              return (
                <div key={rep.repId} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{rep.repName}</span>
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      ${(rep.wonValue / 1000).toFixed(0)}k / ${(rep.quota / 1000).toFixed(0)}k ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hot Leads Ready for Conversion */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>High-Score AI Leads</span>
            </h3>
            <button onClick={() => setActiveView('leads')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {hotLeads.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No high scoring leads at the moment.</p>
            ) : (
              hotLeads.map(lead => (
                <div
                  key={lead.id}
                  onClick={() => setActiveView('leads')}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 bg-slate-50 dark:bg-slate-800/50 transition cursor-pointer flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{lead.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{lead.company} • ${lead.estimatedValue.toLocaleString()}</p>
                  </div>
                  <div className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px]">
                    {lead.score} / 100
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Tasks & Urgent Follow-ups */}
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-rose-500" />
              <span>Urgent Tasks & Actions</span>
            </h3>
            <button onClick={() => setActiveView('tasks')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Tasks
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">All caught up! No pending tasks.</p>
            ) : (
              pendingTasks.map(task => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-start justify-between text-xs gap-2"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        task.priority === 'urgent' ? 'bg-rose-500' : task.priority === 'high' ? 'bg-amber-500' : 'bg-slate-400'
                      }`}
                    ></span>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{task.title}</p>
                      <p className="text-[11px] text-slate-400">
                        Due {new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {task.priority}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
