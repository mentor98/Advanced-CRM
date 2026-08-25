import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sparkles,
  Sun,
  Moon,
  FlaskConical,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  Shield,
  Briefcase,
  Layers,
  X,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useCRM } from '../../context/CRMContext';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { currentUser, users, switchUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setIsSearchOpen,
    openQuickCreate,
    openAICopilot,
    setIsTestRunnerOpen,
    setActiveView,
  } = useCRM();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isQuickCreateMenuOpen, setIsQuickCreateMenuOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const quickCreateMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.read);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setIsNotifMenuOpen(false);
      }
      if (quickCreateMenuRef.current && !quickCreateMenuRef.current.contains(e.target as Node)) {
        setIsQuickCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'admin':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/80 dark:text-purple-300">Admin</span>;
      case 'sales_manager':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950/80 dark:text-blue-300">Manager</span>;
      case 'sales_rep':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300">Sales Rep</span>;
      case 'marketing':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300">Marketing</span>;
      case 'analyst':
        return <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Analyst</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 sm:px-8 flex items-center justify-between transition-colors">
      {/* Left: Global Search Bar Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between text-left text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/80 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400" />
            <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Search records, deals, or emails...</span>
          </div>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-500 dark:text-slate-400 shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Actions & Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Automated Test Suite Button */}
        <button
          onClick={() => setIsTestRunnerOpen(true)}
          title="Run Automated API & Integrity Tests"
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <FlaskConical className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="hidden md:inline">Run Tests</span>
        </button>

        {/* AI Copilot Trigger */}
        <button
          onClick={() => openAICopilot()}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span className="hidden sm:inline">AI Copilot</span>
        </button>

        {/* Quick Create / + New Deal Button matching Professional Polish */}
        <div className="relative" ref={quickCreateMenuRef}>
          <button
            onClick={() => setIsQuickCreateMenuOpen(prev => !prev)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Deal</span>
            <ChevronDown className="w-3 h-3 ml-0.5 opacity-80" />
          </button>

          {isQuickCreateMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-sm animate-in fade-in">
              <button
                onClick={() => { openQuickCreate('deal'); setIsQuickCreateMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                New Deal (Opportunity)
              </button>
              <button
                onClick={() => { openQuickCreate('lead'); setIsQuickCreateMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                New Lead
              </button>
              <button
                onClick={() => { openQuickCreate('contact'); setIsQuickCreateMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                New Contact
              </button>
              <button
                onClick={() => { openQuickCreate('company'); setIsQuickCreateMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                New Company
              </button>
              <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
              <button
                onClick={() => { openQuickCreate('task'); setIsQuickCreateMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                New Task
              </button>
              <button
                onClick={() => { openQuickCreate('email'); setIsQuickCreateMenuOpen(false); }}
                className="w-full text-left px-3.5 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200 text-xs font-medium"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                Compose Email
              </button>
            </div>
          )}
        </div>

        {/* Notifications Button */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setIsNotifMenuOpen(prev => !prev)}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          {isNotifMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">No notifications yet.</p>
                ) : (
                  notifications.slice(0, 6).map(notif => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.link) {
                          if (notif.link === '/deals') setActiveView('deals');
                          if (notif.link === '/leads') setActiveView('leads');
                          if (notif.link === '/tasks') setActiveView('tasks');
                          if (notif.link === '/dashboard') setActiveView('dashboard');
                        }
                        setIsNotifMenuOpen(false);
                      }}
                      className={`p-2.5 rounded-lg text-xs transition cursor-pointer ${
                        notif.read
                          ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                          : 'bg-indigo-50/60 dark:bg-indigo-950/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/70 text-slate-800 dark:text-slate-200 font-medium'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white text-xs">{notif.title}</p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] mt-0.5 text-slate-500 dark:text-slate-400">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Active Role Switcher Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(prev => !prev)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
            />
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{currentUser?.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{currentUser?.role.replace('_', ' ')}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden lg:block" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-in fade-in">
              <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-2">
                <p className="text-xs font-bold text-slate-900 dark:text-white">{currentUser?.name}</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{currentUser?.email}</p>
                <div className="mt-1 flex items-center justify-between">
                  {getRoleBadge(currentUser?.role)}
                  <span className="text-[10px] text-slate-400">{currentUser?.department}</span>
                </div>
              </div>

              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 mb-1">
                Switch Role / Actor (RBAC Demo)
              </div>

              <div className="space-y-1">
                {users.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      switchUser(u.id);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs transition ${
                      u.id === currentUser?.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 font-semibold text-indigo-600 dark:text-indigo-300'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </div>
                    {getRoleBadge(u.role)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
