import React, { useState } from 'react';
import {
  Plus,
  Flame,
  Search,
  Building2,
  Users,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Lead } from '../../types';

export const LeadsView: React.FC = () => {
  const { leads, setSelectedLeadId, openQuickCreate, openAICopilot } = useCRM();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  const filteredLeads = leads.filter(l => {
    const matchSearch =
      !search ||
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.contactName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchSource = sourceFilter === 'all' || l.source === sourceFilter;
    return matchSearch && matchStatus && matchSource;
  });

  return (
    <div className="p-6 space-y-5 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Leads & Prospects
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredLeads.length} leads in qualification funnel • AI Scoring enabled
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openAICopilot()}
            className="px-3.5 py-2 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Lead Intelligence</span>
          </button>
          <button
            onClick={() => openQuickCreate('lead')}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search leads, contacts, or companies..."
            className="w-full bg-transparent text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="unqualified">Unqualified</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Channel:</span>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Sources</option>
            <option value="website">Website Inbound</option>
            <option value="referral">Referral</option>
            <option value="linkedin">LinkedIn</option>
            <option value="event">Event</option>
            <option value="cold_outreach">Cold Outreach</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400">
            <tr>
              <th className="p-3.5">Opportunity / Lead</th>
              <th className="p-3.5">Company</th>
              <th className="p-3.5">Contact Person</th>
              <th className="p-3.5">AI Lead Score</th>
              <th className="p-3.5">Est. Budget</th>
              <th className="p-3.5">Source</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLeads.map(lead => (
              <tr
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer transition-colors"
              >
                <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                  <div className="flex items-center gap-2">
                    <span>{lead.title}</span>
                  </div>
                </td>
                <td className="p-3.5 text-slate-700 dark:text-slate-300 font-medium">{lead.company}</td>
                <td className="p-3.5 text-slate-600 dark:text-slate-400">
                  <div>{lead.contactName}</div>
                  <div className="text-[10px] text-slate-400">{lead.email}</div>
                </td>
                <td className="p-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                        lead.score >= 80
                          ? 'bg-blue-600 text-white'
                          : lead.score >= 60
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {lead.score} / 100
                    </span>
                  </div>
                </td>
                <td className="p-3.5 font-semibold text-slate-900 dark:text-white">
                  ${lead.estimatedValue.toLocaleString()}
                </td>
                <td className="p-3.5 text-slate-500 capitalize">{lead.source.replace('_', ' ')}</td>
                <td className="p-3.5">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'converted'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : lead.status === 'qualified'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {lead.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 ml-auto">
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
