import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Layers,
} from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { resources, bookings, incidents, waitlists } = useApp();

  // Compute metrics from REAL state
  const totalBookings = bookings.length;
  const returnedCount = bookings.filter((b) => b.status === 'returned').length;
  const activeCount = bookings.filter((b) => b.status === 'checked_in').length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const lateReturnsCount = bookings.filter((b) => b.isLateReturn).length;
  const onTimePercentage =
    returnedCount > 0 ? Math.round(((returnedCount - lateReturnsCount) / returnedCount) * 100) : 100;

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  resources.forEach((r) => {
    categoryCounts[r.category] = (categoryCounts[r.category] || 0) + 1;
  });

  const categories = Object.keys(categoryCounts);
  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  // Utilization calculation per resource category
  const categoryBookings: Record<string, number> = {};
  bookings.forEach((b) => {
    categoryBookings[b.resourceCategory] = (categoryBookings[b.resourceCategory] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Total Bookings
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalBookings}</div>
          <div className="text-[11px] text-emerald-600 font-medium">
            {activeCount} active in session right now
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            On-Time Return Rate
          </div>
          <div className="text-2xl font-bold text-emerald-600">{onTimePercentage}%</div>
          <div className="text-[11px] text-slate-400">
            {lateReturnsCount} flagged handover delays
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            Pending Action
          </div>
          <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
          <div className="text-[11px] text-slate-400">
            {waitlists.length} users on queue waitlists
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            Dispute & Incident Ratio
          </div>
          <div className="text-2xl font-bold text-rose-600">{incidents.length}</div>
          <div className="text-[11px] text-slate-400">
            {incidents.filter((i) => i.status === 'resolved').length} resolved after human review
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Resource Distribution by Category */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-500" />
                Resource Catalog Distribution & Allocation
              </h4>
              <p className="text-xs text-slate-500">Live inventory across campus departments</p>
            </div>
            <span className="text-[11px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded font-semibold">
              {resources.length} Total Units
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const bookingCount = categoryBookings[cat] || 0;
              const percent = Math.round((count / resources.length) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{cat}</span>
                    <span className="text-slate-500 font-semibold">
                      {count} items • {bookingCount} bookings
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Booking Status Breakdown */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-teal-500" />
                Lifecycle Stage Status Composition
              </h4>
              <p className="text-xs text-slate-500">Real-time state of all recorded reservations</p>
            </div>
            <span className="text-[11px] bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300 px-2 py-0.5 rounded font-semibold">
              {totalBookings} Total
            </span>
          </div>

          {/* Visual Stacked Bar */}
          <div className="h-6 w-full rounded-xl overflow-hidden flex bg-slate-100 dark:bg-slate-700">
            {totalBookings > 0 && (
              <>
                <div
                  title={`Returned: ${returnedCount}`}
                  style={{ width: `${(returnedCount / totalBookings) * 100}%` }}
                  className="bg-slate-500 h-full"
                ></div>
                <div
                  title={`Active: ${activeCount}`}
                  style={{ width: `${(activeCount / totalBookings) * 100}%` }}
                  className="bg-indigo-600 h-full"
                ></div>
                <div
                  title={`Approved: ${bookings.filter((b) => b.status === 'approved').length}`}
                  style={{
                    width: `${(bookings.filter((b) => b.status === 'approved').length / totalBookings) * 100}%`,
                  }}
                  className="bg-emerald-500 h-full"
                ></div>
                <div
                  title={`Pending: ${pendingCount}`}
                  style={{ width: `${(pendingCount / totalBookings) * 100}%` }}
                  className="bg-amber-400 h-full"
                ></div>
                <div
                  title={`Incidents: ${bookings.filter((b) => b.status === 'incident_reported').length}`}
                  style={{
                    width: `${(bookings.filter((b) => b.status === 'incident_reported').length / totalBookings) * 100}%`,
                  }}
                  className="bg-rose-500 h-full"
                ></div>
              </>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
              <span className="text-slate-600 dark:text-slate-400">Returned: {returnedCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span className="text-slate-600 dark:text-slate-400">Active Session: {activeCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-600 dark:text-slate-400">
                Approved: {bookings.filter((b) => b.status === 'approved').length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-slate-600 dark:text-slate-400">Pending Approval: {pendingCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-600 dark:text-slate-400">
                Incidents: {bookings.filter((b) => b.status === 'incident_reported').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
