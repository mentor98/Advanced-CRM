import React, { useState } from 'react';
import { X, Kanban, Flame, Users, Building2, CheckSquare, Mail, Sparkles } from 'lucide-react';
import { useCRM, QuickCreateType } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';

export const QuickCreateModal: React.FC = () => {
  const {
    isQuickCreateOpen,
    setIsQuickCreateOpen,
    quickCreateType,
    setQuickCreateType,
    companies,
    contacts,
    refreshAll,
    addToast,
    openAICopilot,
  } = useCRM();

  const { currentUser, users } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [dealData, setDealData] = useState({
    title: '',
    companyId: '',
    contactId: '',
    value: 50000,
    stage: 'discovery',
    priority: 'medium',
    expectedCloseDate: new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
    assignedToId: currentUser?.id || 'usr_rep_1',
    notes: '',
  });

  const [leadData, setLeadData] = useState({
    title: '',
    company: '',
    contactName: '',
    email: '',
    phone: '',
    source: 'website',
    estimatedValue: 35000,
    notes: '',
    assignedToId: currentUser?.id || 'usr_rep_1',
  });

  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyId: '',
    title: '',
    department: 'Sales',
    status: 'lead',
    leadSource: 'direct',
    assignedToId: currentUser?.id || 'usr_rep_1',
  });

  const [companyData, setCompanyData] = useState({
    name: '',
    domain: '',
    industry: 'Enterprise Software',
    size: '100-250',
    annualRevenue: 15000000,
    phone: '',
    city: 'San Francisco',
    country: 'United States',
    status: 'prospect',
    assignedToId: currentUser?.id || 'usr_rep_1',
    description: '',
  });

  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    priority: 'high',
    relatedType: 'general',
    assignedToId: currentUser?.id || 'usr_rep_1',
  });

  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    body: '',
  });

  if (!isQuickCreateOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (quickCreateType === 'deal') {
        if (!dealData.title) throw new Error('Deal title is required');
        await api.createDeal(dealData);
        addToast({ type: 'success', title: 'Deal Created Successfully' });
      } else if (quickCreateType === 'lead') {
        if (!leadData.title || !leadData.company || !leadData.contactName) {
          throw new Error('Title, company name, and contact name are required');
        }
        await api.createLead(leadData);
        addToast({ type: 'success', title: 'Lead Created & AI Scored' });
      } else if (quickCreateType === 'contact') {
        if (!contactData.firstName || !contactData.email) {
          throw new Error('First name and email are required');
        }
        await api.createContact(contactData);
        addToast({ type: 'success', title: 'Contact Created' });
      } else if (quickCreateType === 'company') {
        if (!companyData.name) throw new Error('Company name is required');
        await api.createCompany(companyData);
        addToast({ type: 'success', title: 'Company Added' });
      } else if (quickCreateType === 'task') {
        if (!taskData.title) throw new Error('Task title is required');
        await api.createTask({
          ...taskData,
          dueDate: new Date(taskData.dueDate).toISOString(),
        });
        addToast({ type: 'success', title: 'Task Created' });
      } else if (quickCreateType === 'email') {
        if (!emailData.to || !emailData.subject || !emailData.body) {
          throw new Error('Recipient, subject, and body are required');
        }
        await api.sendEmail(emailData);
        addToast({ type: 'success', title: 'Email Dispatched & Logged' });
      }

      await refreshAll();
      setIsQuickCreateOpen(false);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Creation failed', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const tabs: { type: QuickCreateType; label: string; icon: any }[] = [
    { type: 'deal', label: 'Deal', icon: Kanban },
    { type: 'lead', label: 'Lead', icon: Flame },
    { type: 'contact', label: 'Contact', icon: Users },
    { type: 'company', label: 'Company', icon: Building2 },
    { type: 'task', label: 'Task', icon: CheckSquare },
    { type: 'email', label: 'Email', icon: Mail },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Quick Create Record</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Add new business entities to the CRM pipeline</p>
          </div>
          <button
            onClick={() => setIsQuickCreateOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 sm:px-5 bg-slate-50 dark:bg-slate-900 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isCurrent = quickCreateType === tab.type;
            return (
              <button
                key={tab.type}
                onClick={() => setQuickCreateType(tab.type)}
                className={`flex items-center gap-1.5 py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isCurrent
                    ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-md'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* DEAL FORM */}
          {quickCreateType === 'deal' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Deal Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Enterprise License Expansion"
                  value={dealData.title}
                  onChange={e => setDealData({ ...dealData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Company / Account</label>
                  <select
                    value={dealData.companyId}
                    onChange={e => setDealData({ ...dealData, companyId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Select Account</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Contact</label>
                  <select
                    value={dealData.contactId}
                    onChange={e => setDealData({ ...dealData, contactId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Select Contact</option>
                    {contacts.map(c => (
                      <option key={c.id} value={c.id}>{c.firstName} {c.lastName} ({c.companyName})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Value (USD) *</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    required
                    value={dealData.value}
                    onChange={e => setDealData({ ...dealData, value: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Pipeline Stage</label>
                  <select
                    value={dealData.stage}
                    onChange={e => setDealData({ ...dealData, stage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="discovery">Discovery</option>
                    <option value="qualification">Qualification</option>
                    <option value="demo_scheduled">Demo Scheduled</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="negotiation">Negotiation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={dealData.priority}
                    onChange={e => setDealData({ ...dealData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Close Date</label>
                  <input
                    type="date"
                    value={dealData.expectedCloseDate}
                    onChange={e => setDealData({ ...dealData, expectedCloseDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Deal Owner</label>
                  <select
                    value={dealData.assignedToId}
                    onChange={e => setDealData({ ...dealData, assignedToId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Executive Notes</label>
                <textarea
                  rows={2}
                  placeholder="Key buyer motivations, technical requirements..."
                  value={dealData.notes}
                  onChange={e => setDealData({ ...dealData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* LEAD FORM */}
          {quickCreateType === 'lead' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>AI Lead Scorer will automatically evaluate ICP fit on save.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Opportunity Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SOC2 Compliance Migration"
                    value={leadData.title}
                    onChange={e => setLeadData({ ...leadData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apex BioSciences"
                    value={leadData.company}
                    onChange={e => setLeadData({ ...leadData, company: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Contact Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Henderson"
                    value={leadData.contactName}
                    onChange={e => setLeadData({ ...leadData, contactName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="alex@apex.com"
                    value={leadData.email}
                    onChange={e => setLeadData({ ...leadData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={leadData.phone}
                    onChange={e => setLeadData({ ...leadData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Lead Source</label>
                  <select
                    value={leadData.source}
                    onChange={e => setLeadData({ ...leadData, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="website">Website Inbound</option>
                    <option value="referral">Executive Referral</option>
                    <option value="linkedin">LinkedIn Outreach</option>
                    <option value="event">Industry Conference</option>
                    <option value="cold_outreach">Cold Email / Call</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Estimated Budget ($)</label>
                  <input
                    type="number"
                    step="5000"
                    value={leadData.estimatedValue}
                    onChange={e => setLeadData({ ...leadData, estimatedValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Prospect Notes</label>
                <textarea
                  rows={2}
                  placeholder="Tell us about the customer's current stack, urgency, and requirements..."
                  value={leadData.notes}
                  onChange={e => setLeadData({ ...leadData, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* CONTACT FORM */}
          {quickCreateType === 'contact' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan"
                    value={contactData.firstName}
                    onChange={e => setContactData({ ...contactData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Hayes"
                    value={contactData.lastName}
                    onChange={e => setContactData({ ...contactData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="jordan.hayes@company.com"
                    value={contactData.email}
                    onChange={e => setContactData({ ...contactData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 012-4455"
                    value={contactData.phone}
                    onChange={e => setContactData({ ...contactData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                  <select
                    value={contactData.companyId}
                    onChange={e => setContactData({ ...contactData, companyId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="">Select Company Account</option>
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="VP of Engineering"
                    value={contactData.title}
                    onChange={e => setContactData({ ...contactData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* COMPANY FORM */}
          {quickCreateType === 'company' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Horizon Robotics"
                    value={companyData.name}
                    onChange={e => setCompanyData({ ...companyData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Domain</label>
                  <input
                    type="text"
                    placeholder="horizonrobotics.ai"
                    value={companyData.domain}
                    onChange={e => setCompanyData({ ...companyData, domain: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    placeholder="e.g. Artificial Intelligence"
                    value={companyData.industry}
                    onChange={e => setCompanyData({ ...companyData, industry: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Employee Count</label>
                  <select
                    value={companyData.size}
                    onChange={e => setCompanyData({ ...companyData, size: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="10-50">10-50 employees</option>
                    <option value="50-200">50-200 employees</option>
                    <option value="200-500">200-500 employees</option>
                    <option value="500-1000">500-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Annual Revenue ($)</label>
                  <input
                    type="number"
                    step="1000000"
                    value={companyData.annualRevenue}
                    onChange={e => setCompanyData({ ...companyData, annualRevenue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TASK FORM */}
          {quickCreateType === 'task' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule commercial terms redlining sync"
                  value={taskData.title}
                  onChange={e => setTaskData({ ...taskData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskData.dueDate}
                    onChange={e => setTaskData({ ...taskData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskData.priority}
                    onChange={e => setTaskData({ ...taskData, priority: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Assignee</label>
                <select
                  value={taskData.assignedToId}
                  onChange={e => setTaskData({ ...taskData, assignedToId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* EMAIL FORM */}
          {quickCreateType === 'email' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-medium text-slate-700 dark:text-slate-300">Recipient Email *</label>
                <button
                  type="button"
                  onClick={() => openAICopilot({ prompt: 'Draft a friendly follow-up email' })}
                  className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Draft with AI Copilot</span>
                </button>
              </div>
              <input
                type="email"
                required
                placeholder="client@organization.com"
                value={emailData.to}
                onChange={e => setEmailData({ ...emailData, to: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="Next steps regarding your enterprise evaluation"
                  value={emailData.subject}
                  onChange={e => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Message Body *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type message or insert template..."
                  value={emailData.body}
                  onChange={e => setEmailData({ ...emailData, body: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setIsQuickCreateOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save & Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
