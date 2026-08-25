import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Users,
  Globe,
  MapPin,
  DollarSign,
  Briefcase,
  Trash2,
  Plus,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { Company, Contact, Deal } from '../../types';

export const CompanyDetailModal: React.FC = () => {
  const {
    selectedCompanyId,
    setSelectedCompanyId,
    companies,
    refreshAll,
    addToast,
    openQuickCreate,
    setSelectedDealId,
    setSelectedContactId,
  } = useCRM();

  const { canDelete } = useAuth();

  const [company, setCompany] = useState<Company | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);

  useEffect(() => {
    if (!selectedCompanyId) {
      setCompany(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await api.getCompany(selectedCompanyId);
        setCompany(res.company);
        setContacts(res.contacts || []);
        setDeals(res.deals || []);
      } catch (err) {
        console.error('Failed to load company:', err);
      }
    };

    fetchDetail();
  }, [selectedCompanyId, companies]);

  if (!selectedCompanyId) return null;

  const handleDelete = async () => {
    if (!company) return;
    if (window.confirm(`Delete company account "${company.name}"?`)) {
      try {
        await api.deleteCompany(company.id);
        addToast({ type: 'info', title: 'Company Deleted' });
        setSelectedCompanyId(null);
        refreshAll();
      } catch (err: any) {
        addToast({ type: 'error', title: 'Delete failed', message: err.message });
      }
    }
  };

  const totalDealValue = deals.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-lg shadow-xs">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{company?.name}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  {company?.domain}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {company?.city}, {company?.country}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {canDelete && (
              <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setSelectedCompanyId(null)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[11px] block">Annual Revenue</span>
              <span className="font-bold text-slate-900 dark:text-white text-base">
                ${((company?.annualRevenue || 0) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[11px] block">Company Size</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{company?.size} employees</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[11px] block">Industry</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{company?.industry}</span>
            </div>
          </div>

          {/* Associated Contacts */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
                Key Contacts ({contacts.length})
              </h3>
              <button
                onClick={() => {
                  setSelectedCompanyId(null);
                  openQuickCreate('contact');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Contact</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {contacts.map(c => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCompanyId(null);
                    setSelectedContactId(c.id);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{c.firstName} {c.lastName}</p>
                    <p className="text-[11px] text-slate-500">{c.title}</p>
                  </div>
                  <span className="text-indigo-600 text-xs font-semibold">View</span>
                </div>
              ))}
            </div>
          </div>

          {/* Associated Deals */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
                Active & Historic Deals ({deals.length}) • ${(totalDealValue / 1000).toFixed(0)}k Total
              </h3>
              <button
                onClick={() => {
                  setSelectedCompanyId(null);
                  openQuickCreate('deal');
                }}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Deal</span>
              </button>
            </div>

            <div className="space-y-2">
              {deals.map(d => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedCompanyId(null);
                    setSelectedDealId(d.id);
                  }}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{d.title}</p>
                    <p className="text-[11px] text-slate-500">Stage: {d.stage.replace('_', ' ')} • Close: {d.expectedCloseDate}</p>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    ${d.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
