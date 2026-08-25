import { Router, Request, Response } from 'express';
import { crmStore } from './db';
import { scoreLeadWithAI, analyzeDealCopilot, draftSalesEmail, extractMeetingNotes } from './gemini';
import { User, DealStage } from '../src/types';

export const apiRouter = Router();

// Current active session user fallback (Sarah Vance - Admin)
let currentSessionUserId = 'usr_admin_1';

function getCurrentUser(req: Request): User {
  const userId = (req.headers['x-user-id'] as string) || currentSessionUserId;
  const user = crmStore.getUserById(userId);
  if (user) return user;
  return crmStore.getUsers()[0];
}

// -------------------------------------------------------------
// Auth & Users
// -------------------------------------------------------------
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  res.json({ user });
});

apiRouter.post('/auth/switch-user', (req: Request, res: Response) => {
  const { userId } = req.body;
  const targetUser = crmStore.getUserById(userId);
  if (!targetUser) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  currentSessionUserId = targetUser.id;
  crmStore.recordAuditLog({
    actorId: targetUser.id,
    actorName: targetUser.name,
    action: 'auth_login',
    entityType: 'user',
    entityId: targetUser.id,
    entityName: targetUser.name,
    details: `Simulated active user switch to ${targetUser.name} (${targetUser.role}).`,
  });
  res.json({ success: true, user: targetUser });
});

apiRouter.get('/users', (_req: Request, res: Response) => {
  res.json({ users: crmStore.getUsers() });
});

apiRouter.post('/users', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  if (actor.role !== 'admin') {
    res.status(403).json({ error: 'Only administrators can create user accounts' });
    return;
  }
  const { name, email, role, department, phone, quota, avatar } = req.body;
  if (!name || !email || !role) {
    res.status(400).json({ error: 'Name, email, and role are required' });
    return;
  }
  const newUser = crmStore.createUser({
    name,
    email,
    role,
    department: department || 'Sales',
    phone: phone || '+1 (555) 000-0000',
    quota: Number(quota) || 500000,
    status: 'active',
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  }, actor);
  res.status(201).json({ user: newUser });
});

apiRouter.put('/users/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { id } = req.params;
  if (actor.role !== 'admin' && actor.id !== id) {
    res.status(403).json({ error: 'Permission denied' });
    return;
  }
  const updated = crmStore.updateUser(id, req.body, actor);
  if (!updated) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ user: updated });
});

// -------------------------------------------------------------
// Companies (Accounts)
// -------------------------------------------------------------
apiRouter.get('/companies', (req: Request, res: Response) => {
  let list = crmStore.getCompanies();
  const search = (req.query.search as string)?.toLowerCase();
  const status = req.query.status as string;
  const industry = req.query.industry as string;

  if (search) {
    list = list.filter(c => 
      c.name.toLowerCase().includes(search) ||
      c.domain.toLowerCase().includes(search) ||
      c.city.toLowerCase().includes(search) ||
      c.tags.some(t => t.toLowerCase().includes(search))
    );
  }
  if (status && status !== 'all') {
    list = list.filter(c => c.status === status);
  }
  if (industry && industry !== 'all') {
    list = list.filter(c => c.industry === industry);
  }
  res.json({ companies: list });
});

apiRouter.get('/companies/:id', (req: Request, res: Response) => {
  const company = crmStore.getCompanyById(req.params.id);
  if (!company) {
    res.status(404).json({ error: 'Company not found' });
    return;
  }
  const contacts = crmStore.getContacts().filter(c => c.companyId === company.id);
  const deals = crmStore.getDeals().filter(d => d.companyId === company.id);
  const activities = crmStore.getActivities('company', company.id);
  res.json({ company, contacts, deals, activities });
});

