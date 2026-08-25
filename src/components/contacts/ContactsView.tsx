import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Building2, Users, ArrowRight } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { Contact } from '../../types';

export const ContactsView: React.FC = () => {
  const { contacts, setSelectedContactId, openQuickCreate } = useCRM();
  const [search, setSearch] = useState('');

  const filteredContacts = contacts.filter(c =>
    !search ||
    `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.companyName.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Customer Contacts Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredContacts.length} verified executive decision makers
          </p>
        </div>

        <button
          onClick={() => openQuickCreate('contact')}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Contact</span>
        </button>
      </div>

      {/* Search toolbar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, title, email, or company..."
            className="w-full bg-transparent text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400 text-xs"
          />
        </div>
      </div>

      {/* Grid of Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map(contact => (
          <div
            key={contact.id}
            onClick={() => setSelectedContactId(contact.id)}
            className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-xs hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer flex flex-col justify-between space-y-3 group"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm shrink-0 border border-blue-200 dark:border-blue-800">
                {contact.firstName[0]}{contact.lastName[0]}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {contact.firstName} {contact.lastName}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{contact.title}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{contact.companyName}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
              {contact.phone && (
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
