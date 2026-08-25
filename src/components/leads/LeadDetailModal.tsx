import React, { useState } from 'react';
import {
  X,
  Flame,
  Building2,
  UserCheck,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export const LeadDetailModal: React.FC = () => {
  const { selectedLeadId, setSelectedLeadId, leads, convertLead, refreshAll, addToast, openAICopilot } = useCRM();
  const { canDelete } = useAuth();

  const [converting, setConverting] = useState(false);
  const [createDeal, setCreateDeal] = useState(true);
  const [dealValue, setDealValue] = useState(35000);

  const lead = leads.find(l => l.id === selectedLeadId);
  if (!lead) return null;

  const handleConvert = async () => {
    try {
      setConverting(true);
      await convertLead(lead.id, {
        createDeal,
        dealValue,
      });
      setSelectedLeadId(null);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Conversion Failed', message: err.message });
    } finally {
      setConverting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete lead "${lead.title}"?`)) {
      try {
        await api.deleteLead(lead.id);
        addToast({ type: 'info', title: 'Lead Deleted' });
        setSelectedLeadId(null);
        refreshAll();
      } catch (err: any) {
        addToast({ type: 'error', title: 'Delete failed', message: err.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-slate-400">LEAD #{lead.id}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                {lead.status}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{lead.title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{lead.company} • {lead.contactName}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAICopilot({ leadId: lead.id })}
              className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Score AI</span>
            </button>
            {canDelete && (
              <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setSelectedLeadId(null)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Lead Content */}
        <div className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* AI Score Badge */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <Flame className="w-4 h-4 text-amber-500" />
                <span>AI Lead Quality Score</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1">
                {lead.scoreRationale || 'Evaluated based on executive title, budget readiness, and acquisition channel.'}
              </p>
            </div>
            <div className="text-center px-4 py-2 bg-amber-500 text-white rounded-xl font-extrabold text-base">
              {lead.score} / 100
            </div>
          </div>

          {/* Contact and Account Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-slate-400 text-[11px] block">Contact Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{lead.email}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{lead.phone || 'N/A'}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Estimated Budget</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">${lead.estimatedValue.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[11px] block">Source Channel</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{lead.source.replace('_', ' ')}</span>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Discovery Notes</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{lead.notes}</p>
            </div>
          )}

          {/* One-Click Convert Section */}
          {lead.status !== 'converted' ? (
            <div className="p-4 rounded-xl border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/40 dark:bg-indigo-950/30 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>Convert Lead to Account & Deal</span>
                  </h4>
                  <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">
                    Instantly create an Account ("{lead.company}") and Contact ("{lead.contactName}")
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={createDeal}
                    onChange={e => setCreateDeal(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Create Pipeline Deal</span>
                </label>

                {createDeal && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Value ($):</span>
                    <input
                      type="number"
                      value={dealValue}
                      onChange={e => setDealValue(Number(e.target.value))}
                      className="px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white w-28"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleConvert}
                disabled={converting}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50"
              >
                <ArrowRight className="w-4 h-4" />
                <span>{converting ? 'Converting Lead...' : 'Execute Full Lead Conversion'}</span>
              </button>
            </div>
          ) : (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Lead has already been converted into Account and Contact records.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
