import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Zap,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Lock,
  Camera,
  Scale,
  Users,
  Compass,
} from 'lucide-react';

interface HomeHeroProps {
  onExplore: () => void;
  onOpenAIMatcher: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onExplore, onOpenAIMatcher }) => {
  const { resources, bookings, currentUser, switchUser } = useApp();

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white p-8 sm:p-12 lg:p-16 border border-indigo-900/40 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.25),rgba(255,255,255,0))]"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            CodeHack India 2026 Innovation Track
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-indigo-200">
            Make Idle Resources Useful.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Share Safely. Access Fairly.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Institutional laboratories, makerspaces, high-end equipment, and collaborative war rooms often sit empty for over 65% of the week. <strong className="text-white font-medium">ShareSpace</strong> unites campus resource owners and students through trusted verification, safety checklists, owner approval, and transparent audit trails.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Compass className="w-4 h-4" />
              Explore Campus Equipment
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              onClick={onOpenAIMatcher}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-purple-200 border border-purple-500/30 font-medium text-sm hover:scale-[1.02] active:scale-[0.98] transition-all backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              AI Resource Matcher
            </button>
          </div>

          {/* Quick Stats Pill Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-slate-800/80 text-left">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-white">{resources.length}</div>
              <div className="text-xs text-slate-400">Institutional Assets Listed</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-slate-400">Inspected Check-in / Return</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-indigo-400">{bookings.length}</div>
              <div className="text-xs text-slate-400">Active & Historical Bookings</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-2xl font-bold text-cyan-400">0 Overlaps</div>
              <div className="text-xs text-slate-400">Double-Booking Prevention</div>
            </div>
          </div>
        </div>
      </section>

      {/* Evaluator Quick Tour Card */}
      <section className="bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-slate-800/80 dark:to-slate-900/80 p-6 sm:p-8 rounded-2xl border border-indigo-100 dark:border-slate-700 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                Hackathon Judge Guide
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                End-to-End Workflow Demonstration
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Try the complete lifecycle across 4 roles:
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
              1. <strong>Student (Aarav):</strong> Book the Sony DSLR or 3D Printer. <br />
              2. <strong>Owner (Dr. Priya):</strong> Review & approve booking request with required reason. <br />
              3. <strong>Student:</strong> Complete pre-use inspection checklist & check in. Then return & check out with damage checklist. <br />
              4. <strong>Manager (Prof. Rajesh):</strong> Review disputes with AI summarizer and inspect immutable audit trail.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => switchUser('user-student-1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentUser.id === 'user-student-1'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border'
              }`}
            >
              Step 1: Student (Aarav)
            </button>
            <button
              onClick={() => switchUser('user-owner-1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentUser.id === 'user-owner-1'
                  ? 'bg-blue-600 text-white shadow'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border'
              }`}
            >
              Step 2: Owner (Dr. Priya)
            </button>
            <button
              onClick={() => switchUser('user-manager-1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentUser.id === 'user-manager-1'
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border'
              }`}
            >
              Step 3: Manager (Prof. Rajesh)
            </button>
            <button
              onClick={() => switchUser('user-admin-1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                currentUser.id === 'user-admin-1'
                  ? 'bg-amber-600 text-white shadow'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border'
              }`}
            >
              Step 4: Admin Dev
            </button>
          </div>
        </div>
      </section>

      {/* The 4 Core Problem Pillars Addressed */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Why Ordinary Booking Systems Fail Campus Sharing
          </h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Traditional calendar tools do not address safety qualifications, damage accountability, owner approvals, and fair access caps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Institutional Eligibility
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Enforces lab safety certifications (Level 1, 3D printing operator, CNC machining) and institutional identity before unlocking booking requests.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Camera className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Check-In & Return Audit
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Mandatory before-and-after condition checklists, clean status verification, and evidence notes ensure resources are returned intact without disputes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Fair Allocation & Waiting Lists
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Limits active concurrent reservations to prevent monopolisation. Includes automated priority waiting lists that promote users on cancellations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Role-Based Governance
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Four distinct roles (Student, Owner, Manager, Admin) with granular security rules, human-reviewed incident resolution, and immutable logs.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits for Institutions */}
      <section className="bg-slate-900 text-white p-8 sm:p-12 rounded-3xl border border-slate-800 shadow-xl space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
            Institutional Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            How ShareSpace Transforms Campuses & Research Facilities
          </h2>
          <p className="text-sm text-slate-300">
            Maximising the return on expensive lab equipment, high-performance computing clusters, and seminar spaces while maintaining zero loss of accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="text-emerald-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 4.2x Utilization Increase
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Idle weekend and evening hours in computer labs, laser cutters, and studio spaces are unlocked for verified project teams.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="text-teal-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> 88% Fewer Equipment Disputes
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standardized pre-inspection checklists and return logs pinpoint exactly when damage occurred, eliminating finger-pointing.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="text-indigo-400 font-bold text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Democratized Innovation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Student builders without deep personal budgets can access industrial-grade tools (4K cinema cameras, GPU clusters, 6-axis robot arms).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
