import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import {
  Users,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  UserPlus,
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { users, currentUser, updateUserRole } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.institution.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Institutional User & Role Governance
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Centrally manage user roles, institutional verification status, and laboratory qualification badges.
          </p>
        </div>

        <div className="text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 font-medium">
          Admin Privilege Mode: Role alterations are restricted to authorized administrators.
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, department, or institution..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
        >
          <option value="all">All Roles</option>
          <option value="student">Students / Researchers</option>
          <option value="owner">Resource Owners</option>
          <option value="manager">Facility Managers</option>
          <option value="admin">Administrators</option>
        </select>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((u) => {
          const isCurrentUser = u.id === currentUser.id;

          return (
            <div
              key={u.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-4 hover:border-indigo-300 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={u.name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      {u.name}
                      {isCurrentUser && (
                        <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.2 rounded font-bold">
                          You
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-500">{u.email}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{u.department}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      u.isVerified
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {u.isVerified ? (
                      <>
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-3.5 h-3.5" />
                        <span>Unverified</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Institution & Qualifications */}
              <div className="text-xs space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{u.institution}</span>
                </div>

                {u.qualifications && u.qualifications.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {u.qualifications.map((q, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Admin Control Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-slate-500">Role:</span>
                  <select
                    value={u.role}
                    disabled={currentUser.role !== 'admin'}
                    onChange={(e) =>
                      updateUserRole(u.id, e.target.value as UserRole, u.isVerified)
                    }
                    className="text-xs px-2 py-1 rounded-lg border bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="student">Student / User</option>
                    <option value="owner">Resource Owner</option>
                    <option value="manager">Facility Manager</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                {currentUser.role === 'admin' && (
                  <button
                    onClick={() => updateUserRole(u.id, u.role, !u.isVerified)}
                    className={`text-xs px-3 py-1 rounded-lg font-semibold transition ${
                      u.isVerified
                        ? 'text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950'
                        : 'text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950'
                    }`}
                  >
                    {u.isVerified ? 'Revoke Verification' : 'Grant Verification'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
