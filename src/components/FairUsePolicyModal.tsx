import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FairUseRules } from '../types';
import {
  X,
  Scale,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface FairUsePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FairUsePolicyModal: React.FC<FairUsePolicyModalProps> = ({ isOpen, onClose }) => {
  const { fairUseRules, updateFairUseRules, currentUser } = useApp();

  const [maxActive, setMaxActive] = useState(fairUseRules.maxActiveBookingsPerUser);
  const [maxHours, setMaxHours] = useState(fairUseRules.maxHoursPerWeekPerUser);
  const [requireVerification, setRequireVerification] = useState(
    fairUseRules.requireInstitutionalVerification
  );
  const [waitingPolicy, setWaitingPolicy] = useState(fairUseRules.waitingListPolicy);
  const [gracePeriod, setGracePeriod] = useState(fairUseRules.autoOverdueGracePeriodMinutes);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFairUseRules({
      maxActiveBookingsPerUser: maxActive,
      maxHoursPerWeekPerUser: maxHours,
      requireInstitutionalVerification: requireVerification,
      waitingListPolicy: waitingPolicy,
      autoOverdueGracePeriodMinutes: gracePeriod,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Campus Fair-Use & Allocation Policies
              </h3>
              <p className="text-xs text-slate-500">
                Prevent monopolisation and enforce equitable access to campus resources
              </p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Concurrent Active Bookings Per Student
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={maxActive}
                onChange={(e) => setMaxActive(parseInt(e.target.value, 10) || 1)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400">
                Prevents a single user from hoarding multiple slots across the week.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Max Weekly Reserved Hours Cap
              </label>
              <input
                type="number"
                min={2}
                max={40}
                value={maxHours}
                onChange={(e) => setMaxHours(parseInt(e.target.value, 10) || 12)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Waiting List Prioritisation Algorithm
              </label>
              <select
                value={waitingPolicy}
                onChange={(e) => setWaitingPolicy(e.target.value as any)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="balanced">Balanced (First-Come First-Served + Institutional Priority)</option>
                <option value="fcfs">Strict First-Come First-Served (FCFS)</option>
                <option value="academic_priority">Academic & Capstone Finalist Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Overdue Handover Grace Period (Minutes)
              </label>
              <input
                type="number"
                min={0}
                max={60}
                value={gracePeriod}
                onChange={(e) => setGracePeriod(parseInt(e.target.value, 10) || 15)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={requireVerification}
                onChange={(e) => setRequireVerification(e.target.checked)}
                className="mt-0.5 rounded text-purple-600"
              />
              <div className="text-xs">
                <div className="font-semibold text-slate-900 dark:text-white">
                  Enforce Mandatory Institutional Verification
                </div>
                <div className="text-slate-500">
                  When enabled, unverified external accounts cannot place reservation requests.
                </div>
              </div>
            </label>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md transition"
              >
                Apply Fair-Use Rules
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
