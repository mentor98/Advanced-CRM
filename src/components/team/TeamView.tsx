import React from 'react';
import {
  ShieldCheck,
  Users,
  Award,
  Lock,
  CheckCircle2,
  XCircle,
  Plus,
  Mail,
  Phone,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCRM } from '../../context/CRMContext';
import { UserRole } from '../../types';

export const TeamView: React.FC = () => {
  const { users, currentUser, switchUser } = useAuth();
  const { metrics } = useCRM();

  const permissionsMatrix: { feature: string; admin: boolean; sales_manager: boolean; sales_rep: boolean; marketing: boolean; analyst: boolean }[] = [
    { feature: 'View Dashboard & Reports', admin: true, sales_manager: true, sales_rep: true, marketing: true, analyst: true },
    { feature: 'Create & Update Deals', admin: true, sales_manager: true, sales_rep: true, marketing: false, analyst: false },
    { feature: 'Delete Deals & Accounts', admin: true, sales_manager: true, sales_rep: false, marketing: false, analyst: false },
    { feature: 'Convert Leads to Accounts', admin: true, sales_manager: true, sales_rep: true, marketing: true, analyst: false },
    { feature: 'Run AI Sales Copilot', admin: true, sales_manager: true, sales_rep: true, marketing: true, analyst: true },
    { feature: 'Send Emails & Log Notes', admin: true, sales_manager: true, sales_rep: true, marketing: true, analyst: false },
    { feature: 'Manage User Accounts & Quotas', admin: true, sales_manager: false, sales_rep: false, marketing: false, analyst: false },
    { feature: 'View Audit Logs', admin: true, sales_manager: true, sales_rep: false, marketing: false, analyst: true },
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Team Members & Role-Based Access Control (RBAC)
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Manage sales team quotas, individual attainments, and security permission scopes
        </p>
      </div>

      {/* Team Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => {
          const isMe = user.id === currentUser?.id;
          const repPerf = (metrics?.dealsByRep || []).find(r => r.repId === user.id);
          const won = repPerf?.wonValue || 0;
          const quota = user.quota || 500000;
          const pct = repPerf?.attainment || Math.min(100, Math.round((won / quota) * 100));

          return (
            <div
              key={user.id}
              className={`p-5 rounded-xl bg-white dark:bg-slate-900 border transition-all shadow-2xs flex flex-col justify-between space-y-4 ${
                isMe
                  ? 'border-blue-600 ring-1 ring-blue-600/30'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{user.name}</span>
                      {isMe && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                          YOU
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quota Progress */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Quarterly Target Attainment</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Won: ${(won / 1000).toFixed(0)}k</span>
                  <span>Quota: ${(quota / 1000).toFixed(0)}k</span>
                </div>
              </div>

              {/* Switch View Trigger for RBAC Demo */}
              <button
                onClick={() => switchUser(user.id)}
                disabled={isMe}
                className={`w-full py-1.5 rounded-md text-xs font-semibold transition-colors ${
                  isMe
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                }`}
              >
                {isMe ? 'Active Profile' : `Switch to ${user.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {/* RBAC Permissions Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-2xs space-y-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-blue-600" />
            <span>Role-Based Access Control (RBAC) Permissions Matrix</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Strict granular security controls enforced at both API route and UI component layers
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500 dark:text-slate-400">
              <tr>
                <th className="p-3">Capability / Operation</th>
                <th className="p-3 text-center">Admin</th>
                <th className="p-3 text-center">Sales Manager</th>
                <th className="p-3 text-center">Sales Rep</th>
                <th className="p-3 text-center">Marketing</th>
                <th className="p-3 text-center">Analyst</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.feature}</td>
                  <td className="p-3 text-center">
                    {row.admin ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.sales_manager ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.sales_rep ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.marketing ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                    )}
                  </td>
                  <td className="p-3 text-center">
                    {row.analyst ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-300 dark:text-slate-700 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
