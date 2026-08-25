// API Client for NexusCRM

import {
  User,
  Company,
  Contact,
  Lead,
  Deal,
  Task,
  Activity,
  EmailLog,
  EmailTemplate,
  Notification,
  AuditLog,
  DashboardMetrics,
  ForecastData,
  TestSuiteResult,
  DealStage,
} from './types';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const currentUserId = localStorage.getItem('nexus_active_user_id') || 'usr_admin_1';
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': currentUserId,
    ...(options?.headers || {}),
  };

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(errBody.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Auth & Users
  getMe: () => fetchJSON<{ user: User }>('/api/auth/me'),
  switchUser: (userId: string) => fetchJSON<{ success: boolean; user: User }>('/api/auth/switch-user', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  }),
  getUsers: () => fetchJSON<{ users: User[] }>('/api/users'),
  createUser: (user: Partial<User>) => fetchJSON<{ user: User }>('/api/users', {
    method: 'POST',
    body: JSON.stringify(user),
  }),
  updateUser: (id: string, user: Partial<User>) => fetchJSON<{ user: User }>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(user),
  }),

  // Companies
  getCompanies: (params?: { search?: string; status?: string; industry?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.industry) query.set('industry', params.industry);
    return fetchJSON<{ companies: Company[] }>(`/api/companies?${query.toString()}`);
  },
  getCompany: (id: string) => fetchJSON<{ company: Company; contacts: Contact[]; deals: Deal[]; activities: Activity[] }>(`/api/companies/${id}`),
  createCompany: (company: Partial<Company>) => fetchJSON<{ company: Company }>('/api/companies', {
    method: 'POST',
    body: JSON.stringify(company),
  }),
  updateCompany: (id: string, company: Partial<Company>) => fetchJSON<{ company: Company }>(`/api/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(company),
  }),
  deleteCompany: (id: string) => fetchJSON<{ success: boolean }>(`/api/companies/${id}`, { method: 'DELETE' }),

  // Contacts
  getContacts: (params?: { search?: string; companyId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.companyId) query.set('companyId', params.companyId);
    if (params?.status) query.set('status', params.status);
    return fetchJSON<{ contacts: Contact[] }>(`/api/contacts?${query.toString()}`);
  },
  getContact: (id: string) => fetchJSON<{ contact: Contact; company?: Company; deals: Deal[]; activities: Activity[] }>(`/api/contacts/${id}`),
  createContact: (contact: Partial<Contact>) => fetchJSON<{ contact: Contact }>('/api/contacts', {
    method: 'POST',
    body: JSON.stringify(contact),
  }),
  updateContact: (id: string, contact: Partial<Contact>) => fetchJSON<{ contact: Contact }>(`/api/contacts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contact),
  }),
  deleteContact: (id: string) => fetchJSON<{ success: boolean }>(`/api/contacts/${id}`, { method: 'DELETE' }),

  // Leads
  getLeads: (params?: { search?: string; status?: string; source?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.source) query.set('source', params.source);
    return fetchJSON<{ leads: Lead[] }>(`/api/leads?${query.toString()}`);
  },
  createLead: (lead: Partial<Lead>) => fetchJSON<{ lead: Lead; aiAnalysis: any }>('/api/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  }),
  updateLead: (id: string, lead: Partial<Lead>) => fetchJSON<{ lead: Lead }>(`/api/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(lead),
  }),
  convertLead: (id: string, params: { createDeal?: boolean; dealValue?: number; dealStage?: DealStage; expectedCloseDate?: string }) => 
    fetchJSON<{ success: boolean; lead: Lead; company: Company; contact: Contact; deal?: Deal }>(`/api/leads/${id}/convert`, {
      method: 'POST',
      body: JSON.stringify(params),
    }),
  deleteLead: (id: string) => fetchJSON<{ success: boolean }>(`/api/leads/${id}`, { method: 'DELETE' }),

  // Deals
  getDeals: (params?: { search?: string; stage?: string; assignedTo?: string; priority?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.stage) query.set('stage', params.stage);
    if (params?.assignedTo) query.set('assignedTo', params.assignedTo);
    if (params?.priority) query.set('priority', params.priority);
    return fetchJSON<{ deals: Deal[] }>(`/api/deals?${query.toString()}`);
  },
  getDeal: (id: string) => fetchJSON<{ deal: Deal; company?: Company; contact?: Contact; activities: Activity[]; tasks: Task[] }>(`/api/deals/${id}`),
  createDeal: (deal: Partial<Deal>) => fetchJSON<{ deal: Deal }>('/api/deals', {
    method: 'POST',
    body: JSON.stringify(deal),
  }),
  updateDeal: (id: string, deal: Partial<Deal>) => fetchJSON<{ deal: Deal }>(`/api/deals/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deal),
  }),
  updateDealStage: (id: string, stage: DealStage, extra?: { lossReason?: string; probability?: number }) => 
    fetchJSON<{ deal: Deal }>(`/api/deals/${id}/stage`, {
      method: 'PATCH',
      body: JSON.stringify({ stage, ...extra }),
    }),
  deleteDeal: (id: string) => fetchJSON<{ success: boolean }>(`/api/deals/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: (params?: { status?: string; assignedTo?: string }) => {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.assignedTo) query.set('assignedTo', params.assignedTo);
    return fetchJSON<{ tasks: Task[] }>(`/api/tasks?${query.toString()}`);
  },
  createTask: (task: Partial<Task>) => fetchJSON<{ task: Task }>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  }),
  updateTask: (id: string, task: Partial<Task>) => fetchJSON<{ task: Task }>(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  }),
  updateTaskStatus: (id: string, status: string) => fetchJSON<{ task: Task }>(`/api/tasks/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
  deleteTask: (id: string) => fetchJSON<{ success: boolean }>(`/api/tasks/${id}`, { method: 'DELETE' }),

  // Activities
  getActivities: (params?: { relatedType?: string; relatedId?: string }) => {
    const query = new URLSearchParams();
    if (params?.relatedType) query.set('relatedType', params.relatedType);
    if (params?.relatedId) query.set('relatedId', params.relatedId);
    return fetchJSON<{ activities: Activity[] }>(`/api/activities?${query.toString()}`);
  },
  createActivity: (activity: Partial<Activity>) => fetchJSON<{ activity: Activity }>('/api/activities', {
    method: 'POST',
    body: JSON.stringify(activity),
  }),

  // Emails
  getEmailTemplates: () => fetchJSON<{ templates: EmailTemplate[] }>('/api/emails/templates'),
  getEmailLogs: () => fetchJSON<{ logs: EmailLog[] }>('/api/emails/logs'),
  sendEmail: (data: { to: string; cc?: string; bcc?: string; subject: string; body: string; templateId?: string; relatedType?: string; relatedId?: string }) =>
    fetchJSON<{ email: EmailLog }>('/api/emails/send', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Notifications
  getNotifications: () => fetchJSON<{ notifications: Notification[] }>('/api/notifications'),
  markNotificationRead: (id: string) => fetchJSON<{ success: boolean }>(`/api/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => fetchJSON<{ success: boolean }>('/api/notifications/read-all', { method: 'POST' }),

  // Audit Logs
  getAuditLogs: () => fetchJSON<{ auditLogs: AuditLog[] }>('/api/audit-logs'),

  // Global Search
  search: (q: string) => fetchJSON<{ results: { type: string; id: string; title: string; subtitle: string; link: string }[] }>(`/api/search?q=${encodeURIComponent(q)}`),

  // Analytics & Forecasts
  getDashboardMetrics: () => fetchJSON<{ metrics: DashboardMetrics }>('/api/analytics/dashboard'),
  getForecastData: () => fetchJSON<{ forecast: ForecastData }>('/api/analytics/forecast'),

  // AI Assistant (Gemini API)
  aiScoreLead: (data: { title: string; company: string; contactName: string; source: string; estimatedValue: number; notes: string }) =>
    fetchJSON<{ analysis: { score: number; icpFit: string; rationale: string; suggestedNextStep: string } }>('/api/ai/lead-score', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  aiDealCopilot: (data: { dealId?: string; title?: string; companyName?: string; value?: number; stage?: string; notes?: string }) =>
    fetchJSON<{ analysis: { riskScore: number; riskLevel: string; keyFactors: string[]; winRecommendation: string; suggestedAction: string } }>('/api/ai/deal-copilot', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  aiDraftEmail: (data: { purpose: string; recipientName: string; recipientCompany: string; dealOrLeadTitle?: string; tone: string; keyPoints?: string }) =>
    fetchJSON<{ draft: { subject: string; body: string } }>('/api/ai/draft-email', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  aiExtractNotes: (rawNotes: string) =>
    fetchJSON<{ extracted: { summary: string; actionItems: string[]; sentiment: string; identifiedRisks: string[] } }>('/api/ai/extract-notes', {
      method: 'POST',
      body: JSON.stringify({ rawNotes }),
    }),

  // System
  resetDemoData: () => fetchJSON<{ success: boolean; message: string }>('/api/system/reset-demo-data', { method: 'POST' }),
  runAutomatedTests: () => fetchJSON<{ testResults: TestSuiteResult }>('/api/system/tests/run'),
};
