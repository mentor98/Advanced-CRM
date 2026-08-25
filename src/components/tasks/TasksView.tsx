import React, { useState } from 'react';
import {
  Plus,
  CheckSquare,
  Square,
  Calendar,
  Clock,
  AlertCircle,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
} from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api';
import { Task } from '../../types';

export const TasksView: React.FC = () => {
  const { tasks, toggleTaskStatus, refreshAll, addToast, openQuickCreate } = useCRM();
  const { users, canDelete } = useAuth();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [repFilter, setRepFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter(t => {
    const matchSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'pending'
        ? t.status !== 'completed'
        : t.status === 'completed';
    const matchRep = repFilter === 'all' || t.assignedToId === repFilter;
    return matchSearch && matchStatus && matchRep;
  });

  const handleDelete = async (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.deleteTask(taskId);
      addToast({ type: 'info', title: 'Task Deleted' });
      refreshAll();
    } catch (err: any) {
      addToast({ type: 'error', title: 'Failed to delete task', message: err.message });
    }
  };

  return (
    <div className="p-6 space-y-5 max-w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Tasks, Reminders & Follow-Ups
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {filteredTasks.length} action items requiring deal team execution
          </p>
        </div>

        <button
          onClick={() => openQuickCreate('task')}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="w-full bg-transparent text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="all">All</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 font-medium">Assignee:</span>
          <select
            value={repFilter}
            onChange={e => setRepFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200"
          >
            <option value="all">All Team</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800 text-xs">
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No tasks found matching your filters.</div>
        ) : (
          filteredTasks.map(task => {
            const isCompleted = task.status === 'completed';
            const isOverdue = !isCompleted && new Date(task.dueDate).getTime() < Date.now();

            return (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id, task.status)}
                className={`p-4 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                  isCompleted ? 'opacity-60 bg-slate-50/40 dark:bg-slate-900/40' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleTaskStatus(task.id, task.status);
                    }}
                    className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400" />
                    )}
                  </button>

                  <div>
                    <p
                      className={`font-semibold text-slate-900 dark:text-white ${
                        isCompleted ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{task.description}</p>
                    )}
                    {task.relatedTitle && (
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1 block">
                        Linked: {task.relatedTitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      task.priority === 'urgent'
                        ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        : task.priority === 'high'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {task.priority}
                  </span>

                  <span
                    className={`text-[11px] flex items-center gap-1 font-medium ${
                      isOverdue
                        ? 'text-rose-600 dark:text-rose-400 font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </span>

                  {canDelete && (
                    <button
                      onClick={e => handleDelete(task.id, e)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
