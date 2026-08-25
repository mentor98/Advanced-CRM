import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  ShieldAlert,
  Flame,
  Mail,
  FileText,
  Copy,
  Check,
  Send,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../api';

export const AICopilotDrawer: React.FC = () => {
  const {
    isAICopilotOpen,
    setIsAICopilotOpen,
    aiCopilotContext,
    deals,
    leads,
    addToast,
    refreshAll,
    openQuickCreate,
  } = useCRM();

  const [activeTab, setActiveTab] = useState<'deal' | 'lead' | 'email' | 'notes'>('deal');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Deal Copilot State
  const [selectedDealId, setSelectedDealId] = useState<string>('');
  const [dealAnalysis, setDealAnalysis] = useState<any>(null);

  // Lead Scoring State
  const [leadForm, setLeadForm] = useState({
    title: 'Enterprise AI & Governance Platform',
    company: 'Fintech Global',
    contactName: 'Elena Rostova (CTO)',
    source: 'referral',
    estimatedValue: 120000,
    notes: 'CTO expressed urgent need to replace legacy system due to upcoming regulatory audit in Q4.',
  });
  const [leadAnalysis, setLeadAnalysis] = useState<any>(null);

  // Email Writer State
  const [emailForm, setEmailForm] = useState({
    purpose: 'Follow-up after discovery demo and request commercial terms sync',
    recipientName: 'David Chen',
    recipientCompany: 'CloudScale Inc',
    tone: 'consultative',
    keyPoints: 'Agreed on 250 enterprise seats, mentioned 15% annual commitment discount, offer pilot kickoff by next Monday.',
  });
  const [emailDraft, setEmailDraft] = useState<any>(null);

  // Meeting Notes State
  const [rawNotes, setRawNotes] = useState(
    `Met with VP of Infrastructure Marcus. Current pain: manual deployment bottleneck costing 12 engineering hours/week. Budget is allocated for $85k under FY26 infrastructure modernization. Marcus liked the SSO and audit log capabilities. Risk: Security review committee needs SOC2 Type II cert before PO signing. Action item: Send security whitepaper by Wednesday, schedule 30-min security review with their CISO on Thursday.`
  );
  const [notesExtracted, setNotesExtracted] = useState<any>(null);

  useEffect(() => {
    if (aiCopilotContext?.dealId) {
      setSelectedDealId(aiCopilotContext.dealId);
      setActiveTab('deal');
    } else if (aiCopilotContext?.leadId) {
      const l = leads.find(lead => lead.id === aiCopilotContext.leadId);
      if (l) {
        setLeadForm({
          title: l.title,
          company: l.company,
          contactName: l.contactName,
          source: l.source,
          estimatedValue: l.estimatedValue,
          notes: l.notes,
        });
      }
      setActiveTab('lead');
    }
  }, [aiCopilotContext, leads]);

  useEffect(() => {
    if (!selectedDealId && deals.length > 0) {
      setSelectedDealId(deals[0].id);
    }
  }, [deals, selectedDealId]);

  if (!isAICopilotOpen) return null;

  const handleRunDealCopilot = async () => {
    const d = deals.find(x => x.id === selectedDealId);
    if (!d) return;
    try {
      setLoading(true);
      const res = await api.aiDealCopilot({
        dealId: d.id,
        title: d.title,
        companyName: d.companyName,
        value: d.value,
        stage: d.stage,
        notes: d.notes,
      });
      setDealAnalysis(res.analysis);
      addToast({ type: 'success', title: 'Deal Copilot Analysis Ready' });
      refreshAll();
    } catch (err: any) {
      addToast({ type: 'error', title: 'AI Analysis Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRunLeadScore = async () => {
    try {
      setLoading(true);
      const res = await api.aiScoreLead(leadForm);
      setLeadAnalysis(res.analysis);
      addToast({ type: 'success', title: 'AI Lead Scored' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'AI Scoring Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDraftEmail = async () => {
    try {
      setLoading(true);
      const res = await api.aiDraftEmail(emailForm);
      setEmailDraft(res.draft);
      addToast({ type: 'success', title: 'Sales Email Drafted' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Drafting Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleExtractNotes = async () => {
    try {
      setLoading(true);
      const res = await api.aiExtractNotes(rawNotes);
      setNotesExtracted(res.extracted);
      addToast({ type: 'success', title: 'Meeting Notes Structured' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Extraction Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-2xs">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">AI Sales Copilot</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Powered by Gemini Intelligent Reasoning</p>
          </div>
        </div>
        <button
          onClick={() => setIsAICopilotOpen(false)}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 text-center text-xs font-semibold bg-slate-50 dark:bg-slate-900">
        <button
          onClick={() => setActiveTab('deal')}
          className={`py-2.5 px-1 border-b-2 transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'deal'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Deal Risk</span>
        </button>
        <button
          onClick={() => setActiveTab('lead')}
          className={`py-2.5 px-1 border-b-2 transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'lead'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Lead Score</span>
        </button>
        <button
          onClick={() => setActiveTab('email')}
          className={`py-2.5 px-1 border-b-2 transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'email'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Email Writer</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`py-2.5 px-1 border-b-2 transition-colors flex items-center justify-center gap-1 ${
            activeTab === 'notes'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Notes AI</span>
        </button>
      </div>

      {/* Drawer Content Area */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs">
        {/* TAB 1: DEAL COPILOT & RISK */}
        {activeTab === 'deal' && (
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1.5">Select Pipeline Deal</label>
              <select
                value={selectedDealId}
                onChange={e => setSelectedDealId(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              >
                {deals.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.title} • ${d.value.toLocaleString()} ({d.companyName})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleRunDealCopilot}
              disabled={loading || !selectedDealId}
              className="w-full py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
              <span>{loading ? 'Evaluating Deal Signals...' : 'Analyze Win Probability & Risks'}</span>
            </button>

            {dealAnalysis && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-3.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Risk Assessment</span>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      dealAnalysis.riskLevel === 'low'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : dealAnalysis.riskLevel === 'medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {dealAnalysis.riskLevel} Risk ({dealAnalysis.riskScore}/100)
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    Win Recommendation
                  </h4>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                    {dealAnalysis.winRecommendation}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    Identified Risk Factors
                  </h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-300 pl-4 list-disc">
                    {dealAnalysis.keyFactors?.map((k: string, idx: number) => (
                      <li key={idx}>{k}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">Next Recommended Action:</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">{dealAnalysis.suggestedAction}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: LEAD SCORING */}
        {activeTab === 'lead' && (
          <div className="space-y-3.5">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Opportunity Title</label>
              <input
                type="text"
                value={leadForm.title}
                onChange={e => setLeadForm({ ...leadForm, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                <input
                  type="text"
                  value={leadForm.company}
                  onChange={e => setLeadForm({ ...leadForm, company: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Est. Value ($)</label>
                <input
                  type="number"
                  value={leadForm.estimatedValue}
                  onChange={e => setLeadForm({ ...leadForm, estimatedValue: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Notes & Discovery Signals</label>
              <textarea
                rows={2}
                value={leadForm.notes}
                onChange={e => setLeadForm({ ...leadForm, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleRunLeadScore}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Flame className="w-4 h-4 text-amber-200" />}
              <span>{loading ? 'Evaluating Lead Fit...' : 'Calculate AI Lead Score'}</span>
            </button>

            {leadAnalysis && (
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">Lead Qualification Score</span>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500 text-white">
                    {leadAnalysis.score} / 100
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                  ICP Fit: {leadAnalysis.icpFit}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {leadAnalysis.rationale}
                </p>
                <div className="pt-2 border-t border-amber-200/60 dark:border-amber-900/40">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Recommended Next Step: </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{leadAnalysis.suggestedNextStep}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EMAIL WRITER */}
        {activeTab === 'email' && (
          <div className="space-y-3.5">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Email Objective / Purpose</label>
              <input
                type="text"
                value={emailForm.purpose}
                onChange={e => setEmailForm({ ...emailForm, purpose: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={emailForm.recipientName}
                  onChange={e => setEmailForm({ ...emailForm, recipientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Recipient Company</label>
                <input
                  type="text"
                  value={emailForm.recipientCompany}
                  onChange={e => setEmailForm({ ...emailForm, recipientCompany: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Key Value Points / Context</label>
              <textarea
                rows={2}
                value={emailForm.keyPoints}
                onChange={e => setEmailForm({ ...emailForm, keyPoints: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <button
              onClick={handleDraftEmail}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
              <span>{loading ? 'Drafting Executive Pitch...' : 'Draft Sales Outreach Email'}</span>
            </button>

            {emailDraft && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs">Generated Email</span>
                  <button
                    onClick={() => handleCopy(`${emailDraft.subject}\n\n${emailDraft.body}`)}
                    className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white text-xs mb-1.5">
                    Subject: {emailDraft.subject}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-xs whitespace-pre-line leading-relaxed">
                    {emailDraft.body}
                  </p>
                </div>
                <button
                  onClick={() => {
                    openQuickCreate('email');
                    setIsAICopilotOpen(false);
                  }}
                  className="w-full py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold text-xs hover:bg-indigo-100 transition flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Insert into Email Hub</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MEETING NOTES EXTRACTION */}
        {activeTab === 'notes' && (
          <div className="space-y-3.5">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Paste Raw Meeting Transcript or Unstructured Notes
              </label>
              <textarea
                rows={5}
                value={rawNotes}
                onChange={e => setRawNotes(e.target.value)}
                placeholder="Type or paste call transcript, meeting takeaways, or voice memos..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono text-[11px]"
              />
            </div>

            <button
              onClick={handleExtractNotes}
              disabled={loading || !rawNotes.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 shadow-xs transition disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              <span>{loading ? 'Extracting Action Items...' : 'Extract Summary & Tasks'}</span>
            </button>

            {notesExtracted && (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">Executive Summary</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
                    {notesExtracted.summary}
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs mb-1">Action Items</h4>
                  <ul className="space-y-1 pl-4 list-disc text-slate-700 dark:text-slate-300">
                    {notesExtracted.actionItems?.map((a: string, idx: number) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                </div>

                {notesExtracted.identifiedRisks?.length > 0 && (
                  <div>
                    <h4 className="font-bold text-rose-600 dark:text-rose-400 text-xs mb-1">Identified Deal Blockers</h4>
                    <ul className="space-y-1 pl-4 list-disc text-slate-700 dark:text-slate-300">
                      {notesExtracted.identifiedRisks.map((r: string, idx: number) => (
                        <li key={idx}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
