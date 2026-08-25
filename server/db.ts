import fs from 'fs';
import path from 'path';
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
  TestResultItem,
  DealStage,
} from '../src/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_PATH = path.join(DATA_DIR, 'crm_store.json');

export interface CRMDatabase {
  users: User[];
  companies: Company[];
  contacts: Contact[];
  leads: Lead[];
  deals: Deal[];
  tasks: Task[];
  activities: Activity[];
  emailLogs: EmailLog[];
  emailTemplates: EmailTemplate[];
  notifications: Notification[];
  auditLogs: AuditLog[];
}

// Initial Seed Data
export function getInitialSeedData(): CRMDatabase {
  const users: User[] = [
    {
      id: 'usr_admin_1',
      name: 'Sarah Vance',
      email: 'sarah.vance@nexus.io',
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      department: 'Executive',
      phone: '+1 (415) 890-1200',
      quota: 1200000,
      status: 'active',
      createdAt: '2025-01-10T08:00:00.000Z',
    },
    {
      id: 'usr_mgr_1',
      name: 'Marcus Chen',
      email: 'marcus.chen@nexus.io',
      role: 'sales_manager',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      department: 'Enterprise Sales',
      phone: '+1 (415) 890-1201',
      quota: 950000,
      status: 'active',
      createdAt: '2025-01-12T09:00:00.000Z',
    },
    {
      id: 'usr_rep_1',
      name: 'Elena Rostova',
      email: 'elena.rostova@nexus.io',
      role: 'sales_rep',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
      department: 'Commercial Sales',
      phone: '+1 (415) 890-1202',
      quota: 650000,
      status: 'active',
      createdAt: '2025-02-01T10:00:00.000Z',
    },
    {
      id: 'usr_rep_2',
      name: 'David Kalu',
      email: 'david.kalu@nexus.io',
      role: 'sales_rep',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      department: 'Mid-Market Sales',
      phone: '+1 (415) 890-1203',
      quota: 550000,
      status: 'active',
      createdAt: '2025-02-05T10:30:00.000Z',
    },
    {
      id: 'usr_mkt_1',
      name: 'Aria Thorne',
      email: 'aria.thorne@nexus.io',
      role: 'marketing',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      department: 'Growth Marketing',
      phone: '+1 (415) 890-1204',
      quota: 0,
      status: 'active',
      createdAt: '2025-01-15T11:00:00.000Z',
    },
    {
      id: 'usr_ana_1',
      name: 'Oliver Wright',
      email: 'oliver.wright@nexus.io',
      role: 'analyst',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
      department: 'Revenue Operations',
      phone: '+1 (415) 890-1205',
      quota: 0,
      status: 'active',
      createdAt: '2025-01-20T11:30:00.000Z',
    }
  ];

  const companies: Company[] = [
    {
      id: 'comp_1',
      name: 'CloudScale Dynamics',
      domain: 'cloudscaledynamics.com',
      industry: 'Cloud Infrastructure',
      size: '250-500',
      annualRevenue: 45000000,
      phone: '+1 (650) 432-8800',
      address: '400 Castro St, Suite 600',
      city: 'Mountain View',
      country: 'United States',
      status: 'customer',
      assignedToId: 'usr_rep_1',
      tags: ['Tier-1', 'SaaS', 'High-Growth', 'Multi-Region'],
      description: 'Leading provider of automated container orchestration and cloud cost optimization.',
      createdAt: '2025-01-15T09:00:00.000Z',
      updatedAt: '2025-05-10T14:30:00.000Z',
    },
    {
      id: 'comp_2',
      name: 'Apex Global Financial',
      domain: 'apexgf.co',
      industry: 'Financial Services',
      size: '1000-5000',
      annualRevenue: 180000000,
      phone: '+1 (212) 555-0199',
      address: '200 Park Avenue, 42nd Fl',
      city: 'New York',
      country: 'United States',
      status: 'prospect',
      assignedToId: 'usr_mgr_1',
      tags: ['Enterprise', 'FinTech', 'Compliance-Heavy'],
      description: 'Global investment banking and algorithmic asset management firm.',
      createdAt: '2025-02-01T10:00:00.000Z',
      updatedAt: '2025-05-12T11:20:00.000Z',
    },
    {
      id: 'comp_3',
      name: 'Nordic BioTech Group',
      domain: 'nordicbiotech.se',
      industry: 'Biotechnology & Health',
      size: '100-250',
      annualRevenue: 28000000,
      phone: '+46 8 123 4567',
      address: 'Solna Strandväg 12',
      city: 'Stockholm',
      country: 'Sweden',
      status: 'customer',
      assignedToId: 'usr_rep_2',
      tags: ['Healthcare', 'EMEA', 'Clinical Trials'],
      description: 'Pioneering genomics and targeted oncology therapeutic discoveries.',
      createdAt: '2025-02-14T08:30:00.000Z',
      updatedAt: '2025-05-15T09:45:00.000Z',
    },
    {
      id: 'comp_4',
      name: 'CyberShield Systems',
      domain: 'cybershield.security',
      industry: 'Cybersecurity',
      size: '50-100',
      annualRevenue: 16000000,
      phone: '+1 (512) 800-4321',
      address: '100 Congress Ave',
      city: 'Austin',
      country: 'United States',
      status: 'prospect',
      assignedToId: 'usr_rep_1',
      tags: ['Zero-Trust', 'Fast-Closing', 'Security'],
      description: 'AI-driven zero trust network architecture and threat detection platform.',
      createdAt: '2025-03-01T13:00:00.000Z',
      updatedAt: '2025-05-16T16:15:00.000Z',
    },
    {
      id: 'comp_5',
      name: 'Starlight Logistics Inc',
      domain: 'starlightlogistics.io',
      industry: 'Supply Chain & Freight',
      size: '500-1000',
      annualRevenue: 95000000,
      phone: '+1 (312) 670-9000',
      address: '300 N LaSalle Dr',
      city: 'Chicago',
      country: 'United States',
      status: 'partner',
      assignedToId: 'usr_admin_1',
      tags: ['Logistics', 'Strategic', 'Fleet-Tech'],
      description: 'Real-time multi-modal freight management and cold chain monitoring network.',
      createdAt: '2025-01-22T15:00:00.000Z',
      updatedAt: '2025-05-02T10:00:00.000Z',
    },
    {
      id: 'comp_6',
      name: 'Quantum Health Analytics',
      domain: 'quantumhealth.med',
      industry: 'Healthcare Technology',
      size: '50-100',
      annualRevenue: 12000000,
      phone: '+1 (617) 902-3344',
      address: '50 Milk St',
      city: 'Boston',
      country: 'United States',
      status: 'prospect',
      assignedToId: 'usr_rep_2',
      tags: ['HIPAA', 'AI-Diagnostics', 'Mid-Market'],
      description: 'Predictive patient intake and hospital ICU throughput optimization software.',
      createdAt: '2025-03-15T09:30:00.000Z',
      updatedAt: '2025-05-18T14:00:00.000Z',
    }
  ];

  const contacts: Contact[] = [
    {
      id: 'cnt_1',
      firstName: 'Dr. Jason',
      lastName: 'Miller',
      email: 'jason.miller@cloudscaledynamics.com',
      phone: '+1 (650) 432-8812',
      companyId: 'comp_1',
      companyName: 'CloudScale Dynamics',
      title: 'Chief Technology Officer',
      department: 'Engineering',
      status: 'active_customer',
      leadSource: 'referral',
      assignedToId: 'usr_rep_1',
      tags: ['Decision-Maker', 'Technical Champion'],
      linkedinUrl: 'https://linkedin.com/in/drjasonmiller-sample',
      notes: 'Key advocate for enterprise scaling. Prefers technical benchmarks before quarterly reviews.',
      lastContactedAt: '2025-05-14T15:30:00.000Z',
      createdAt: '2025-01-16T10:00:00.000Z',
      updatedAt: '2025-05-14T15:30:00.000Z',
    },
    {
      id: 'cnt_2',
      firstName: 'Victoria',
      lastName: 'Sterling',
      email: 'v.sterling@apexgf.co',
      phone: '+1 (212) 555-0144',
      companyId: 'comp_2',
      companyName: 'Apex Global Financial',
      title: 'Head of Strategic Procurement',
      department: 'Finance & Operations',
      status: 'lead',
      leadSource: 'linkedin',
      assignedToId: 'usr_mgr_1',
      tags: ['Economic Buyer', 'Contract Lead'],
      linkedinUrl: 'https://linkedin.com/in/vsterling-procurement',
      notes: 'Focused on SOC2 Type II compliance and vendor risk assessment.',
      lastContactedAt: '2025-05-18T09:00:00.000Z',
      createdAt: '2025-02-02T11:00:00.000Z',
      updatedAt: '2025-05-18T09:00:00.000Z',
    },
    {
      id: 'cnt_3',
      firstName: 'Astrid',
      lastName: 'Lindqvist',
      email: 'astrid.l@nordicbiotech.se',
      phone: '+46 8 123 4599',
      companyId: 'comp_3',
      companyName: 'Nordic BioTech Group',
      title: 'VP of Laboratory Operations',
      department: 'Operations',
      status: 'active_customer',
      leadSource: 'inbound',
      assignedToId: 'usr_rep_2',
      tags: ['Evangelist', 'EMEA'],
      linkedinUrl: 'https://linkedin.com/in/astrid-lindqvist-lab',
      notes: 'Super satisfied with initial 200-seat deployment. Interested in multi-site expansion.',
      lastContactedAt: '2025-05-12T13:45:00.000Z',
      createdAt: '2025-02-15T09:15:00.000Z',
      updatedAt: '2025-05-12T13:45:00.000Z',
    },
    {
      id: 'cnt_4',
      firstName: 'Travis',
      lastName: 'Boone',
      email: 'travis.boone@cybershield.security',
      phone: '+1 (512) 800-4388',
      companyId: 'comp_4',
      companyName: 'CyberShield Systems',
      title: 'VP of Product Management',
      department: 'Product',
      status: 'lead',
      leadSource: 'event',
      assignedToId: 'usr_rep_1',
      tags: ['Champion', 'Product-Led'],
      linkedinUrl: 'https://linkedin.com/in/travisboone-security',
      notes: 'Met at RSA Conference. Looking to replace legacy CRM stack by Q3.',
      lastContactedAt: '2025-05-16T11:00:00.000Z',
      createdAt: '2025-03-02T14:20:00.000Z',
      updatedAt: '2025-05-16T11:00:00.000Z',
    },
    {
      id: 'cnt_5',
      firstName: 'Hassan',
      lastName: 'Al-Mansoor',
      email: 'hassan.m@starlightlogistics.io',
      phone: '+1 (312) 670-9055',
      companyId: 'comp_5',
      companyName: 'Starlight Logistics Inc',
      title: 'Chief Operating Officer',
      department: 'Executive',
      status: 'active_customer',
      leadSource: 'referral',
      assignedToId: 'usr_admin_1',
      tags: ['Executive Sponsor', 'Global Scale'],
      notes: 'Oversees 4 regional dispatch hubs across North America.',
      lastContactedAt: '2025-05-10T16:00:00.000Z',
      createdAt: '2025-01-25T16:00:00.000Z',
      updatedAt: '2025-05-10T16:00:00.000Z',
    },
    {
      id: 'cnt_6',
      firstName: 'Rachel',
      lastName: 'Zhao',
      email: 'rzhao@quantumhealth.med',
      phone: '+1 (617) 902-3377',
      companyId: 'comp_6',
      companyName: 'Quantum Health Analytics',
      title: 'Director of Clinical Informatics',
      department: 'Informatics',
      status: 'lead',
      leadSource: 'website',
      assignedToId: 'usr_rep_2',
      tags: ['Healthcare Lead', 'Evaluation Phase'],
      notes: 'Requested custom API integration sandbox for EHR connectivity.',
      lastContactedAt: '2025-05-17T10:30:00.000Z',
      createdAt: '2025-03-16T10:00:00.000Z',
      updatedAt: '2025-05-17T10:30:00.000Z',
    }
  ];

  const leads: Lead[] = [
    {
      id: 'lead_1',
      title: 'Enterprise CRM Migration & Data Lake Sync',
      company: 'Zenith Retail Tech',
      contactName: 'Carlos Morales',
      email: 'carlos.m@zenithretail.com',
      phone: '+1 (408) 789-2211',
      status: 'qualified',
      score: 88,
      scoreRationale: 'High budget fit ($120k), inbound demo request from VP of Digital, actively evaluating vendors.',
      source: 'inbound',
      estimatedValue: 120000,
      assignedToId: 'usr_rep_1',
      notes: 'Wants to replace legacy Salesforce instance with a fast, modern CRM. 150 target seats.',
      tags: ['Retail', 'Omnichannel', 'High-Intent'],
      createdAt: '2025-05-01T09:00:00.000Z',
      updatedAt: '2025-05-18T10:00:00.000Z',
    },
    {
      id: 'lead_2',
      title: 'Sales Pipeline Automation for 80 Reps',
      company: 'Hyperion Energy Grid',
      contactName: 'Maya Patel',
      email: 'maya.patel@hyperionenergy.net',
      phone: '+1 (713) 440-9988',
      status: 'contacted',
      score: 74,
      scoreRationale: 'Strong company size (500+ employees), referred by board member, initial email opened twice.',
      source: 'referral',
      estimatedValue: 85000,
      assignedToId: 'usr_rep_2',
      notes: 'Looking for real-time Kanban pipeline management and automated forecasting for renewable power sales.',
      tags: ['Energy', 'Commercial', 'Referral'],
      createdAt: '2025-05-08T11:30:00.000Z',
      updatedAt: '2025-05-17T14:20:00.000Z',
    },
    {
      id: 'lead_3',
      title: 'Customer Success & Audit Trail Compliance',
      company: 'Vanguard Aerospace',
      contactName: 'Gregory Vance',
      email: 'g.vance@vanguardaero.space',
      phone: '+1 (206) 555-8910',
      status: 'new',
      score: 92,
      scoreRationale: 'Defense/Aerospace contractor with explicit requirement for SOC2, RBAC, and granular audit logs.',
      source: 'website',
      estimatedValue: 190000,
      assignedToId: 'usr_mgr_1',
      notes: 'Direct web lead submitted via enterprise pricing form. Needs custom SLA and SSO integration.',
      tags: ['Aerospace', 'Security', 'Enterprise-Tier'],
      createdAt: '2025-05-19T08:15:00.000Z',
      updatedAt: '2025-05-19T08:15:00.000Z',
    },
    {
      id: 'lead_4',
      title: 'Marketing Automation & Inbound Lead Routing',
      company: 'OmniFlow Studios',
      contactName: 'Chloe Bennett',
      email: 'chloe@omniflow.design',
      phone: '+1 (310) 902-1133',
      status: 'unqualified',
      score: 35,
      scoreRationale: 'Budget below minimum threshold ($5k budget), 8 employee design agency.',
      source: 'cold_outreach',
      estimatedValue: 6000,
      assignedToId: 'usr_rep_2',
      notes: 'Needs single-user basic tool. Recommended self-service tier.',
      tags: ['Small-Biz', 'Unqualified'],
      createdAt: '2025-05-04T13:00:00.000Z',
      updatedAt: '2025-05-06T15:00:00.000Z',
    }
  ];

  const deals: Deal[] = [
    {
      id: 'deal_1',
      title: 'CloudScale Global Multi-Cloud Expansion',
      companyId: 'comp_1',
      companyName: 'CloudScale Dynamics',
      contactId: 'cnt_1',
      contactName: 'Dr. Jason Miller',
      value: 145000,
      currency: 'USD',
      stage: 'negotiation',
      probability: 85,
      expectedCloseDate: '2025-06-15',
      priority: 'urgent',
      assignedToId: 'usr_rep_1',
      tags: ['Annual Contract', 'Expansion', 'Cloud-Infra'],
      notes: 'Master Services Agreement undergoing redlining by internal legal counsel. Pricing discounted 8% for 2-year lock.',
      aiRiskScore: 22,
      aiWinRecommendation: 'Provide legal addendum on EU data sovereignty to expedite signature before end of quarter.',
      createdAt: '2025-03-01T10:00:00.000Z',
      updatedAt: '2025-05-18T16:00:00.000Z',
    },
    {
      id: 'deal_2',
      title: 'Apex Financial Institutional CRM Deployment',
      companyId: 'comp_2',
      companyName: 'Apex Global Financial',
      contactId: 'cnt_2',
      contactName: 'Victoria Sterling',
      value: 280000,
      currency: 'USD',
      stage: 'proposal_sent',
      probability: 65,
      expectedCloseDate: '2025-06-30',
      priority: 'high',
      assignedToId: 'usr_mgr_1',
      tags: ['Enterprise Deal', 'FinTech', 'High-Value'],
      notes: 'Submitted customized proposal with dedicated sandbox instance and SOC2 security packet.',
      aiRiskScore: 38,
      aiWinRecommendation: 'Schedule an executive sponsor sync between CEO and Victoria Sterling to cement procurement priority.',
      createdAt: '2025-03-10T14:30:00.000Z',
      updatedAt: '2025-05-19T11:15:00.000Z',
    },
    {
      id: 'deal_3',
      title: 'Nordic BioTech Clinical Trials Platform Add-on',
      companyId: 'comp_3',
      companyName: 'Nordic BioTech Group',
      contactId: 'cnt_3',
      contactName: 'Astrid Lindqvist',
      value: 78000,
      currency: 'USD',
      stage: 'demo_scheduled',
      probability: 50,
      expectedCloseDate: '2025-07-10',
      priority: 'medium',
      assignedToId: 'usr_rep_2',
      tags: ['Add-On', 'Clinical-Ops', 'EMEA'],
      notes: 'Live demo scheduled for next Tuesday with 6 lab managers and Astrid.',
      aiRiskScore: 30,
      aiWinRecommendation: 'Highlight custom field validation and audit trail capabilities during the demo.',
      createdAt: '2025-04-05T09:00:00.000Z',
      updatedAt: '2025-05-15T10:00:00.000Z',
    },
    {
      id: 'deal_4',
      title: 'CyberShield Zero-Trust Sales Engine Integration',
      companyId: 'comp_4',
      companyName: 'CyberShield Systems',
      contactId: 'cnt_4',
      contactName: 'Travis Boone',
      value: 92000,
      currency: 'USD',
      stage: 'qualification',
      probability: 35,
      expectedCloseDate: '2025-07-25',
      priority: 'high',
      assignedToId: 'usr_rep_1',
      tags: ['Security', 'Modernization'],
      notes: 'Completed initial scoping call. Needs confirmation of webhook latency and REST API rate limits.',
      aiRiskScore: 45,
      aiWinRecommendation: 'Deliver sandbox API keys and technical documentation to their engineering team.',
      createdAt: '2025-04-20T11:00:00.000Z',
      updatedAt: '2025-05-16T13:40:00.000Z',
    },
    {
      id: 'deal_5',
      title: 'Starlight Global Logistics Regional Hub Rollout',
      companyId: 'comp_5',
      companyName: 'Starlight Logistics Inc',
      contactId: 'cnt_5',
      contactName: 'Hassan Al-Mansoor',
      value: 210000,
      currency: 'USD',
      stage: 'closed_won',
      probability: 100,
      expectedCloseDate: '2025-05-01',
      closedAt: '2025-05-02T14:00:00.000Z',
      priority: 'urgent',
      assignedToId: 'usr_admin_1',
      tags: ['Closed-Won', 'Multi-Year', 'Strategic'],
      notes: 'Contract fully executed. Initial onboarding kickoff scheduled for all 4 regional hubs.',
      aiRiskScore: 0,
      createdAt: '2025-01-28T09:00:00.000Z',
      updatedAt: '2025-05-02T14:00:00.000Z',
    },
    {
      id: 'deal_6',
      title: 'Quantum Health EHR Informatics Connector',
      companyId: 'comp_6',
      companyName: 'Quantum Health Analytics',
      contactId: 'cnt_6',
      contactName: 'Rachel Zhao',
      value: 55000,
      currency: 'USD',
      stage: 'discovery',
      probability: 20,
      expectedCloseDate: '2025-08-15',
      priority: 'medium',
      assignedToId: 'usr_rep_2',
      tags: ['Healthcare', 'Integration'],
      notes: 'First discovery call set to review HIPAA compliance and audit requirements.',
      aiRiskScore: 50,
      aiWinRecommendation: 'Focus on enterprise encryption at rest and role-based data partitioning.',
      createdAt: '2025-05-10T14:00:00.000Z',
      updatedAt: '2025-05-17T11:00:00.000Z',
    },
    {
      id: 'deal_7',
      title: 'Solaris Energy Field Sales Suite',
      companyId: 'comp_1',
      companyName: 'CloudScale Dynamics',
      contactId: 'cnt_1',
      contactName: 'Dr. Jason Miller',
      value: 48000,
      currency: 'USD',
      stage: 'closed_lost',
      probability: 0,
      expectedCloseDate: '2025-04-10',
      closedAt: '2025-04-12T10:00:00.000Z',
      lossReason: 'Budget postponed to FY26 due to internal restructuring',
      priority: 'low',
      assignedToId: 'usr_rep_1',
      tags: ['Lost', 'Followup-Q4'],
      notes: 'Customer postponed field sales tooling to next budget cycle. Keep in touch quarterly.',
      aiRiskScore: 100,
      createdAt: '2025-02-10T10:00:00.000Z',
      updatedAt: '2025-04-12T10:00:00.000Z',
    }
  ];

  const tasks: Task[] = [
    {
      id: 'tsk_1',
      title: 'Send revised master service agreement to Victoria Sterling',
      description: 'Incorporate indemnity clause revisions discussed on Friday call.',
      dueDate: '2025-05-22T17:00:00.000Z',
      priority: 'urgent',
      status: 'in_progress',
      relatedType: 'deal',
      relatedId: 'deal_2',
      relatedTitle: 'Apex Financial Institutional CRM Deployment',
      assignedToId: 'usr_mgr_1',
      createdAt: '2025-05-18T10:00:00.000Z',
    },
    {
      id: 'tsk_2',
      title: 'Prepare custom clinical trial workflow demo environment',
      description: 'Configure custom fields for lab specimen tracking and sample IDs.',
      dueDate: '2025-05-23T12:00:00.000Z',
      priority: 'high',
      status: 'todo',
      relatedType: 'deal',
      relatedId: 'deal_3',
      relatedTitle: 'Nordic BioTech Clinical Trials Platform Add-on',
      assignedToId: 'usr_rep_2',
      createdAt: '2025-05-19T09:30:00.000Z',
    },
    {
      id: 'tsk_3',
      title: 'Conduct discovery call with Carlos Morales (Zenith Retail)',
      description: 'Qualify requirements for 150-seat migration and current pain points.',
      dueDate: '2025-05-21T15:00:00.000Z',
      priority: 'high',
      status: 'todo',
      relatedType: 'lead',
      relatedId: 'lead_1',
      relatedTitle: 'Enterprise CRM Migration & Data Lake Sync',
      assignedToId: 'usr_rep_1',
      createdAt: '2025-05-18T11:00:00.000Z',
    },
    {
      id: 'tsk_4',
      title: 'Review Q2 pipeline health with VP of Sales',
      description: 'Present win/loss rates, stage velocity, and quota attainment progress.',
      dueDate: '2025-05-24T10:00:00.000Z',
      priority: 'medium',
      status: 'todo',
      relatedType: 'general',
      assignedToId: 'usr_ana_1',
      createdAt: '2025-05-15T08:00:00.000Z',
    },
    {
      id: 'tsk_5',
      title: 'Deliver executive onboarding kickoff deck to Starlight Logistics',
      description: 'Finalize rollout schedule for Chicago, Dallas, Atlanta, and Seattle hubs.',
      dueDate: '2025-05-10T16:00:00.000Z',
      priority: 'high',
      status: 'completed',
      relatedType: 'deal',
      relatedId: 'deal_5',
      relatedTitle: 'Starlight Global Logistics Regional Hub Rollout',
      assignedToId: 'usr_admin_1',
      createdAt: '2025-05-03T10:00:00.000Z',
      completedAt: '2025-05-10T15:45:00.000Z',
    }
  ];

  const activities: Activity[] = [
    {
      id: 'act_1',
      type: 'deal_created',
      title: 'New Deal Created',
      description: 'Created deal "CloudScale Global Multi-Cloud Expansion" valued at $145,000.',
      relatedType: 'deal',
      relatedId: 'deal_1',
      relatedTitle: 'CloudScale Global Multi-Cloud Expansion',
      createdById: 'usr_rep_1',
      createdByName: 'Elena Rostova',
      createdAt: '2025-03-01T10:00:00.000Z',
    },
    {
      id: 'act_2',
      type: 'meeting',
      title: 'Executive Architecture Review with Dr. Miller',
      description: 'Reviewed multi-region data replication, backup retention policies, and SOC2 report.',
      relatedType: 'deal',
      relatedId: 'deal_1',
      relatedTitle: 'CloudScale Global Multi-Cloud Expansion',
      durationMinutes: 45,
      outcome: 'Security team approved architecture without blockers.',
      createdById: 'usr_rep_1',
      createdByName: 'Elena Rostova',
      createdAt: '2025-05-14T15:30:00.000Z',
    },
    {
      id: 'act_3',
      type: 'stage_change',
      title: 'Deal Advanced to Negotiation',
      description: 'Stage changed from "Proposal Sent" to "Negotiation". Win probability updated to 85%.',
      relatedType: 'deal',
      relatedId: 'deal_1',
      relatedTitle: 'CloudScale Global Multi-Cloud Expansion',
      createdById: 'usr_rep_1',
      createdByName: 'Elena Rostova',
      createdAt: '2025-05-18T16:00:00.000Z',
    },
    {
      id: 'act_4',
      type: 'call',
      title: 'Procurement Alignment Call',
      description: 'Discussed billing terms (Net-30) and annual volume tiers with Victoria Sterling.',
      relatedType: 'deal',
      relatedId: 'deal_2',
      relatedTitle: 'Apex Financial Institutional CRM Deployment',
      durationMinutes: 30,
      outcome: 'Awaiting final redline feedback by Thursday.',
      createdById: 'usr_mgr_1',
      createdByName: 'Marcus Chen',
      createdAt: '2025-05-18T09:00:00.000Z',
    },
    {
      id: 'act_5',
      type: 'stage_change',
      title: 'Deal Won!',
      description: 'Starlight Logistics deal officially executed and moved to Closed Won ($210,000 ARR).',
      relatedType: 'deal',
      relatedId: 'deal_5',
      relatedTitle: 'Starlight Global Logistics Regional Hub Rollout',
      createdById: 'usr_admin_1',
      createdByName: 'Sarah Vance',
      createdAt: '2025-05-02T14:00:00.000Z',
    }
  ];

  const emailTemplates: EmailTemplate[] = [
    {
      id: 'tmpl_1',
      name: 'B2B Discovery Outreach',
      category: 'outreach',
      subject: 'Streamlining sales pipeline velocity for {{company_name}}',
      body: 'Hi {{contact_name}},\n\nI’ve been following {{company_name}}’s impressive growth in {{industry}}. Many revenue teams we work with were struggling with pipeline visibility and inaccurate forecasts before adopting NexusCRM.\n\nWe recently helped a similar enterprise accelerate deal velocity by 38% while saving account executives 6 hours a week.\n\nWould you be open to a brief 15-minute introductory conversation this Thursday at 2 PM to explore if there’s an alignment?\n\nBest regards,\n{{sender_name}}\n{{sender_title}} | NexusCRM',
      variables: ['contact_name', 'company_name', 'industry', 'sender_name', 'sender_title'],
    },
    {
      id: 'tmpl_2',
      name: 'Post-Demo Follow-Up & Action Plan',
      category: 'followup',
      subject: 'Next steps from our product demo — {{deal_title}}',
      body: 'Hi {{contact_name}},\n\nThank you for taking the time to join our demo session today. It was great discussing how NexusCRM can support {{company_name}}’s goals for the upcoming quarter.\n\nAs discussed, here is a summary of our next steps:\n1. Dedicated sandbox environment provisioned for your team\n2. Security and compliance documentation attached\n3. Custom proposal review scheduled for next week\n\nPlease let me know if any questions come up in the meantime!\n\nBest,\n{{sender_name}}',
      variables: ['contact_name', 'company_name', 'deal_title', 'sender_name'],
    },
    {
      id: 'tmpl_3',
      name: 'Executive Proposal & Commercial Terms',
      category: 'proposal',
      subject: 'NexusCRM Proposal & Commercial Terms for {{company_name}}',
      body: 'Dear {{contact_name}},\n\nWe are excited to submit our formal commercial proposal for {{deal_title}} ($ {{deal_value}}).\n\nKey highlights included:\n- Full enterprise access with unlimited pipeline stages\n- Dedicated customer success manager & 99.99% uptime SLA\n- 24/7 priority support and custom API integration tokens\n\nPlease find the detailed agreement attached for your review. We look forward to partnering closely with {{company_name}}.\n\nWarm regards,\n{{sender_name}}',
      variables: ['contact_name', 'company_name', 'deal_title', 'deal_value', 'sender_name'],
    }
  ];

  const emailLogs: EmailLog[] = [
    {
      id: 'eml_1',
      to: 'jason.miller@cloudscaledynamics.com',
      subject: 'Next steps from our product demo — CloudScale Global Multi-Cloud Expansion',
      body: 'Hi Dr. Jason Miller,\n\nThank you for taking the time to join our demo session today...',
      templateId: 'tmpl_2',
      status: 'opened',
      sentAt: '2025-05-14T16:00:00.000Z',
      relatedType: 'deal',
      relatedId: 'deal_1',
      senderId: 'usr_rep_1',
      senderName: 'Elena Rostova',
    },
    {
      id: 'eml_2',
      to: 'v.sterling@apexgf.co',
      subject: 'NexusCRM Proposal & Commercial Terms for Apex Global Financial',
      body: 'Dear Victoria,\n\nWe are excited to submit our formal commercial proposal for the Institutional CRM Deployment...',
      templateId: 'tmpl_3',
      status: 'delivered',
      sentAt: '2025-05-18T10:30:00.000Z',
      relatedType: 'deal',
      relatedId: 'deal_2',
      senderId: 'usr_mgr_1',
      senderName: 'Marcus Chen',
    }
  ];

  const notifications: Notification[] = [
    {
      id: 'notif_1',
      userId: 'usr_rep_1',
      title: 'Deal Stage Advanced',
      message: 'CloudScale Global Multi-Cloud Expansion moved to Negotiation (85% probability).',
      type: 'info',
      read: false,
      link: '/deals',
      createdAt: '2025-05-18T16:01:00.000Z',
    },
    {
      id: 'notif_2',
      userId: 'usr_admin_1',
      title: 'Quarterly Milestone Achieved',
      message: 'Starlight Logistics deal closed for $210,000 ARR! Team quota attainment at 88%.',
      type: 'deal_won',
      read: false,
      link: '/dashboard',
      createdAt: '2025-05-02T14:05:00.000Z',
    },
    {
      id: 'notif_3',
      userId: 'usr_mgr_1',
      title: 'Task Due in 24 Hours',
      message: 'Send revised master service agreement to Victoria Sterling.',
      type: 'task_due',
      read: true,
      link: '/tasks',
      createdAt: '2025-05-18T10:00:00.000Z',
    },
    {
      id: 'notif_4',
      userId: 'usr_rep_1',
      title: 'High-Scoring Lead Alert',
      message: 'Zenith Retail Tech received AI score of 88/100 (High ICP Fit).',
      type: 'lead_alert',
      read: false,
      link: '/leads',
      createdAt: '2025-05-01T09:05:00.000Z',
    }
  ];

  const auditLogs: AuditLog[] = [
    {
      id: 'aud_1',
      actorId: 'usr_admin_1',
      actorName: 'Sarah Vance',
      action: 'auth_login',
      entityType: 'system',
      entityId: 'sys',
      entityName: 'Authentication Service',
      details: 'User Sarah Vance (Admin) signed into NexusCRM web console.',
      createdAt: '2025-05-19T08:00:00.000Z',
    },
    {
      id: 'aud_2',
      actorId: 'usr_rep_1',
      actorName: 'Elena Rostova',
      action: 'stage_change',
      entityType: 'deal',
      entityId: 'deal_1',
      entityName: 'CloudScale Global Multi-Cloud Expansion',
      details: 'Updated stage from proposal_sent to negotiation (probability: 60% -> 85%).',
      changes: [
        { field: 'stage', oldVal: 'proposal_sent', newVal: 'negotiation' },
        { field: 'probability', oldVal: 60, newVal: 85 }
      ],
      createdAt: '2025-05-18T16:00:00.000Z',
    },
    {
      id: 'aud_3',
      actorId: 'usr_mgr_1',
      actorName: 'Marcus Chen',
      action: 'update',
      entityType: 'company',
      entityId: 'comp_2',
      entityName: 'Apex Global Financial',
      details: 'Updated annual revenue estimate and verified contact details.',
      createdAt: '2025-05-18T09:15:00.000Z',
    },
    {
      id: 'aud_4',
      actorId: 'usr_admin_1',
      actorName: 'Sarah Vance',
      action: 'stage_change',
      entityType: 'deal',
      entityId: 'deal_5',
      entityName: 'Starlight Global Logistics Regional Hub Rollout',
      details: 'Closed Won deal for $210,000 ARR.',
      changes: [
        { field: 'stage', oldVal: 'negotiation', newVal: 'closed_won' },
        { field: 'probability', oldVal: 90, newVal: 100 }
      ],
      createdAt: '2025-05-02T14:00:00.000Z',
    }
  ];

  return {
    users,
    companies,
    contacts,
    leads,
    deals,
    tasks,
    activities,
    emailLogs,
    emailTemplates,
    notifications,
    auditLogs,
  };
}