apiRouter.post('/companies', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { name, domain, industry, size, annualRevenue, phone, address, city, country, status, tags, description } = req.body;
  if (!name) {
    res.status(400).json({ error: 'Company name is required' });
    return;
  }
  const company = crmStore.createCompany({
    name,
    domain: domain || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    industry: industry || 'Technology',
    size: size || '50-200',
    annualRevenue: Number(annualRevenue) || 10000000,
    phone: phone || '+1 (555) 000-0000',
    address: address || '100 Enterprise Way',
    city: city || 'San Francisco',
    country: country || 'United States',
    status: status || 'prospect',
    assignedToId: req.body.assignedToId || actor.id,
    tags: tags || ['Enterprise'],
    description: description || '',
  }, actor);
  res.status(201).json({ company });
});

apiRouter.put('/companies/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const updated = crmStore.updateCompany(req.params.id, req.body, actor);
  if (!updated) {
    res.status(404).json({ error: 'Company not found' });
    return;
  }
  res.json({ company: updated });
});

apiRouter.delete('/companies/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  if (actor.role === 'analyst') {
    res.status(403).json({ error: 'Analysts have read-only access' });
    return;
  }
  const ok = crmStore.deleteCompany(req.params.id, actor);
  if (!ok) {
    res.status(404).json({ error: 'Company not found' });
    return;
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// Contacts
// -------------------------------------------------------------
apiRouter.get('/contacts', (req: Request, res: Response) => {
  let list = crmStore.getContacts();
  const search = (req.query.search as string)?.toLowerCase();
  const companyId = req.query.companyId as string;
  const status = req.query.status as string;

  if (search) {
    list = list.filter(c => 
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.companyName.toLowerCase().includes(search) ||
      c.title.toLowerCase().includes(search)
    );
  }
  if (companyId) {
    list = list.filter(c => c.companyId === companyId);
  }
  if (status && status !== 'all') {
    list = list.filter(c => c.status === status);
  }
  res.json({ contacts: list });
});

apiRouter.get('/contacts/:id', (req: Request, res: Response) => {
  const contact = crmStore.getContactById(req.params.id);
  if (!contact) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }
  const company = crmStore.getCompanyById(contact.companyId);
  const deals = crmStore.getDeals().filter(d => d.contactId === contact.id);
  const activities = crmStore.getActivities('contact', contact.id);
  res.json({ contact, company, deals, activities });
});

apiRouter.post('/contacts', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { firstName, lastName, email, phone, companyId, title, department, status, leadSource, tags, notes, linkedinUrl } = req.body;
  if (!firstName || !email) {
    res.status(400).json({ error: 'First name and email are required' });
    return;
  }
  const company = companyId ? crmStore.getCompanyById(companyId) : undefined;
  const contact = crmStore.createContact({
    firstName,
    lastName: lastName || '',
    email,
    phone: phone || '+1 (555) 000-0000',
    companyId: companyId || '',
    companyName: company ? company.name : 'Independent',
    title: title || 'Director',
    department: department || 'Management',
    status: status || 'lead',
    leadSource: leadSource || 'direct',
    assignedToId: req.body.assignedToId || actor.id,
    tags: tags || ['New Contact'],
    notes: notes || '',
    linkedinUrl: linkedinUrl || '',
  }, actor);
  res.status(201).json({ contact });
});

apiRouter.put('/contacts/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const updated = crmStore.updateContact(req.params.id, req.body, actor);
  if (!updated) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }
  res.json({ contact: updated });
});

