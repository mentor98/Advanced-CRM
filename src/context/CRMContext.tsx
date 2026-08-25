import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Company,
  Contact,
  Lead,
  Deal,
  Task,
  Activity,
  Notification,
  AuditLog,
  DashboardMetrics,
  ForecastData,
  DealStage,
} from '../types';
import { api } from '../api';
import { useAuth } from './AuthContext';

export type NavView =
  | 'dashboard'
  | 'deals'
  | 'leads'
  | 'contacts'
  | 'companies'
  | 'tasks'
  | 'emails'
  | 'forecast'
  | 'team'
  | 'audit';

export type QuickCreateType = 'deal' | 'lead' | 'contact' | 'company' | 'task' | 'email';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message?: string;
}

interface CRMContextType {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  
  // Data states
  companies: Company[];
  contacts: Contact[];
  leads: Lead[];
  deals: DealsData;
  tasks: Task[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  metrics: DashboardMetrics | null;
  forecast: ForecastData | null;
  loading: boolean;
  refreshAll: () => Promise<void>;

  // Modals & Panels
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickCreateOpen: boolean;
  setIsQuickCreateOpen: (open: boolean) => void;
  quickCreateType: QuickCreateType;
  setQuickCreateType: (type: QuickCreateType) => void;
  openQuickCreate: (type?: QuickCreateType) => void;
  
  isAICopilotOpen: boolean;
  setIsAICopilotOpen: (open: boolean) => void;
  aiCopilotContext: { dealId?: string; leadId?: string; prompt?: string } | null;
  openAICopilot: (context?: { dealId?: string; leadId?: string; prompt?: string }) => void;

  isTestRunnerOpen: boolean;
  setIsTestRunnerOpen: (open: boolean) => void;

  // Selected Detail Item Drawers
  selectedDealId: string | null;
  setSelectedDealId: (id: string | null) => void;
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  selectedContactId: string | null;
  setSelectedContactId: (id: string | null) => void;
  selectedCompanyId: string | null;
  setSelectedCompanyId: (id: string | null) => void;

  // Actions
  updateDealStage: (dealId: string, stage: DealStage, extra?: { lossReason?: string }) => Promise<void>;
  toggleTaskStatus: (taskId: string, currentStatus: string) => Promise<void>;
  convertLead: (leadId: string, params: { createDeal?: boolean; dealValue?: number; dealStage?: DealStage }) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  resetDatabase: () => Promise<void>;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

type DealsData = Deal[];

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<NavView>('dashboard');

  const [companies, setCompanies] = useState<Company[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
  const [quickCreateType, setQuickCreateType] = useState<QuickCreateType>('deal');
  const [isAICopilotOpen, setIsAICopilotOpen] = useState(false);
  const [aiCopilotContext, setAICopilotContext] = useState<{ dealId?: string; leadId?: string; prompt?: string } | null>(null);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);

  // Selected Entities
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const refreshAll = useCallback(async () => {
    try {
      setLoading(true);
      const [
        compsRes,
        cntsRes,
        leadsRes,
        dealsRes,
        tasksRes,
        notifsRes,
        auditRes,
        metricsRes,
        forecastRes,
      ] = await Promise.all([
        api.getCompanies(),
        api.getContacts(),
        api.getLeads(),
        api.getDeals(),
        api.getTasks(),
        api.getNotifications(),
        api.getAuditLogs(),
        api.getDashboardMetrics(),
        api.getForecastData(),
      ]);

      setCompanies(compsRes.companies);
      setContacts(cntsRes.contacts);
      setLeads(leadsRes.leads);
      setDeals(dealsRes.deals);
      setTasks(tasksRes.tasks);
      setNotifications(notifsRes.notifications);
      setAuditLogs(auditRes.auditLogs);
      setMetrics(metricsRes.metrics);
      setForecast(forecastRes.forecast);
    } catch (err) {
      console.error('Failed to fetch CRM data:', err);
      addToast({
        type: 'error',
        title: 'Connection Error',
        message: 'Could not sync CRM records from server.',
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll, currentUser?.id]);

  // Keyboard shortcut Cmd+K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openQuickCreate = (type: QuickCreateType = 'deal') => {
    setQuickCreateType(type);
    setIsQuickCreateOpen(true);
  };

  const openAICopilot = (context?: { dealId?: string; leadId?: string; prompt?: string }) => {
    setAICopilotContext(context || null);
    setIsAICopilotOpen(true);
  };

  const updateDealStage = async (dealId: string, stage: DealStage, extra?: { lossReason?: string }) => {
    // Optimistic update
    setDeals(prev =>
      prev.map(d => (d.id === dealId ? { ...d, stage, lossReason: extra?.lossReason } : d))
    );

    try {
      const res = await api.updateDealStage(dealId, stage, extra);
      setDeals(prev => prev.map(d => (d.id === dealId ? res.deal : d)));
      addToast({
        type: stage === 'closed_won' ? 'success' : 'info',
        title: stage === 'closed_won' ? '🎉 Deal Closed Won!' : 'Stage Updated',
        message: `Deal advanced to ${stage.replace('_', ' ').toUpperCase()}`,
      });
      // Refresh metrics in background
      api.getDashboardMetrics().then(m => setMetrics(m.metrics));
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to update stage',
        message: err.message,
      });
      refreshAll();
    }
  };

  const toggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
    // Optimistic
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: newStatus as any } : t))
    );

    try {
      const res = await api.updateTaskStatus(taskId, newStatus);
      setTasks(prev => prev.map(t => (t.id === taskId ? res.task : d => d)));
      addToast({
        type: 'success',
        title: newStatus === 'completed' ? 'Task Completed' : 'Task Reopened',
      });
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Failed to update task',
        message: err.message,
      });
      refreshAll();
    }
  };

  const convertLead = async (leadId: string, params: { createDeal?: boolean; dealValue?: number; dealStage?: DealStage }) => {
    try {
      const res = await api.convertLead(leadId, params);
      addToast({
        type: 'success',
        title: 'Lead Converted Successfully',
        message: `Created Account "${res.company.name}" and Contact "${res.contact.firstName} ${res.contact.lastName}".`,
      });
      await refreshAll();
      if (res.deal) {
        setActiveView('deals');
      } else {
        setActiveView('contacts');
      }
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Lead conversion failed',
        message: err.message,
      });
    }
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    await api.markNotificationRead(id).catch(console.error);
  };

  const markAllNotificationsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    await api.markAllNotificationsRead().catch(console.error);
  };

  const resetDatabase = async () => {
    try {
      await api.resetDemoData();
      addToast({
        type: 'info',
        title: 'System Restored',
        message: 'CRM database has been reset to default enterprise dataset.',
      });
      await refreshAll();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'Reset failed',
        message: err.message,
      });
    }
  };

  return (
    <CRMContext.Provider
      value={{
        activeView,
        setActiveView,
        companies,
        contacts,
        leads,
        deals,
        tasks,
        notifications,
        auditLogs,
        metrics,
        forecast,
        loading,
        refreshAll,

        isSearchOpen,
        setIsSearchOpen,
        isQuickCreateOpen,
        setIsQuickCreateOpen,
        quickCreateType,
        setQuickCreateType,
        openQuickCreate,

        isAICopilotOpen,
        setIsAICopilotOpen,
        aiCopilotContext,
        openAICopilot,

        isTestRunnerOpen,
        setIsTestRunnerOpen,

        selectedDealId,
        setSelectedDealId,
        selectedLeadId,
        setSelectedLeadId,
        selectedContactId,
        setSelectedContactId,
        selectedCompanyId,
        setSelectedCompanyId,

        updateDealStage,
        toggleTaskStatus,
        convertLead,
        markNotificationRead,
        markAllNotificationsRead,
        resetDatabase,

        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export function useCRM(): CRMContextType {
  const context = useContext(CRMContext);
  if (!context) throw new Error('useCRM must be used within CRMProvider');
  return context;
}
