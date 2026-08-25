import React, { useState, useEffect } from 'react';
import {
  Mail,
  Send,
  Sparkles,
  FileText,
  Clock,
  CheckCircle2,
  Paperclip,
  RotateCcw,
  Inbox,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { EmailLog, EmailTemplate } from '../../types';

export const EmailHubView: React.FC = () => {
  const { contacts, companies, addToast, openAICopilot } = useCRM();
  const { currentUser } = useAuth();

  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const [to, setTo] = useState('elena.rostova@fintechglobal.com');
  const [subject, setSubject] = useState('NexusCRM Enterprise Pilot & Integration Timeline');
  const [body, setBody] = useState(
    `Hi Elena,\n\nFollowing our discussion regarding Fintech Global's SOC2 compliance roadmap, I wanted to follow up with the requested integration architecture brief.\n\nWe are prepared to provision your dedicated sandbox instance this Friday. Would you or your VP of Engineering be available for a 20-minute kickoff sync?\n\nBest regards,\n${currentUser?.name || 'Sales Representative'}`
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const loadEmailData = async () => {
    try {
      setLoading(true);
      const [tmplRes, logsRes] = await Promise.all([
        api.getEmailTemplates(),
        api.getEmailLogs(),
      ]);
      setTemplates(tmplRes.templates);
      setLogs(logsRes.logs);
    } catch (err) {
      console.error('Failed to load email data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmailData();
  }, []);

  const handleApplyTemplate = (tmplId: string) => {
    setSelectedTemplateId(tmplId);
    const tmpl = templates.find(t => t.id === tmplId);
    if (!tmpl) return;

    let sub = tmpl.subject;
    let b = tmpl.body;

    sub = sub.replace(/{{company_name}}/g, 'Fintech Global');
    sub = sub.replace(/{{contact_name}}/g, 'Elena');
    b = b.replace(/{{contact_name}}/g, 'Elena');
    b = b.replace(/{{sender_name}}/g, currentUser?.name || 'Sales Team');
    b = b.replace(/{{company_name}}/g, 'Fintech Global');

    setSubject(sub);
    setBody(b);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) {
      addToast({ type: 'warning', title: 'Fill in all email fields' });
      return;
    }

    try {
      setSending(true);
      const res = await api.sendEmail({
        to,
        subject,
        body,
        templateId: selectedTemplateId || undefined,
      });
      setLogs(prev => [res.email, ...prev]);
      addToast({ type: 'success', title: 'Email Sent & Dispatched' });
      setTo('');
      setSubject('');
      setBody('');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to send email', message: err.message });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Email & Communications Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Enterprise outreach engine with smart templates, AI copywriting & delivery tracking
          </p>
        </div>

        <button
          onClick={() => openAICopilot({ prompt: 'Draft a sales outreach email' })}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Sparkles className="w-4 h-4 text-white" />
          <span>AI Email Assistant</span>
        </button>
      </div>

      {/* Main Grid: Composer & Delivery Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Email Composer */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Compose Message</h2>
            </div>

            {/* Template Selector */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Template:</span>
              <select
                value={selectedTemplateId}
                onChange={e => handleApplyTemplate(e.target.value)}
                className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs"
              >
                <option value="">Blank / Custom</option>
                {templates.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">To *</label>
              <input
                type="email"
                required
                placeholder="recipient@organization.com"
                value={to}
                onChange={e => setTo(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="Subject line..."
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Message Body *</label>
              <textarea
                rows={9}
                required
                placeholder="Write your email..."
                value={body}
                onChange={e => setBody(e.target.value)}
                className="w-full p-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed font-sans text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[11px]">Dynamic tokens: <code>{"{{contact_name}}"}</code>, <code>{"{{company_name}}"}</code></span>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md text-xs flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{sending ? 'Dispatching...' : 'Send Message'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Col: Outbound Dispatch History */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dispatch Audit Logs</h3>
            <span className="text-[11px] font-semibold text-slate-400">{logs.length} sent</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[480px]">
            {logs.map(log => (
              <div
                key={log.id}
                className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">
                    {log.to}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {log.status}
                  </span>
                </div>
                <p className="font-medium text-slate-700 dark:text-slate-300 truncate">{log.subject}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Sent by {log.senderName}</span>
                  <span>{new Date(log.sentAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
