import React, { useState } from 'react';
import { Plus, Search, Building2, Globe, MapPin, DollarSign, ArrowRight } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Company } from '../../types';

export const CompaniesView: React.FC = () => {
  const { companies, contacts, deals, setSelectedCompanyId, openQuickCreate } = useCRM();
  const [search, setSearch] = useState('');

  const filteredCompanies = companies.filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry.toLowerCase().includes(search.toLowerCase()) ||
    c.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Company Accounts (360° View)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredCompanies.length} enterprise customer and target client organizations
          </p>
        </div>

        <button
          onClick={() => openQuickCreate('company')}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Company</span>
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search company name, domain, industry..."
            className="w-full bg-transparent text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400 text-xs"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map(comp => {
          const compContacts = contacts.filter(c => c.companyId === comp.id);
          const compDeals = deals.filter(d => d.companyId === comp.id);
          const totalPipeline = compDeals.reduce((sum, d) => sum + d.value, 0);

          return (
            <div
              key={comp.id}
              onClick={() => setSelectedCompanyId(comp.id)}
              className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm border border-blue-200 dark:border-blue-800">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {comp.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{comp.industry}</p>
                  </div>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {comp.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-3 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-400 block">Contacts</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{compContacts.length} people</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Active Deals</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {compDeals.length} (${(totalPipeline / 1000).toFixed(0)}k)
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>{comp.city}, {comp.country}</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                  <span>360° Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
