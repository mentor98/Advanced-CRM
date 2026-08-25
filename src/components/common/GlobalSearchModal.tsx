import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Kanban, Users, Building2, Flame, ArrowRight } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../api';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    setActiveView,
    setSelectedDealId,
    setSelectedContactId,
    setSelectedCompanyId,
    setSelectedLeadId,
  } = useCRM();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string; id: string; title: string; subtitle: string; link: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setResults([]);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.search(query);
        setResults(res.results);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'deal':
        return <Kanban className="w-4 h-4 text-indigo-500" />;
      case 'contact':
        return <Users className="w-4 h-4 text-emerald-500" />;
      case 'company':
        return <Building2 className="w-4 h-4 text-blue-500" />;
      case 'lead':
        return <Flame className="w-4 h-4 text-amber-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  const handleSelect = (item: { type: string; id: string }) => {
    setIsSearchOpen(false);
    if (item.type === 'deal') {
      setActiveView('deals');
      setSelectedDealId(item.id);
    } else if (item.type === 'contact') {
      setActiveView('contacts');
      setSelectedContactId(item.id);
    } else if (item.type === 'company') {
      setActiveView('companies');
      setSelectedCompanyId(item.id);
    } else if (item.type === 'lead') {
      setActiveView('leads');
      setSelectedLeadId(item.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search across Deals, Leads, Contacts, Accounts..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 outline-hidden"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Searching CRM database...</div>
          ) : query && results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No records found matching "{query}"</div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              {results.map(item => (
                <button
                  key={`${item.type}_${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors">
                      {getEntityIcon(item.type)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">{item.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{item.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <span className="text-[10px] font-semibold uppercase tracking-wider capitalize">{item.type}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-6 px-4 text-center">
              <p className="text-xs text-slate-400">Quickly find Deals, Contacts, Accounts, or Leads.</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">Deals</span>
                <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">Leads</span>
                <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">Contacts</span>
                <span className="text-[11px] px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">Companies</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
