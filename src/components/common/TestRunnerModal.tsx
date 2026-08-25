import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Play, RefreshCw, FlaskConical, Shield, Database, Cpu, Layers } from 'lucide-react';
import { useCRM } from '../../context/CRMContext';
import { api } from '../../api';
import { TestSuiteResult } from '../../types';

export const TestRunnerModal: React.FC = () => {
  const { isTestRunnerOpen, setIsTestRunnerOpen, addToast } = useCRM();
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TestSuiteResult | null>(null);

  const runTests = async () => {
    try {
      setRunning(true);
      const res = await api.runAutomatedTests();
      setResults(res.testResults);
      if (res.testResults.failed === 0) {
        addToast({ type: 'success', title: 'All Automated Tests Passed!' });
      } else {
        addToast({ type: 'warning', title: `${res.testResults.failed} Tests Failed` });
      }
    } catch (err: any) {
      addToast({ type: 'error', title: 'Test execution error', message: err.message });
    } finally {
      setRunning(false);
    }
  };

  useEffect(() => {
    if (isTestRunnerOpen && !results && !running) {
      runTests();
    }
  }, [isTestRunnerOpen]);

  if (!isTestRunnerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Automated Test Suite Runner
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                End-to-end assertions verifying REST API, RBAC, Lead Conversion & Store integrity
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTestRunnerOpen(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Metrics bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Total: </span>
              <strong className="text-slate-900 dark:text-white">{results?.total || 0}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Passed: </span>
              <strong className="text-emerald-600 dark:text-emerald-400">{results?.passed || 0}</strong>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Failed: </span>
              <strong className="text-rose-600 dark:text-rose-400">{results?.failed || 0}</strong>
            </div>
            {results?.durationMs !== undefined && (
              <div>
                <span className="text-slate-500 dark:text-slate-400">Duration: </span>
                <strong className="text-slate-700 dark:text-slate-300">{results.durationMs}ms</strong>
              </div>
            )}
          </div>

          <button
            onClick={runTests}
            disabled={running}
            className="px-3.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50"
          >
            {running ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            <span>{running ? 'Executing...' : 'Re-run Tests'}</span>
          </button>
        </div>

        {/* Test Result List */}
        <div className="p-5 max-h-96 overflow-y-auto space-y-2.5 text-xs">
          {running && !results ? (
            <div className="py-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              <p>Executing test matrix against CRM store...</p>
            </div>
          ) : results ? (
            results.tests.map(test => (
              <div
                key={test.id}
                className={`p-3 rounded-lg border flex items-start justify-between gap-3 transition-colors ${
                  test.status === 'passed'
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-800 dark:text-slate-200'
                    : 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {test.status === 'passed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-xs">{test.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{test.description}</p>
                    {test.error && (
                      <p className="mt-1 font-mono text-[10px] text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900 p-1.5 rounded border border-rose-200 dark:border-rose-800">
                        {test.error}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-[10px] font-mono text-slate-400 whitespace-nowrap">
                  {test.durationMs}ms
                </div>
              </div>
            ))
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={() => setIsTestRunnerOpen(false)}
            className="px-4 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
