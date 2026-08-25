import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Users,
  Calendar,
  DollarSign,
  Sparkles,
  ShieldAlert,
  Clock,
  Plus,
  CheckCircle2,
  MessageSquare,
  Phone,
  Mail,
  Trash2,
  ArrowRight,
  Send,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { Deal, DealStage, Activity, Task } from '../../types';

const STAGES: { id: DealStage; label: string }[] = [
  { id: 'discovery', label: 'Discovery' },
  { id: 'qualification', label: 'Qualification' },
  { id: 'demo_scheduled', label: 'Demo' },
  { id: 'proposal_sent', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Closed Won' },
  { id: 'closed_lost', label: 'Closed Lost' },
];

export const DealDetailModal: React.FC = () => {
  const {
    selectedDealId,
    setSelectedDealId,
    deals,
    updateDealStage,
    refreshAll,
    addToast,
    openAICopilot,
    openQuickCreate,
  } = useCRM();

  const { canEdit, canDelete } = useAuth();

  const [deal, setDeal] = useState<Deal | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // New Note / Activity State
  const [noteText, setNoteText] = useState('');
  const [activityType, setActivityType] = useState<'note' | 'call' | 'meeting' | 'email'>('note');

  useEffect(() => {
    if (!selectedDealId) {
      setDeal(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.getDeal(selectedDealId);
        setDeal(res.deal);
        setActivities(res.activities);
        setTasks(res.tasks);
      } catch (err) {
        console.error('Failed to fetch deal detail:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [selectedDealId, deals]);

  if (!selectedDealId) return null;

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !deal) return;

    try {
      const res = await api.createActivity({
        type: activityType,
        title: `${activityType.toUpperCase()}: ${noteText.slice(0, 40)}...`,
        description: noteText,
        relatedType: 'deal',
        relatedId: deal.id,
        relatedTitle: deal.title,
      });

      setActivities(prev => [res.activity, ...prev]);
      setNoteText('');
      addToast({ type: 'success', title: 'Activity Logged' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to log activity', message: err.message });
    }
  };

  const handleDelete = async () => {
    if (!deal) return;
    if (window.confirm(`Delete deal "${deal.title}"? This action cannot be undone.`)) {
      try {
        await api.deleteDeal(deal.id);
        addToast({ type: 'info', title: 'Deal Deleted' });
        setSelectedDealId(null);
        refreshAll();
      } catch (err: any) {
        addToast({ type: 'error', title: 'Delete failed', message: err.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-slate-400">DEAL #{deal?.id}</span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  deal?.priority === 'urgent'
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    : deal?.priority === 'high'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {deal?.priority} priority
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{deal?.title}</h2>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {deal?.companyName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {deal?.contactName}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openAICopilot({ dealId: deal?.id })}
              className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950 dark:text-indigo-300 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Risk Check</span>
            </button>
            {canDelete && (
              <button
                onClick={handleDelete}
                className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                title="Delete Deal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setSelectedDealId(null)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stage Progression Chevron Stepper */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-[600px]">
            {STAGES.map((s, idx) => {
              const isCurrent = deal?.stage === s.id;
              const isPassed =
                STAGES.findIndex(x => x.id === deal?.stage) > idx &&
                deal?.stage !== 'closed_lost';

              return (
                <button
                  key={s.id}
                  disabled={!canEdit}
                  onClick={() => deal && updateDealStage(deal.id, s.id)}
                  className={`flex-1 py-2 px-2 text-xs font-semibold rounded-lg transition text-center whitespace-nowrap ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-xs font-bold'
                      : isPassed
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Left Column: Deal Metadata & AI Insights */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Deal Value</span>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  ${deal?.value.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                <div>
                  <span className="text-slate-400">Win Probability</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{deal?.probability}%</p>
                </div>
                <div>
                  <span className="text-slate-400">Expected Close</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{deal?.expectedCloseDate}</p>
                </div>
              </div>
            </div>

            {/* AI Win Recommendation Badge */}
            {deal?.aiWinRecommendation && (
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>AI Copilot Recommendation</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                  {deal.aiWinRecommendation}
                </p>
              </div>
            )}

            {/* Notes Section */}
            {deal?.notes && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Executive Notes</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{deal.notes}</p>
              </div>
            )}
          </div>

          {/* Right 2 Columns: Activity Timeline & Action Log */}
          <div className="md:col-span-2 space-y-4">
            {/* Quick Log Box */}
            <form onSubmit={handleAddActivity} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">Log Interaction</span>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
                    {(['note', 'call', 'meeting', 'email'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setActivityType(t)}
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold capitalize transition ${
                          activityType === t
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-2xs'
                            : 'text-slate-500'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <textarea
                rows={2}
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="Log discussion notes, key objections, next milestones..."
                className="w-full p-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={!noteText.trim()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                  <span>Save Activity</span>
                </button>
              </div>
            </form>

            {/* Timeline Stream */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
                Activity History ({activities.length})
              </h3>

              {activities.length === 0 ? (
                <p className="text-center py-6 text-slate-400">No activities logged yet.</p>
              ) : (
                activities.map(act => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-white text-xs">{act.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(act.createdAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {act.description && <p className="text-slate-600 dark:text-slate-300 text-xs">{act.description}</p>}
                    <div className="text-[10px] text-slate-400">Logged by {act.createdByName}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
