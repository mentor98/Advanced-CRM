// Comprehensive CRM TypeScript Types & Interfaces

export type UserRole = 'admin' | 'sales_manager' | 'sales_rep' | 'marketing' | 'analyst';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  phone: string;
  quota: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

export type CompanyStatus = 'active' | 'prospect' | 'customer' | 'churned' | 'partner';

export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: string; // e.g. "50-200", "500-1000"
  annualRevenue: number;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: CompanyStatus;
  assignedToId: string;
  tags: string[];
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type ContactStatus = 'lead' | 'active_customer' | 'evangelist' | 'inactive' | 'unqualified';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: string;
  companyName: string;
  title: string;
  department: string;
  status: ContactStatus;
  leadSource: string;
  assignedToId: string;
  tags: string[];
  notes?: string;
  linkedinUrl?: string;
  lastContactedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
export type LeadSource = 'website' | 'referral' | 'linkedin' | 'cold_outreach' | 'event' | 'inbound' | 'partner';

export interface Lead {
  id: string;
  title: string;
  company: string;
  contactName: string;
  email: string;
  phone: string;
  status: LeadStatus;
  score: number; // 0 - 100 calculated by CRM / AI
  scoreRationale?: string;
  source: LeadSource;
  estimatedValue: number;
  assignedToId: string;
  notes: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  convertedDealId?: string;
  convertedCompanyId?: string;
  convertedContactId?: string;
}

export type DealStage = 
  | 'discovery'
  | 'qualification'
  | 'demo_scheduled'
  | 'proposal_sent'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Deal {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number; // 0 - 100
  expectedCloseDate: string;
  closedAt?: string;
  lossReason?: string;
  priority: Priority;
  assignedToId: string;
  tags: string[];
  notes?: string;
  aiRiskScore?: number; // 0 - 100
  aiWinRecommendation?: string;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled';
export type EntityType = 'deal' | 'contact' | 'company' | 'lead' | 'general';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: Priority;
  status: TaskStatus;
  relatedType: EntityType;
  relatedId?: string;
  relatedTitle?: string;
  assignedToId: string;
  reminderAt?: string;
  createdAt: string;
  completedAt?: string;
}

export type ActivityType = 'note' | 'call' | 'meeting' | 'email' | 'stage_change' | 'deal_created' | 'task_completed' | 'lead_converted';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  relatedType: EntityType;
  relatedId: string;
  relatedTitle?: string;
  durationMinutes?: number;
  outcome?: string;
  createdById: string;
  createdByName: string;
  createdAt: string;
}

export type EmailStatus = 'draft' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced';

export interface EmailLog {
  id: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  templateId?: string;
  status: EmailStatus;
  sentAt: string;
  relatedType?: EntityType;
  relatedId?: string;
  senderId: string;
  senderName: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: 'outreach' | 'followup' | 'proposal' | 'meeting' | 'closing' | 'retention';
  variables: string[];
}

export type NotificationType = 'info' | 'success' | 'warning' | 'deal_won' | 'task_due' | 'mention' | 'lead_alert';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: 'create' | 'update' | 'delete' | 'stage_change' | 'export' | 'auth_login' | 'ai_analysis' | 'convert';
  entityType: 'deal' | 'contact' | 'company' | 'lead' | 'task' | 'user' | 'email' | 'system';
  entityId: string;
  entityName: string;
  details: string;
  changes?: {
    field: string;
    oldVal: any;
    newVal: any;
  }[];
  createdAt: string;
}

export interface DashboardMetrics {
  totalPipelineValue: number;
  weightedPipelineValue: number;
  closedWonYTD: number;
  winRatePercentage: number;
  activeDealsCount: number;
  openLeadsCount: number;
  avgDealSize: number;
  avgSalesCycleDays: number;
  revenueByMonth: { month: string; target: number; actual: number; forecast: number }[];
  dealsByStage: { stage: DealStage; label: string; count: number; value: number; probability: number }[];
  dealsByRep: { repId: string; repName: string; avatar: string; dealCount: number; pipelineValue: number; wonValue: number; quota: number; attainment: number }[];
  leadsBySource: { source: string; count: number; percentage: number }[];
  winLossRatio: { won: number; lost: number; winRate: number };
}

export interface ForecastData {
  period: string;
  quarterTarget: number;
  committedRevenue: number;
  bestCaseRevenue: number;
  weightedPipeline: number;
  stageBreakdown: { stage: string; value: number; weightedValue: number; count: number }[];
  repForecast: {
    repId: string;
    repName: string;
    quota: number;
    closedWon: number;
    weightedPipeline: number;
    projectedTotal: number;
    attainmentPct: number;
  }[];
}

export interface TestResultItem {
  id: string;
  name: string;
  category: 'AUTH' | 'COMPANIES' | 'CONTACTS' | 'LEADS' | 'DEALS' | 'TASKS' | 'EMAILS' | 'AUDIT' | 'SECURITY' | 'INTEGRITY';
  passed: boolean;
  durationMs: number;
  details: string;
  error?: string;
}

export interface TestSuiteResult {
  total: number;
  passed: number;
  failed: number;
  durationMs: number;
  timestamp: string;
  results: TestResultItem[];
}