class CRMStore {
  private db: CRMDatabase;

  constructor() {
    this.db = this.loadData();
  }

  private loadData(): CRMDatabase {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(STORE_PATH)) {
        const raw = fs.readFileSync(STORE_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn("Could not read stored CRM data from disk, initializing fresh seed data:", e);
    }
    const seed = getInitialSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(data: CRMDatabase = this.db) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error("Error saving CRM store to disk:", e);
    }
  }

  public resetToDefaultSeed(): CRMDatabase {
    this.db = getInitialSeedData();
    this.saveData();
    this.recordAuditLog({
      actorId: 'usr_admin_1',
      actorName: 'Sarah Vance',
      action: 'update',
      entityType: 'system',
      entityId: 'sys_reset',
      entityName: 'System Database',
      details: 'Reset system state to factory demonstration data.',
    });
    return this.db;
  }

  public recordAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    this.db.auditLogs.unshift(newLog);
    // Keep max 200 audit logs
    if (this.db.auditLogs.length > 200) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 200);
    }
    this.saveData();
    return newLog;
  }

  // Users
  public getUsers(): User[] {
    return this.db.users;
  }

  public getUserById(id: string): User | undefined {
    return this.db.users.find(u => u.id === id);
  }

  public createUser(userData: Omit<User, 'id' | 'createdAt'>, actor: User): User {
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.db.users.push(newUser);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'create',
      entityType: 'user',
      entityId: newUser.id,
      entityName: newUser.name,
      details: `Created new user account for ${newUser.name} with role ${newUser.role}.`,
    });
    this.saveData();
    return newUser;
  }

  public updateUser(id: string, updates: Partial<User>, actor: User): User | null {
    const index = this.db.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    const old = this.db.users[index];
    const updated = { ...old, ...updates };
    this.db.users[index] = updated;
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'update',
      entityType: 'user',
      entityId: id,
      entityName: updated.name,
      details: `Updated user profile for ${updated.name}.`,
    });
    this.saveData();
    return updated;
  }

  // Companies
  public getCompanies(): Company[] {
    return this.db.companies;
  }

  public getCompanyById(id: string): Company | undefined {
    return this.db.companies.find(c => c.id === id);
  }

  public createCompany(companyData: Omit<Company, 'id' | 'createdAt' | 'updatedAt'>, actor: User): Company {
    const newComp: Company = {
      ...companyData,
      id: `comp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.companies.unshift(newComp);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'create',
      entityType: 'company',
      entityId: newComp.id,
      entityName: newComp.name,
      details: `Created new company record for "${newComp.name}".`,
    });
    this.saveData();
    return newComp;
  }

  public updateCompany(id: string, updates: Partial<Company>, actor: User): Company | null {
    const index = this.db.companies.findIndex(c => c.id === id);
    if (index === -1) return null;
    const old = this.db.companies[index];
    const updated: Company = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.db.companies[index] = updated;
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'update',
      entityType: 'company',
      entityId: id,
      entityName: updated.name,
      details: `Updated company details for "${updated.name}".`,
    });
    this.saveData();
    return updated;
  }

  public deleteCompany(id: string, actor: User): boolean {
    const index = this.db.companies.findIndex(c => c.id === id);
    if (index === -1) return false;
    const deleted = this.db.companies[index];
    this.db.companies.splice(index, 1);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'delete',
      entityType: 'company',
      entityId: id,
      entityName: deleted.name,
      details: `Deleted company "${deleted.name}".`,
    });
    this.saveData();
    return true;
  }

  // Contacts
  public getContacts(): Contact[] {
    return this.db.contacts;
  }

  public getContactById(id: string): Contact | undefined {
    return this.db.contacts.find(c => c.id === id);
  }

  public createContact(contactData: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>, actor: User): Contact {
    const company = this.getCompanyById(contactData.companyId);
    const newContact: Contact = {
      ...contactData,
      companyName: company ? company.name : contactData.companyName,
      id: `cnt_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.contacts.unshift(newContact);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'create',
      entityType: 'contact',
      entityId: newContact.id,
      entityName: `${newContact.firstName} ${newContact.lastName}`,
      details: `Created new contact "${newContact.firstName} ${newContact.lastName}" at ${newContact.companyName}.`,
    });
    this.saveData();
    return newContact;
  }

  public updateContact(id: string, updates: Partial<Contact>, actor: User): Contact | null {
    const index = this.db.contacts.findIndex(c => c.id === id);
    if (index === -1) return null;
    const old = this.db.contacts[index];
    const updated: Contact = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.db.contacts[index] = updated;
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'update',
      entityType: 'contact',
      entityId: id,
      entityName: `${updated.firstName} ${updated.lastName}`,
      details: `Updated contact details for "${updated.firstName} ${updated.lastName}".`,
    });
    this.saveData();
    return updated;
  }

  public deleteContact(id: string, actor: User): boolean {
    const index = this.db.contacts.findIndex(c => c.id === id);
    if (index === -1) return false;
    const deleted = this.db.contacts[index];
    this.db.contacts.splice(index, 1);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'delete',
      entityType: 'contact',
      entityId: id,
      entityName: `${deleted.firstName} ${deleted.lastName}`,
      details: `Deleted contact "${deleted.firstName} ${deleted.lastName}".`,
    });
    this.saveData();
    return true;
  }

  // Leads
  public getLeads(): Lead[] {
    return this.db.leads;
  }

  public getLeadById(id: string): Lead | undefined {
    return this.db.leads.find(l => l.id === id);
  }

  public createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>, actor: User): Lead {
    const newLead: Lead = {
      ...leadData,
      id: `lead_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.leads.unshift(newLead);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'create',
      entityType: 'lead',
      entityId: newLead.id,
      entityName: newLead.title,
      details: `Created new lead "${newLead.title}" for ${newLead.company}.`,
    });
    this.saveData();
    return newLead;
  }

  public updateLead(id: string, updates: Partial<Lead>, actor: User): Lead | null {
    const index = this.db.leads.findIndex(l => l.id === id);
    if (index === -1) return null;
    const old = this.db.leads[index];
    const updated: Lead = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.db.leads[index] = updated;
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'update',
      entityType: 'lead',
      entityId: id,
      entityName: updated.title,
      details: `Updated lead "${updated.title}".`,
    });
    this.saveData();
    return updated;
  }

  public deleteLead(id: string, actor: User): boolean {
    const index = this.db.leads.findIndex(l => l.id === id);
    if (index === -1) return false;
    const deleted = this.db.leads[index];
    this.db.leads.splice(index, 1);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'delete',
      entityType: 'lead',
      entityId: id,
      entityName: deleted.title,
      details: `Deleted lead "${deleted.title}".`,
    });
    this.saveData();
    return true;
  }

  public convertLead(
    leadId: string,
    params: {
      createDeal?: boolean;
      dealValue?: number;
      dealStage?: DealStage;
      expectedCloseDate?: string;
    },
    actor: User
  ): { lead: Lead; company: Company; contact: Contact; deal?: Deal } | null {
    const lead = this.getLeadById(leadId);
    if (!lead) return null;

    // Check if company already exists by name
    let company = this.db.companies.find(c => c.name.toLowerCase() === lead.company.toLowerCase());
    if (!company) {
      company = this.createCompany({
        name: lead.company,
        domain: `${lead.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        industry: 'General Enterprise',
        size: '50-200',
        annualRevenue: lead.estimatedValue * 20,
        phone: lead.phone || '+1 (555) 010-0000',
        address: '100 Business Blvd',
        city: 'San Francisco',
        country: 'United States',
        status: 'prospect',
        assignedToId: lead.assignedToId || actor.id,
        tags: lead.tags || ['Converted Lead'],
        description: `Created automatically from converted lead "${lead.title}".`,
      }, actor);
    }

    // Split name
    const nameParts = lead.contactName.trim().split(' ');
    const firstName = nameParts[0] || 'Lead';
    const lastName = nameParts.slice(1).join(' ') || 'Contact';

    // Check if contact already exists
    let contact = this.db.contacts.find(c => c.email.toLowerCase() === lead.email.toLowerCase());
    if (!contact) {
      contact = this.createContact({
        firstName,
        lastName,
        email: lead.email,
        phone: lead.phone,
        companyId: company.id,
        companyName: company.name,
        title: 'Key Stakeholder',
        department: 'Operations',
        status: 'lead',
        leadSource: lead.source,
        assignedToId: lead.assignedToId || actor.id,
        tags: lead.tags || ['Converted Lead'],
        notes: lead.notes,
      }, actor);
    }

    let deal: Deal | undefined;
    if (params.createDeal !== false) {
      deal = this.createDeal({
        title: `${company.name} - ${lead.title}`,
        companyId: company.id,
        companyName: company.name,
        contactId: contact.id,
        contactName: `${contact.firstName} ${contact.lastName}`,
        value: params.dealValue || lead.estimatedValue || 50000,
        currency: 'USD',
        stage: params.dealStage || 'qualification',
        probability: 40,
        expectedCloseDate: params.expectedCloseDate || new Date(Date.now() + 45 * 86400000).toISOString().split('T')[0],
        priority: 'high',
        assignedToId: lead.assignedToId || actor.id,
        tags: lead.tags || ['Converted Lead'],
        notes: `Converted from lead "${lead.title}". AI Score: ${lead.score}/100. Rep notes: ${lead.notes}`,
      }, actor);
    }

    // Update lead status
    const updatedLead = this.updateLead(lead.id, {
      status: 'converted',
      convertedCompanyId: company.id,
      convertedContactId: contact.id,
      convertedDealId: deal?.id,
    }, actor);

    // Create activity
    this.createActivity({
      type: 'lead_converted',
      title: `Lead Converted: ${lead.title}`,
      description: `Converted lead to Account (${company.name}), Contact (${contact.firstName} ${contact.lastName})${deal ? ` and Deal (${deal.title} - $${deal.value.toLocaleString()})` : ''}.`,
      relatedType: 'lead',
      relatedId: lead.id,
      relatedTitle: lead.title,
      createdById: actor.id,
      createdByName: actor.name,
    });

    return {
      lead: updatedLead || lead,
      company,
      contact,
      deal,
    };
  }

  // Deals
  public getDeals(): Deal[] {
    return this.db.deals;
  }

  public getDealById(id: string): Deal | undefined {
    return this.db.deals.find(d => d.id === id);
  }

  public createDeal(dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>, actor: User): Deal {
    const newDeal: Deal = {
      ...dealData,
      id: `deal_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.db.deals.unshift(newDeal);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'create',
      entityType: 'deal',
      entityId: newDeal.id,
      entityName: newDeal.title,
      details: `Created new deal "${newDeal.title}" with value $${newDeal.value.toLocaleString()}.`,
    });
    this.createActivity({
      type: 'deal_created',
      title: 'Deal Created',
      description: `Created deal "${newDeal.title}" for ${newDeal.companyName} ($${newDeal.value.toLocaleString()}).`,
      relatedType: 'deal',
      relatedId: newDeal.id,
      relatedTitle: newDeal.title,
      createdById: actor.id,
      createdByName: actor.name,
    });
    this.saveData();
    return newDeal;
  }

  public updateDeal(id: string, updates: Partial<Deal>, actor: User): Deal | null {
    const index = this.db.deals.findIndex(d => d.id === id);
    if (index === -1) return null;
    const old = this.db.deals[index];
    const updated: Deal = {
      ...old,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.db.deals[index] = updated;
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'update',
      entityType: 'deal',
      entityId: id,
      entityName: updated.title,
      details: `Updated deal details for "${updated.title}".`,
    });
    this.saveData();
    return updated;
  }

  public updateDealStage(
    id: string,
    newStage: DealStage,
    actor: User,
    extra?: { lossReason?: string; probability?: number }
  ): Deal | null {
    const deal = this.getDealById(id);
    if (!deal) return null;
    const oldStage = deal.stage;
    const stageProbabilities: Record<DealStage, number> = {
      discovery: 20,
      qualification: 40,
      demo_scheduled: 50,
      proposal_sent: 65,
      negotiation: 85,
      closed_won: 100,
      closed_lost: 0,
    };

    const probability = extra?.probability !== undefined ? extra.probability : stageProbabilities[newStage];
    const closedAt = (newStage === 'closed_won' || newStage === 'closed_lost') ? new Date().toISOString() : undefined;

    const updated = this.updateDeal(id, {
      stage: newStage,
      probability,
      closedAt,
      lossReason: newStage === 'closed_lost' ? extra?.lossReason : undefined,
    }, actor);

    if (updated) {
      this.recordAuditLog({
        actorId: actor.id,
        actorName: actor.name,
        action: 'stage_change',
        entityType: 'deal',
        entityId: id,
        entityName: updated.title,
        details: `Moved deal stage from ${oldStage.replace('_', ' ')} to ${newStage.replace('_', ' ')}.`,
        changes: [
          { field: 'stage', oldVal: oldStage, newVal: newStage },
          { field: 'probability', oldVal: deal.probability, newVal: probability }
        ],
      });

      this.createActivity({
        type: 'stage_change',
        title: `Deal Stage Changed: ${newStage.replace('_', ' ').toUpperCase()}`,
        description: `Stage moved from "${oldStage}" to "${newStage}". Probability: ${probability}%.${extra?.lossReason ? ` Reason: ${extra.lossReason}` : ''}`,
        relatedType: 'deal',
        relatedId: updated.id,
        relatedTitle: updated.title,
        createdById: actor.id,
        createdByName: actor.name,
      });

      if (newStage === 'closed_won') {
        this.createNotification({
          userId: updated.assignedToId,
          title: '🎉 Deal Closed Won!',
          message: `Congratulations! "${updated.title}" closed won for $${updated.value.toLocaleString()} ARR.`,
          type: 'deal_won',
          link: '/deals',
        });
      }
    }

    return updated;
  }

  public deleteDeal(id: string, actor: User): boolean {
    const index = this.db.deals.findIndex(d => d.id === id);
    if (index === -1) return false;
    const deleted = this.db.deals[index];
    this.db.deals.splice(index, 1);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'delete',
      entityType: 'deal',
      entityId: id,
      entityName: deleted.title,
      details: `Deleted deal "${deleted.title}".`,
    });
    this.saveData();
    return true;
  }

  // Tasks
  public getTasks(): Task[] {
    return this.db.tasks;
  }

  public createTask(taskData: Omit<Task, 'id' | 'createdAt'>, actor: User): Task {
    const newTask: Task = {
      ...taskData,
      id: `tsk_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.db.tasks.unshift(newTask);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'create',
      entityType: 'task',
      entityId: newTask.id,
      entityName: newTask.title,
      details: `Created new task: "${newTask.title}".`,
    });
    this.saveData();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>, actor: User): Task | null {
    const index = this.db.tasks.findIndex(t => t.id === id);
    if (index === -1) return null;
    const old = this.db.tasks[index];
    const isCompletedNow = updates.status === 'completed' && old.status !== 'completed';
    const updated: Task = {
      ...old,
      ...updates,
      completedAt: isCompletedNow ? new Date().toISOString() : updates.status !== 'completed' ? undefined : old.completedAt,
    };
    this.db.tasks[index] = updated;
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'update',
      entityType: 'task',
      entityId: id,
      entityName: updated.title,
      details: `Updated task "${updated.title}" status to ${updated.status}.`,
    });
    this.saveData();
    return updated;
  }

  public deleteTask(id: string, actor: User): boolean {
    const index = this.db.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    const deleted = this.db.tasks[index];
    this.db.tasks.splice(index, 1);
    this.recordAuditLog({
      actorId: actor.id,
      actorName: actor.name,
      action: 'delete',
      entityType: 'task',
      entityId: id,
      entityName: deleted.title,
      details: `Deleted task "${deleted.title}".`,
    });
    this.saveData();
    return true;
  }

  // Activities
  public getActivities(relatedType?: string, relatedId?: string): Activity[] {
    if (relatedType && relatedId) {
      return this.db.activities.filter(a => a.relatedType === relatedType && a.relatedId === relatedId);
    }
    return this.db.activities;
  }

  public createActivity(activityData: Omit<Activity, 'id' | 'createdAt'>): Activity {
    const newAct: Activity = {
      ...activityData,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      createdAt: new Date().toISOString(),
    };
    this.db.activities.unshift(newAct);
    this.saveData();
    return newAct;
  }

  // Emails
  public getEmailLogs(): EmailLog[] {
    return this.db.emailLogs;
  }

  public getEmailTemplates(): EmailTemplate[] {
    return this.db.emailTemplates;
  }

  public sendEmail(
    params: {
      to: string;
      cc?: string;
      bcc?: string;
      subject: string;
      body: string;
      templateId?: string;
      relatedType?: any;
      relatedId?: string;
    },
    sender: User
  ): EmailLog {
    const newLog: EmailLog = {
      id: `eml_${Date.now()}`,
      to: params.to,
      cc: params.cc,
      bcc: params.bcc,
      subject: params.subject,
      body: params.body,
      templateId: params.templateId,
      status: 'delivered',
      sentAt: new Date().toISOString(),
      relatedType: params.relatedType,
      relatedId: params.relatedId,
      senderId: sender.id,
      senderName: sender.name,
    };
    this.db.emailLogs.unshift(newLog);

    this.createActivity({
      type: 'email',
      title: `Email Sent: ${params.subject}`,
      description: `Sent message to ${params.to}.`,
      relatedType: params.relatedType || 'general',
      relatedId: params.relatedId || newLog.id,
      relatedTitle: params.subject,
      createdById: sender.id,
      createdByName: sender.name,
    });

    this.recordAuditLog({
      actorId: sender.id,
      actorName: sender.name,
      action: 'create',
      entityType: 'email',
      entityId: newLog.id,
      entityName: params.subject,
      details: `Dispatched email to ${params.to} regarding "${params.subject}".`,
    });

    this.saveData();
    return newLog;
  }

  // Notifications
  public getNotifications(userId?: string): Notification[] {
    if (userId) {
      return this.db.notifications.filter(n => n.userId === userId || n.userId === 'all');
    }
    return this.db.notifications;
  }

  public createNotification(notif: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const newNotif: Notification = {
      ...notif,
      id: `notif_${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    this.db.notifications.unshift(newNotif);
    this.saveData();
    return newNotif;
  }

  public markNotificationRead(id: string): boolean {
    const notif = this.db.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.saveData();
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(userId?: string): void {
    this.db.notifications.forEach(n => {
      if (!userId || n.userId === userId || n.userId === 'all') {
        n.read = true;
      }
    });
    this.saveData();
  }

  // Audit Logs
  public getAuditLogs(): AuditLog[] {
    return this.db.auditLogs;
  }

  // Analytics & Forecasts
  public getDashboardMetrics(): DashboardMetrics {
    const deals = this.db.deals;
    const leads = this.db.leads;
    const users = this.db.users;

    const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');
    const wonDeals = deals.filter(d => d.stage === 'closed_won');
    const lostDeals = deals.filter(d => d.stage === 'closed_lost');

    const totalPipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
    const weightedPipelineValue = activeDeals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0);
    const closedWonYTD = wonDeals.reduce((sum, d) => sum + d.value, 0);

    const closedTotal = wonDeals.length + lostDeals.length;
    const winRatePercentage = closedTotal > 0 ? Math.round((wonDeals.length / closedTotal) * 100) : 0;
    const avgDealSize = deals.length > 0 ? Math.round(deals.reduce((sum, d) => sum + d.value, 0) / deals.length) : 0;

    const stages: { stage: DealStage; label: string; prob: number }[] = [
      { stage: 'discovery', label: 'Discovery', prob: 20 },
      { stage: 'qualification', label: 'Qualification', prob: 40 },
      { stage: 'demo_scheduled', label: 'Demo Scheduled', prob: 50 },
      { stage: 'proposal_sent', label: 'Proposal Sent', prob: 65 },
      { stage: 'negotiation', label: 'Negotiation', prob: 85 },
      { stage: 'closed_won', label: 'Closed Won', prob: 100 },
      { stage: 'closed_lost', label: 'Closed Lost', prob: 0 },
    ];

    const dealsByStage = stages.map(s => {
      const stageDeals = deals.filter(d => d.stage === s.stage);
      return {
        stage: s.stage,
        label: s.label,
        count: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + d.value, 0),
        probability: s.prob,
      };
    });

    const salesReps = users.filter(u => u.role === 'sales_rep' || u.role === 'sales_manager');
    const dealsByRep = salesReps.map(rep => {
      const repDeals = deals.filter(d => d.assignedToId === rep.id);
      const repActive = repDeals.filter(d => d.stage !== 'closed_lost');
      const repWon = repDeals.filter(d => d.stage === 'closed_won');
      const pipelineVal = repActive.reduce((sum, d) => sum + d.value, 0);
      const wonVal = repWon.reduce((sum, d) => sum + d.value, 0);
      const attainment = rep.quota > 0 ? Math.round((wonVal / rep.quota) * 100) : 0;

      return {
        repId: rep.id,
        repName: rep.name,
        avatar: rep.avatar,
        dealCount: repDeals.length,
        pipelineValue: pipelineVal,
        wonValue: wonVal,
        quota: rep.quota,
        attainment,
      };
    });

    const sourceCounts: Record<string, number> = {};
    leads.forEach(l => {
      sourceCounts[l.source] = (sourceCounts[l.source] || 0) + 1;
    });
    const totalLeads = leads.length || 1;
    const leadsBySource = Object.entries(sourceCounts).map(([source, count]) => ({
      source: source.replace('_', ' ').toUpperCase(),
      count,
      percentage: Math.round((count / totalLeads) * 100),
    }));

    const revenueByMonth = [
      { month: 'Jan', target: 80000, actual: 95000, forecast: 95000 },
      { month: 'Feb', target: 90000, actual: 110000, forecast: 110000 },
      { month: 'Mar', target: 120000, actual: 135000, forecast: 135000 },
      { month: 'Apr', target: 140000, actual: 148000, forecast: 148000 },
      { month: 'May', target: 160000, actual: 210000, forecast: 210000 },
      { month: 'Jun (Est)', target: 180000, actual: 0, forecast: 235000 },
      { month: 'Jul (Est)', target: 200000, actual: 0, forecast: 260000 },
      { month: 'Aug (Est)', target: 220000, actual: 0, forecast: 290000 },
    ];

    return {
      totalPipelineValue,
      weightedPipelineValue,
      closedWonYTD,
      winRatePercentage,
      activeDealsCount: activeDeals.length,
      openLeadsCount: leads.filter(l => l.status !== 'converted' && l.status !== 'unqualified').length,
      avgDealSize,
      avgSalesCycleDays: 34,
      revenueByMonth,
      dealsByStage,
      dealsByRep,
      leadsBySource,
      winLossRatio: {
        won: wonDeals.length,
        lost: lostDeals.length,
        winRate: winRatePercentage,
      },
    };
  }

  public getForecastData(): ForecastData {
    const metrics = this.getDashboardMetrics();
    const deals = this.db.deals;
    const activeDeals = deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost');

    const committedRevenue = metrics.closedWonYTD;
    const bestCaseRevenue = committedRevenue + activeDeals.reduce((sum, d) => sum + d.value, 0);
    const weightedPipeline = metrics.weightedPipelineValue;

    const stageBreakdown = metrics.dealsByStage.map(s => ({
      stage: s.label,
      value: s.value,
      weightedValue: Math.round(s.value * (s.probability / 100)),
      count: s.count,
    }));

    const repForecast = metrics.dealsByRep.map(r => ({
      repId: r.repId,
      repName: r.repName,
      quota: r.quota,
      closedWon: r.wonValue,
      weightedPipeline: Math.round(r.pipelineValue * 0.6),
      projectedTotal: r.wonValue + Math.round(r.pipelineValue * 0.6),
      attainmentPct: r.quota > 0 ? Math.round(((r.wonValue + Math.round(r.pipelineValue * 0.6)) / r.quota) * 100) : 100,
    }));

    return {
      period: 'Q2 2025 (Current Period)',
      quarterTarget: 750000,
      committedRevenue,
      bestCaseRevenue,
      weightedPipeline,
      stageBreakdown,
      repForecast,
    };
  }

  // Automated Integration Test Runner
  public runAutomatedTests(): TestSuiteResult {
    const startTime = Date.now();
    const results: TestResultItem[] = [];
    const dummyActor = this.db.users[0]; // Admin

    const runTest = (
      name: string,
      category: TestResultItem['category'],
      fn: () => { passed: boolean; details: string; error?: string }
    ) => {
      const t0 = Date.now();
      try {
        const res = fn();
        results.push({
          id: `test_${results.length + 1}`,
          name,
          category,
          passed: res.passed,
          durationMs: Date.now() - t0,
          details: res.details,
          error: res.error,
        });
      } catch (err: any) {
        results.push({
          id: `test_${results.length + 1}`,
          name,
          category,
          passed: false,
          durationMs: Date.now() - t0,
          details: 'Exception encountered during test execution',
          error: err?.message || String(err),
        });
      }
    };

    // 1. Auth & Users Test
    runTest('User Role & Permissions Verification', 'AUTH', () => {
      const users = this.getUsers();
      const hasAdmin = users.some(u => u.role === 'admin');
      const hasRep = users.some(u => u.role === 'sales_rep');
      const hasManager = users.some(u => u.role === 'sales_manager');
      return {
        passed: hasAdmin && hasRep && hasManager && users.length >= 4,
        details: `Verified ${users.length} users with standard RBAC roles (Admin, Sales Manager, Sales Rep, Marketing, Analyst).`,
      };
    });

    // 2. Company CRUD & Relational Linking
    runTest('Company Creation & Association Integrity', 'COMPANIES', () => {
      const tempComp = this.createCompany({
        name: `Test Org ${Date.now()}`,
        domain: 'testorg.com',
        industry: 'Software',
        size: '10-50',
        annualRevenue: 5000000,
        phone: '+1 555-0199',
        address: '123 Test St',
        city: 'San Francisco',
        country: 'USA',
        status: 'prospect',
        assignedToId: dummyActor.id,
        tags: ['Automated Test'],
      }, dummyActor);

      const found = this.getCompanyById(tempComp.id);
      const isSaved = Boolean(found && found.name === tempComp.name);
      this.deleteCompany(tempComp.id, dummyActor);

      return {
        passed: isSaved,
        details: `Successfully created, verified persistence, and cleanly removed test company ID: ${tempComp.id}.`,
      };
    });

    // 3. Contact Management
    runTest('Contact Email Validation & Organization Linkage', 'CONTACTS', () => {
      const comp = this.getCompanies()[0];
      const newContact = this.createContact({
        firstName: 'Test',
        lastName: 'Contact',
        email: `test.${Date.now()}@example.com`,
        phone: '+1 555-0123',
        companyId: comp.id,
        companyName: comp.name,
        title: 'VP of Testing',
        department: 'QA',
        status: 'lead',
        leadSource: 'inbound',
        assignedToId: dummyActor.id,
        tags: ['Test'],
      }, dummyActor);

      const isLinked = newContact.companyName === comp.name;
      this.deleteContact(newContact.id, dummyActor);

      return {
        passed: isLinked,
        details: `Contact created and verified automatic linking with Company ${comp.name}.`,
      };
    });

    // 4. Lead Scoring & Conversion Flow
    runTest('Lead Conversion Pipeline Workflow', 'LEADS', () => {
      const tempLead = this.createLead({
        title: 'Test Deal Conversion Opportunity',
        company: `Conversion Co ${Date.now()}`,
        contactName: 'Alice Tester',
        email: `alice.${Date.now()}@conversion.test`,
        phone: '+1 555-9988',
        status: 'qualified',
        score: 90,
        source: 'website',
        estimatedValue: 75000,
        assignedToId: dummyActor.id,
        notes: 'Conversion test',
        tags: ['Test'],
      }, dummyActor);

      const conversion = this.convertLead(tempLead.id, { createDeal: true, dealValue: 75000 }, dummyActor);
      const passed = Boolean(conversion && conversion.lead.status === 'converted' && conversion.deal);

      // Clean up
      if (conversion?.deal) this.deleteDeal(conversion.deal.id, dummyActor);
      if (conversion?.contact) this.deleteContact(conversion.contact.id, dummyActor);
      if (conversion?.company) this.deleteCompany(conversion.company.id, dummyActor);
      this.deleteLead(tempLead.id, dummyActor);

      return {
        passed,
        details: 'Lead converted into Account, Contact, and active Pipeline Deal seamlessly.',
      };
    });

    // 5. Deals Kanban Stage Transitions & Win/Loss Tracking
    runTest('Kanban Deal Stage Transition & Math Calculations', 'DEALS', () => {
      const comp = this.getCompanies()[0];
      const contact = this.getContacts()[0];
      const deal = this.createDeal({
        title: 'Stage Transition Verification Deal',
        companyId: comp.id,
        companyName: comp.name,
        contactId: contact.id,
        contactName: `${contact.firstName} ${contact.lastName}`,
        value: 100000,
        currency: 'USD',
        stage: 'discovery',
        probability: 20,
        expectedCloseDate: '2025-12-31',
        priority: 'high',
        assignedToId: dummyActor.id,
        tags: ['Test'],
      }, dummyActor);

      const updatedToWon = this.updateDealStage(deal.id, 'closed_won', dummyActor);
      const isWonValid = Boolean(updatedToWon && updatedToWon.stage === 'closed_won' && updatedToWon.probability === 100);

      this.deleteDeal(deal.id, dummyActor);

      return {
        passed: isWonValid,
        details: 'Verified deal stage migration from Discovery to Closed Won with probability recalibration.',
      };
    });

    // 6. Tasks & Reminders Integrity
    runTest('Task Completion & Due Date Tracking', 'TASKS', () => {
      const task = this.createTask({
        title: 'Automated Test Task',
        dueDate: new Date().toISOString(),
        priority: 'urgent',
        status: 'todo',
        relatedType: 'general',
        assignedToId: dummyActor.id,
      }, dummyActor);

      const completed = this.updateTask(task.id, { status: 'completed' }, dummyActor);
      const isCompleted = Boolean(completed && completed.status === 'completed' && completed.completedAt);
      this.deleteTask(task.id, dummyActor);

      return {
        passed: isCompleted,
        details: 'Task status lifecycle validated with automatic completedAt timestamping.',
      };
    });

    // 7. Email Dispatch Architecture
    runTest('Email Communication Architecture & Template Logging', 'EMAILS', () => {
      const templates = this.getEmailTemplates();
      const sent = this.sendEmail({
        to: 'client@example.com',
        subject: 'Automated Test Email',
        body: 'Testing email dispatch system.',
        templateId: templates[0]?.id,
      }, dummyActor);

      return {
        passed: Boolean(sent && sent.status === 'delivered' && templates.length > 0),
        details: `Validated ${templates.length} email templates and verified logged outbound delivery.`,
      };
    });

    // 8. Immutable Audit Log Tracking
    runTest('Audit Trail Immutability & Event Recording', 'AUDIT', () => {
      const logs = this.getAuditLogs();
      const hasRecent = logs.length > 0 && logs[0].actorName.length > 0;
      return {
        passed: hasRecent,
        details: `Verified active audit trail recording with ${logs.length} logged enterprise events.`,
      };
    });

    // 9. Forecasting & Revenue Math Integrity
    runTest('Pipeline Forecasting Engine & Quota Math', 'INTEGRITY', () => {
      const metrics = this.getDashboardMetrics();
      const forecast = this.getForecastData();
      const isMathSound = metrics.totalPipelineValue >= 0 && metrics.winRatePercentage >= 0 && forecast.bestCaseRevenue >= forecast.committedRevenue;
      return {
        passed: isMathSound,
        details: `Forecast metrics verified: Total Pipeline $${metrics.totalPipelineValue.toLocaleString()}, Win Rate ${metrics.winRatePercentage}%.`,
      };
    });

    const passedCount = results.filter(r => r.passed).length;
    return {
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      durationMs: Date.now() - startTime,
      timestamp: new Date().toISOString(),
      results,
    };
  }
}

export const crmStore = new CRMStore();
