import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Building2,
  Calendar,
  DollarSign,
  AlertTriangle,
  ChevronRight,
  MoreVertical,
  ArrowRight,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { Deal, DealStage } from '../../types';

const STAGE_COLUMNS: { id: DealStage; label: string; color: string }[] = [
  { id: 'discovery', label: 'Discovery', color: 'border-t-blue-500' },
  { id: 'qualification', label: 'Qualification', color: 'border-t-blue-700' },
  { id: 'demo_scheduled', label: 'Demo Scheduled', color: 'border-t-sky-500' },
  { id: 'proposal_sent', label: 'Proposal Sent', color: 'border-t-amber-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'border-t-purple-500' },
  { id: 'closed_won', label: 'Closed Won', color: 'border-t-emerald-500' },
  { id: 'closed_lost', label: 'Closed Lost', color: 'border-t-rose-500' },
];

export const DealsKanbanView: React.FC = () => {
  const { deals, updateDealStage, setSelectedDealId, openQuickCreate, openAICopilot } = useCRM();
  const { users, canEdit } = useAuth();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [search, setSearch] = useState('');
  const [repFilter, setRepFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);

  // Filter deals
  const filteredDeals = deals.filter(d => {
    const matchSearch =
      !search ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.companyName.toLowerCase().includes(search.toLowerCase());
    const matchRep = repFilter === 'all' || d.assignedToId === repFilter;
    const matchPriority = priorityFilter === 'all' || d.priority === priorityFilter;
    return matchSearch && matchRep && matchPriority;
  });

  const totalFilteredValue = filteredDeals.reduce((sum, d) => sum + d.value, 0);

  // Drag & Drop handlers
  const handleDragStart = (dealId: string) => {
    setDraggedDealId(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stage: DealStage) => {
    if (draggedDealId && canEdit) {
      updateDealStage(draggedDealId, stage);
      setDraggedDealId(null);
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-full">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Sales Pipeline & Deals
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredDeals.length} deals • Total Pipeline: <strong className="text-slate-800 dark:text-slate-200">${(totalFilteredValue / 1000).toFixed(0)}k</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-2.5 py-1.5 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Table</span>
            </button>
          </div>

          <button
            onClick={() => openQuickCreate('deal')}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Deal</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter deals or accounts..."
            className="w-full bg-transparent text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400 text-xs"
          />
        </div>

        {/* Rep filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Owner:</span>
          <select
            value={repFilter}
            onChange={e => setRepFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Reps</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>

        {/* Priority filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Priority:</span>
          <select
            value={priorityFilter}
            onChange={e => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* VIEW MODE: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[600px]">
          {STAGE_COLUMNS.map(col => {
            const stageDeals = filteredDeals.filter(d => d.stage === col.id);
            const stageTotal = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={col.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id)}
                className={`w-72 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 border-t-3 ${col.color} p-3 flex flex-col max-h-[75vh] shadow-2xs`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="font-bold text-xs text-slate-900 dark:text-white">{col.label}</span>
                    <span className="ml-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      ({stageDeals.length})
                    </span>
                  </div>
                  <span className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-400">
                    ${(stageTotal / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Column Deal Cards */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                  {stageDeals.length === 0 ? (
                    <div className="p-4 text-center border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-400 text-xs">
                      Drop deals here
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <div
                        key={deal.id}
                        draggable={canEdit}
                        onDragStart={() => handleDragStart(deal.id)}
                        onClick={() => setSelectedDealId(deal.id)}
                        className="p-3.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700/80 shadow-2xs hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs transition cursor-pointer space-y-2 group"
                      >
                        {/* Title & Priority */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {deal.title}
                          </h4>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                              deal.priority === 'urgent'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : deal.priority === 'high'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {deal.priority}
                          </span>
                        </div>

                        {/* Company & Value */}
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1 truncate">
                            <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{deal.companyName}</span>
                          </span>
                          <span className="font-bold text-slate-900 dark:text-white">
                            ${deal.value.toLocaleString()}
                          </span>
                        </div>

                        {/* AI Risk Score Badge if available */}
                        {deal.aiRiskScore !== undefined && deal.aiRiskScore > 40 && (
                          <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">
                            <AlertTriangle className="w-3 h-3 text-amber-500" />
                            <span>Risk Score: {deal.aiRiskScore}/100</span>
                          </div>
                        )}

                        {/* Footer: Probability & Expected Close */}
                        <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-700/60 text-[10px] text-slate-400">
                          <span>{deal.probability}% Prob.</span>
                          <span>Close: {deal.expectedCloseDate}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE: TABLE */}
      {viewMode === 'table' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3.5">Deal Name</th>
                <th className="p-3.5">Account</th>
                <th className="p-3.5">Value</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5">Probability</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Expected Close</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredDeals.map(deal => (
                <tr
                  key={deal.id}
                  onClick={() => setSelectedDealId(deal.id)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
                >
                  <td className="p-3.5 font-bold text-slate-900 dark:text-white">{deal.title}</td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{deal.companyName}</td>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white">${deal.value.toLocaleString()}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {deal.stage.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">{deal.probability}%</td>
                  <td className="p-3.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        deal.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : deal.priority === 'high'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {deal.priority}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">{deal.expectedCloseDate}</td>
                  <td className="p-3.5 text-right">
                    <button className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
