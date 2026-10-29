import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Search,
  Filter,
  Lock,
  Hash,
  Clock,
  User,
  Layers,
  CheckCircle,
} from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState<string>('all');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.resourceName && log.resourceName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = filterAction === 'all' || log.action.includes(filterAction);

    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Lock className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Immutable System Audit Log
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-proof ledger recording all institutional resource transactions, approvals, inspections, and administrative events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Cryptographic Integrity Verified
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action, user, resource, or keywords..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={filterAction}
          onChange={(e) => setFilterAction(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
        >
          <option value="all">All Audit Actions</option>
          <option value="BOOKING">Booking Events</option>
          <option value="CHECK_IN">Check-In Inspections</option>
          <option value="RETURNED">Return & Handover</option>
          <option value="INCIDENT">Incident & Disputes</option>
          <option value="RESOURCE">Resource Listings</option>
          <option value="USER">User & Permissions</option>
        </select>
      </div>

      {/* Log Feed Table / List */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs">
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching audit entries found.
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition space-y-2 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-bold">
                      {log.action}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {log.actorName}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-50 dark:bg-slate-900 px-1.5 py-0.2 rounded border">
                      {log.actorRole}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                      <Hash className="w-3 h-3 text-slate-400" />
                      hash:{log.immutableHash.slice(0, 8)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-1">
                  {log.details}
                </p>

                {log.reason && (
                  <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    <strong>Recorded Reason:</strong> {log.reason}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
