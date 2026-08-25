import React from 'react';
import {
  LayoutDashboard,
  Kanban,
  Flame,
  Users,
  Building2,
  CheckSquare,
  Mail,
  TrendingUp,
  ShieldCheck,
  History,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Database,
} from 'lucide-react';
import { useCRM, NavView } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    deals,
    leads,
    tasks,
    resetDatabase,
    openAICopilot,
  } = useCRM();

  const { currentUser } = useAuth();

  const activeDealsCount = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length;
  const activeLeadsCount = leads.filter(l => l.status !== 'converted' && l.status !== 'unqualified').length;
  const pendingTasksCount = tasks.filter(t => t.status !== 'completed').length;

  const navItems: { id: NavView; label: string; icon: any; count?: number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'deals', label: 'Sales Pipeline', icon: Kanban, count: activeDealsCount, badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
    { id: 'leads', label: 'Leads & Prospects', icon: Flame, count: activeLeadsCount, badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
    { id: 'contacts', label: 'Contacts', icon: Users },
    { id: 'companies', label: 'Companies (Accounts)', icon: Building2 },
    { id: 'tasks', label: 'Tasks & Reminders', icon: CheckSquare, count: pendingTasksCount, badgeColor: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
    { id: 'emails', label: 'Email Hub', icon: Mail },
    { id: 'forecast', label: 'Forecasting', icon: TrendingUp },
    { id: 'team', label: 'Team Performance', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Trail', icon: History },
  ];

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand & Logo matching Professional Polish design */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-lg text-white shadow-xs">
          V
        </div>
        <div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus CRM</span>
          <p className="text-[10px] text-slate-400 font-medium">Enterprise Suite</p>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
        <div className="px-3 pb-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          Navigation
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-colors text-left ${
                isActive
                  ? 'bg-blue-600/10 text-blue-400 rounded-md border-l-4 border-blue-500 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white rounded-md font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-blue-500/20 text-blue-300' : item.badgeColor || 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        {/* AI Copilot Callout */}
        <div className="pt-4 px-1">
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 text-left">
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Sales Copilot</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5">
              Score leads, predict deal risks & craft win strategies with Gemini.
            </p>
            <button
              onClick={() => openAICopilot()}
              className="w-full py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-md transition flex items-center justify-center gap-1 shadow-xs"
            >
              <span>Launch Copilot</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </nav>

      {/* Footer: User Profile & Database Reset */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <div className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>Store: Persistent JSON</span>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all CRM data to initial enterprise demonstration state?')) {
                resetDatabase();
              }
            }}
            title="Reset database to seed demo records"
            className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-amber-400 transition font-medium"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo</span>
          </button>
        </div>

        {/* User Card */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-200 ring-1 ring-slate-600">
            {getInitials(currentUser?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{currentUser?.name || 'Jane Doe'}</p>
            <p className="text-[10px] text-slate-400 capitalize truncate">{currentUser?.role?.replace('_', ' ') || 'Sales Director'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
