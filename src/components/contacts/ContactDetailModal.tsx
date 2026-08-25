import React, { useState, useEffect } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  Calendar,
  Send,
  Trash2,
  Briefcase,
  ExternalLink,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { Contact, Company, Deal, Activity } from '../../types';

export const ContactDetailModal: React.FC = () => {
  const {
    selectedContactId,
    setSelectedContactId,
    contacts,
    refreshAll,
    addToast,
    openQuickCreate,
  } = useCRM();

  const { canDelete } = useAuth();

  const [contact, setContact] = useState<Contact | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (!selectedContactId) {
      setContact(null);
      return;
    }

    const fetchDetail = async () => {
      try {
        const res = await api.getContact(selectedContactId);
        setContact(res.contact);
        setCompany(res.company || null);
        setDeals(res.deals || []);
        setActivities(res.activities || []);
      } catch (err) {
        console.error('Failed to load contact:', err);
      }
    };

    fetchDetail();
  }, [selectedContactId, contacts]);

  if (!selectedContactId) return null;

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim() || !contact) return;

    try {
      const res = await api.createActivity({
        type: 'note',
        title: `Note on ${contact.firstName} ${contact.lastName}`,
        description: noteText,
        relatedType: 'contact',
        relatedId: contact.id,
      });
      setActivities(prev => [res.activity, ...prev]);
      setNoteText('');
      addToast({ type: 'success', title: 'Note Logged' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to add note', message: err.message });
    }
  };

  const handleDelete = async () => {
    if (!contact) return;
    if (window.confirm(`Delete contact "${contact.firstName} ${contact.lastName}"?`)) {
      try {
        await api.deleteContact(contact.id);
        addToast({ type: 'info', title: 'Contact Deleted' });
        setSelectedContactId(null);
        refreshAll();
      } catch (err: any) {
        addToast({ type: 'error', title: 'Delete failed', message: err.message });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/60 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-lg shadow-xs">
              {contact?.firstName[0]}{contact?.lastName[0]}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {contact?.firstName} {contact?.lastName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{contact?.title} at <strong>{contact?.companyName}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openQuickCreate('email')}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
            {canDelete && (
              <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-rose-600 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={() => setSelectedContactId(null)} className="p-2 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Metadata Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[11px] block">Email Address</span>
              <a href={`mailto:${contact?.email}`} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline truncate block">
                {contact?.email}
              </a>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[11px] block">Direct Phone</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{contact?.phone || 'N/A'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 text-[11px] block">Department</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{contact?.department}</span>
            </div>
          </div>

          {/* Associated Deals */}
          <div>
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider text-slate-400 mb-2">
              Associated Deals ({deals.length})
            </h3>
            {deals.length === 0 ? (
              <p className="text-slate-400 text-xs italic">No active deals associated with this contact.</p>
            ) : (
              <div className="space-y-2">
                {deals.map(d => (
                  <div
                    key={d.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{d.title}</p>
                      <p className="text-[11px] text-slate-500">Stage: {d.stage} • Close: {d.expectedCloseDate}</p>
                    </div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ${d.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Log Note Form */}
          <form onSubmit={handleAddNote} className="space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-white">Add Contact Note</h4>
            <textarea
              rows={2}
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              placeholder="Add key conversation takeaways or personal preferences..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!noteText.trim()}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>Save Note</span>
              </button>
            </div>
          </form>

          {/* Activities */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
              Interaction Log ({activities.length})
            </h3>
            {activities.map(a => (
              <div key={a.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{a.title}</span>
                  <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 mt-1">{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