apiRouter.delete('/contacts/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  if (actor.role === 'analyst') {
    res.status(403).json({ error: 'Analysts have read-only access' });
    return;
  }
  const ok = crmStore.deleteContact(req.params.id, actor);
  if (!ok) {
    res.status(404).json({ error: 'Contact not found' });
    return;
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// Leads
// -------------------------------------------------------------
apiRouter.get('/leads', (req: Request, res: Response) => {
  let list = crmStore.getLeads();
  const search = (req.query.search as string)?.toLowerCase();
  const status = req.query.status as string;
  const source = req.query.source as string;

  if (search) {
    list = list.filter(l => 
      l.title.toLowerCase().includes(search) ||
      l.company.toLowerCase().includes(search) ||
      l.contactName.toLowerCase().includes(search) ||
      l.email.toLowerCase().includes(search)
    );
  }
  if (status && status !== 'all') {
    list = list.filter(l => l.status === status);
  }
  if (source && source !== 'all') {
    list = list.filter(l => l.source === source);
  }
  res.json({ leads: list });
});

apiRouter.post('/leads', async (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { title, company, contactName, email, phone, source, estimatedValue, notes, tags } = req.body;
  if (!title || !company || !contactName) {
    res.status(400).json({ error: 'Title, company, and contact name are required' });
    return;
  }

  // Calculate AI score on create
  const aiResult = await scoreLeadWithAI({
    title,
    company,
    contactName,
    source: source || 'website',
    estimatedValue: Number(estimatedValue) || 25000,
    notes: notes || '',
  });

  const lead = crmStore.createLead({
    title,
    company,
    contactName,
    email: email || `contact@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    phone: phone || '+1 (555) 012-3456',
    status: 'new',
    score: aiResult.score || 70,
    scoreRationale: aiResult.rationale,
    source: source || 'website',
    estimatedValue: Number(estimatedValue) || 25000,
    assignedToId: req.body.assignedToId || actor.id,
    notes: notes || '',
    tags: tags || ['Inbound Lead'],
  }, actor);

  res.status(201).json({ lead, aiAnalysis: aiResult });
});

apiRouter.put('/leads/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const updated = crmStore.updateLead(req.params.id, req.body, actor);
  if (!updated) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }
  res.json({ lead: updated });
});

apiRouter.post('/leads/:id/convert', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const result = crmStore.convertLead(req.params.id, req.body, actor);
  if (!result) {
    res.status(404).json({ error: 'Lead not found or conversion failed' });
    return;
  }
  res.json({ success: true, ...result });
});

apiRouter.delete('/leads/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const ok = crmStore.deleteLead(req.params.id, actor);
  if (!ok) {
    res.status(404).json({ error: 'Lead not found' });
    return;
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// Deals & Kanban Pipeline
// -------------------------------------------------------------
apiRouter.get('/deals', (req: Request, res: Response) => {
  let list = crmStore.getDeals();
  const search = (req.query.search as string)?.toLowerCase();
  const stage = req.query.stage as string;
  const assignedTo = req.query.assignedTo as string;
  const priority = req.query.priority as string;

  if (search) {
    list = list.filter(d => 
      d.title.toLowerCase().includes(search) ||
      d.companyName.toLowerCase().includes(search) ||
      d.contactName.toLowerCase().includes(search) ||
      d.tags.some(t => t.toLowerCase().includes(search))
    );
  }
  if (stage && stage !== 'all') {
    list = list.filter(d => d.stage === stage);
  }
  if (assignedTo && assignedTo !== 'all') {
    list = list.filter(d => d.assignedToId === assignedTo);
  }
  if (priority && priority !== 'all') {
    list = list.filter(d => d.priority === priority);
  }
  res.json({ deals: list });
});

apiRouter.get('/deals/:id', (req: Request, res: Response) => {
  const deal = crmStore.getDealById(req.params.id);
  if (!deal) {
    res.status(404).json({ error: 'Deal not found' });
    return;
  }
  const company = crmStore.getCompanyById(deal.companyId);
  const contact = crmStore.getContactById(deal.contactId);
  const activities = crmStore.getActivities('deal', deal.id);
  const tasks = crmStore.getTasks().filter(t => t.relatedType === 'deal' && t.relatedId === deal.id);
  res.json({ deal, company, contact, activities, tasks });
});

apiRouter.post('/deals', async (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { title, companyId, contactId, value, stage, expectedCloseDate, priority, tags, notes } = req.body;
  if (!title || !value) {
    res.status(400).json({ error: 'Deal title and value are required' });
    return;
  }

  const company = companyId ? crmStore.getCompanyById(companyId) : undefined;
  const contact = contactId ? crmStore.getContactById(contactId) : undefined;

  const newDeal = crmStore.createDeal({
    title,
    companyId: companyId || '',
    companyName: company ? company.name : req.body.companyName || 'Unknown Company',
    contactId: contactId || '',
    contactName: contact ? `${contact.firstName} ${contact.lastName}` : req.body.contactName || 'Key Contact',
    value: Number(value),
    currency: 'USD',
    stage: stage || 'discovery',
    probability: stage === 'negotiation' ? 85 : stage === 'proposal_sent' ? 65 : stage === 'demo_scheduled' ? 50 : 30,
    expectedCloseDate: expectedCloseDate || new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0],
    priority: priority || 'medium',
    assignedToId: req.body.assignedToId || actor.id,
    tags: tags || ['Enterprise Deal'],
    notes: notes || '',
  }, actor);

  res.status(201).json({ deal: newDeal });
});

apiRouter.put('/deals/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const updated = crmStore.updateDeal(req.params.id, req.body, actor);
  if (!updated) {
    res.status(404).json({ error: 'Deal not found' });
    return;
  }
  res.json({ deal: updated });
});

apiRouter.patch('/deals/:id/stage', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { stage, lossReason, probability } = req.body;
  if (!stage) {
    res.status(400).json({ error: 'New stage is required' });
    return;
  }
  const updated = crmStore.updateDealStage(req.params.id, stage as DealStage, actor, {
    lossReason,
    probability,
  });
  if (!updated) {
    res.status(404).json({ error: 'Deal not found' });
    return;
  }
  res.json({ deal: updated });
});

apiRouter.delete('/deals/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  if (actor.role === 'analyst') {
    res.status(403).json({ error: 'Analysts have read-only access' });
    return;
  }
  const ok = crmStore.deleteDeal(req.params.id, actor);
  if (!ok) {
    res.status(404).json({ error: 'Deal not found' });
    return;
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// Tasks & Reminders
// -------------------------------------------------------------
apiRouter.get('/tasks', (req: Request, res: Response) => {
  let list = crmStore.getTasks();
  const status = req.query.status as string;
  const assignedTo = req.query.assignedTo as string;

  if (status && status !== 'all') {
    list = list.filter(t => t.status === status);
  }
  if (assignedTo && assignedTo !== 'all') {
    list = list.filter(t => t.assignedToId === assignedTo);
  }
  res.json({ tasks: list });
});

apiRouter.post('/tasks', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { title, description, dueDate, priority, relatedType, relatedId, relatedTitle, assignedToId } = req.body;
  if (!title) {
    res.status(400).json({ error: 'Task title is required' });
    return;
  }
  const task = crmStore.createTask({
    title,
    description: description || '',
    dueDate: dueDate || new Date(Date.now() + 3 * 86400000).toISOString(),
    priority: priority || 'medium',
    status: 'todo',
    relatedType: relatedType || 'general',
    relatedId: relatedId || undefined,
    relatedTitle: relatedTitle || undefined,
    assignedToId: assignedToId || actor.id,
  }, actor);
  res.status(201).json({ task });
});

apiRouter.put('/tasks/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const updated = crmStore.updateTask(req.params.id, req.body, actor);
  if (!updated) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json({ task: updated });
});

apiRouter.patch('/tasks/:id/status', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { status } = req.body;
  const updated = crmStore.updateTask(req.params.id, { status }, actor);
  if (!updated) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json({ task: updated });
});

apiRouter.delete('/tasks/:id', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const ok = crmStore.deleteTask(req.params.id, actor);
  if (!ok) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }
  res.json({ success: true });
});

// -------------------------------------------------------------
// Activities (Notes, Calls, Meetings, Timeline)
// -------------------------------------------------------------
apiRouter.get('/activities', (req: Request, res: Response) => {
  const { relatedType, relatedId } = req.query as { relatedType?: string; relatedId?: string };
  const activities = crmStore.getActivities(relatedType, relatedId);
  res.json({ activities });
});

apiRouter.post('/activities', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { type, title, description, relatedType, relatedId, relatedTitle, durationMinutes, outcome } = req.body;
  if (!type || !title) {
    res.status(400).json({ error: 'Activity type and title are required' });
    return;
  }
  const activity = crmStore.createActivity({
    type,
    title,
    description: description || '',
    relatedType: relatedType || 'general',
    relatedId: relatedId || 'gen',
    relatedTitle: relatedTitle || undefined,
    durationMinutes: Number(durationMinutes) || undefined,
    outcome: outcome || undefined,
    createdById: actor.id,
    createdByName: actor.name,
  });
  res.status(201).json({ activity });
});

// -------------------------------------------------------------
// Email Hub & Dispatch Architecture
// -------------------------------------------------------------
apiRouter.get('/emails/templates', (_req: Request, res: Response) => {
  res.json({ templates: crmStore.getEmailTemplates() });
});

apiRouter.get('/emails/logs', (_req: Request, res: Response) => {
  res.json({ logs: crmStore.getEmailLogs() });
});

apiRouter.post('/emails/send', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { to, cc, bcc, subject, body, templateId, relatedType, relatedId } = req.body;
  if (!to || !subject || !body) {
    res.status(400).json({ error: 'Recipient, subject, and message body are required' });
    return;
  }
  const sent = crmStore.sendEmail({
    to,
    cc,
    bcc,
    subject,
    body,
    templateId,
    relatedType,
    relatedId,
  }, actor);
  res.status(201).json({ email: sent });
});

// -------------------------------------------------------------
// Notifications
// -------------------------------------------------------------
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  res.json({ notifications: crmStore.getNotifications(actor.id) });
});

apiRouter.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const ok = crmStore.markNotificationRead(req.params.id);
  res.json({ success: ok });
});

apiRouter.post('/notifications/read-all', (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  crmStore.markAllNotificationsRead(actor.id);
  res.json({ success: true });
});

// -------------------------------------------------------------
// Audit Logs
// -------------------------------------------------------------
apiRouter.get('/audit-logs', (_req: Request, res: Response) => {
  res.json({ auditLogs: crmStore.getAuditLogs() });
});

// -------------------------------------------------------------
// Global Search (Cmd+K)
// -------------------------------------------------------------
apiRouter.get('/search', (req: Request, res: Response) => {
  const q = (req.query.q as string)?.toLowerCase().trim();
  if (!q) {
    res.json({ results: [] });
    return;
  }

  const deals = crmStore.getDeals()
    .filter(d => d.title.toLowerCase().includes(q) || d.companyName.toLowerCase().includes(q))
    .slice(0, 5)
    .map(d => ({ type: 'deal', id: d.id, title: d.title, subtitle: `${d.companyName} • $${d.value.toLocaleString()} (${d.stage})`, link: '/deals' }));

  const contacts = crmStore.getContacts()
    .filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    .slice(0, 5)
    .map(c => ({ type: 'contact', id: c.id, title: `${c.firstName} ${c.lastName}`, subtitle: `${c.title} at ${c.companyName}`, link: '/contacts' }));

  const companies = crmStore.getCompanies()
    .filter(c => c.name.toLowerCase().includes(q) || c.domain.toLowerCase().includes(q))
    .slice(0, 5)
    .map(c => ({ type: 'company', id: c.id, title: c.name, subtitle: `${c.industry} • ${c.city}, ${c.country}`, link: '/companies' }));

  const leads = crmStore.getLeads()
    .filter(l => l.title.toLowerCase().includes(q) || l.company.toLowerCase().includes(q))
    .slice(0, 5)
    .map(l => ({ type: 'lead', id: l.id, title: l.title, subtitle: `${l.company} • Score: ${l.score}/100`, link: '/leads' }));

  res.json({
    results: [...deals, ...contacts, ...companies, ...leads],
  });
});

// -------------------------------------------------------------
// Analytics & Forecasting
// -------------------------------------------------------------
apiRouter.get('/analytics/dashboard', (_req: Request, res: Response) => {
  res.json({ metrics: crmStore.getDashboardMetrics() });
});

apiRouter.get('/analytics/forecast', (_req: Request, res: Response) => {
  res.json({ forecast: crmStore.getForecastData() });
});

// -------------------------------------------------------------
// AI Sales Copilot (Gemini API Integration)
// -------------------------------------------------------------
apiRouter.post('/ai/lead-score', async (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { title, company, contactName, source, estimatedValue, notes } = req.body;
  const analysis = await scoreLeadWithAI({
    title: title || 'Enterprise Opportunity',
    company: company || 'Prospect Corp',
    contactName: contactName || 'Executive Lead',
    source: source || 'inbound',
    estimatedValue: Number(estimatedValue) || 50000,
    notes: notes || '',
  });

  crmStore.recordAuditLog({
    actorId: actor.id,
    actorName: actor.name,
    action: 'ai_analysis',
    entityType: 'lead',
    entityId: 'ai_eval',
    entityName: company || title,
    details: `Generated AI Lead Scoring assessment (${analysis.score}/100, ${analysis.icpFit} fit).`,
  });

  res.json({ analysis });
});

apiRouter.post('/ai/deal-copilot', async (req: Request, res: Response) => {
  const actor = getCurrentUser(req);
  const { dealId } = req.body;
  const deal = dealId ? crmStore.getDealById(dealId) : undefined;

  const activities = dealId ? crmStore.getActivities('deal', dealId) : [];
  const daysInPipeline = deal ? Math.max(1, Math.round((Date.now() - new Date(deal.createdAt).getTime()) / 86400000)) : 14;

  const analysis = await analyzeDealCopilot({
    title: deal ? deal.title : req.body.title || 'Deal Analysis',
    companyName: deal ? deal.companyName : req.body.companyName || 'Target Corp',
    value: deal ? deal.value : Number(req.body.value) || 100000,
    stage: deal ? deal.stage : req.body.stage || 'proposal_sent',
    probability: deal ? deal.probability : 60,
    priority: deal ? deal.priority : 'high',
    notes: deal?.notes || req.body.notes,
    activitiesCount: activities.length,
    daysInPipeline,
  });

  if (deal) {
    crmStore.updateDeal(deal.id, {
      aiRiskScore: analysis.riskScore,
      aiWinRecommendation: analysis.winRecommendation,
    }, actor);
  }

  crmStore.recordAuditLog({
    actorId: actor.id,
    actorName: actor.name,
    action: 'ai_analysis',
    entityType: 'deal',
    entityId: deal?.id || 'deal_eval',
    entityName: deal?.title || 'Pipeline Deal',
    details: `Ran AI Deal Copilot risk assessment (Risk score: ${analysis.riskScore}/100).`,
  });

  res.json({ analysis });
});

apiRouter.post('/ai/draft-email', async (req: Request, res: Response) => {
  const { purpose, recipientName, recipientCompany, dealOrLeadTitle, tone, keyPoints } = req.body;
  const draft = await draftSalesEmail({
    purpose: purpose || 'Follow up after product demonstration',
    recipientName: recipientName || 'Prospective Client',
    recipientCompany: recipientCompany || 'Enterprise Inc',
    dealOrLeadTitle,
    tone: tone || 'consultative',
    keyPoints,
  });
  res.json({ draft });
});

apiRouter.post('/ai/extract-notes', async (req: Request, res: Response) => {
  const { rawNotes } = req.body;
  if (!rawNotes) {
    res.status(400).json({ error: 'rawNotes string is required' });
    return;
  }
  const extracted = await extractMeetingNotes(rawNotes);
  res.json({ extracted });
});

// -------------------------------------------------------------
// System & Automated Tests
// -------------------------------------------------------------
apiRouter.post('/system/reset-demo-data', (_req: Request, res: Response) => {
  const db = crmStore.resetToDefaultSeed();
  res.json({ success: true, message: 'Database reset to initial enterprise demo state', db });
});

apiRouter.get('/system/tests/run', (_req: Request, res: Response) => {
  const testResults = crmStore.runAutomatedTests();
  res.json({ testResults });
});

apiRouter.get('/system/export-data', (_req: Request, res: Response) => {
  const data = {
    users: crmStore.getUsers(),
    companies: crmStore.getCompanies(),
    contacts: crmStore.getContacts(),
    leads: crmStore.getLeads(),
    deals: crmStore.getDeals(),
    tasks: crmStore.getTasks(),
    activities: crmStore.getActivities(),
    auditLogs: crmStore.getAuditLogs(),
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
  };
  res.setHeader('Content-Disposition', 'attachment; filename="nexus_crm_export.json"');
  res.setHeader('Content-Type', 'application/json');
  res.json(data);
});
