import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking, Resource, Incident } from '../types';
import { BookingCard } from './BookingCard';
import { AnalyticsCharts } from './AnalyticsCharts';
import { UserManagementView } from './UserManagementView';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Plus,
  Scale,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  Building2,
  Calendar,
  XCircle,
  FileText,
} from 'lucide-react';

interface DashboardViewProps {
  onCheckIn: (booking: Booking) => void;
  onCheckOut: (booking: Booking) => void;
  onReportIncident: (booking: Booking) => void;
  onReviewIncident: (incident: Incident) => void;
  onOpenCreateResource: () => void;
  onOpenFairUsePolicy: () => void;
  onOpenAIMatcher: () => void;
  onNavigateCatalogue: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onCheckIn,
  onCheckOut,
  onReportIncident,
  onReviewIncident,
  onOpenCreateResource,
  onOpenFairUsePolicy,
  onOpenAIMatcher,
  onNavigateCatalogue,
}) => {
  const { currentUser, bookings, resources, waitlists, incidents, updateResource } = useApp();

  // Sub-tabs for Owner / Manager / Admin
  const [activeSubTab, setActiveSubTab] = useState<string>('bookings');

  // Student specific datasets
  const myBookings = bookings.filter((b) => b.userId === currentUser.id);
  const myActiveBookings = myBookings.filter(
    (b) => b.status === 'checked_in' || b.status === 'approved'
  );
  const myPendingBookings = myBookings.filter((b) => b.status === 'pending');
  const myCompletedBookings = myBookings.filter((b) => b.status === 'returned');
  const myWaitlist = waitlists.filter((w) => w.userId === currentUser.id);

  // Owner specific datasets
  const myOwnedResources = resources.filter((r) => r.ownerId === currentUser.id);
  const ownerPendingBookings = bookings.filter(
    (b) => b.ownerId === currentUser.id && b.status === 'pending'
  );
  const ownerActiveBookings = bookings.filter(
    (b) => b.ownerId === currentUser.id && b.status === 'checked_in'
  );

  // Incidents pending review
  const pendingIncidents = incidents.filter((i) => i.status === 'under_review');

  return (
    <div className="space-y-8">
      {/* Role Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-900/50">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-indigo-300">
              {currentUser.role.toUpperCase()} WORKSPACE
            </span>
            {currentUser.isVerified && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Campus Identity
              </span>
            )}
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {currentUser.department} • {currentUser.institution}
          </p>
        </div>

        {/* Header Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          {currentUser.role === 'student' && (
            <button
              onClick={onNavigateCatalogue}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition"
            >
              Browse Equipment
            </button>
          )}

          {(currentUser.role === 'owner' || currentUser.role === 'admin') && (
            <button
              onClick={onOpenCreateResource}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List New Equipment</span>
            </button>
          )}

          {(currentUser.role === 'manager' || currentUser.role === 'admin') && (
            <button
              onClick={onOpenFairUsePolicy}
              className="px-4 py-2 rounded-xl text-xs font-bold text-purple-200 bg-purple-900/70 hover:bg-purple-800 border border-purple-500/40 shadow-md transition flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Configure Fair-Use Rules</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. STUDENT VIEW                                            */}
      {/* ========================================================= */}
      {currentUser.role === 'student' && (
        <div className="space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">In Session / Ready</span>
              <div className="text-2xl font-bold text-emerald-600">{myActiveBookings.length}</div>
              <p className="text-[11px] text-slate-400">Ready for inspection</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Pending Approvals</span>
              <div className="text-2xl font-bold text-amber-600">{myPendingBookings.length}</div>
              <p className="text-[11px] text-slate-400">Awaiting owner review</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Waiting List Queue</span>
              <div className="text-2xl font-bold text-purple-600">{myWaitlist.length}</div>
              <p className="text-[11px] text-slate-400">Automatic promotion active</p>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Completed Sessions</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {myCompletedBookings.length}
              </div>
              <p className="text-[11px] text-emerald-500 font-medium">100% compliance score</p>
            </div>
          </div>

          {/* Active Bookings (Check In / Check Out) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                My Active & Upcoming Reservations ({myActiveBookings.length})
              </h3>
            </div>

            {myActiveBookings.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-500">You have no active reservations in progress.</p>
                <button
                  onClick={onNavigateCatalogue}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Browse catalogue and book a slot
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myActiveBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onCheckIn={onCheckIn}
                    onCheckOut={onCheckOut}
                    onReportIncident={onReportIncident}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pending Requests */}
          {myPendingBookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Pending Owner Review ({myPendingBookings.length})
              </h3>
              <div className="space-y-4">
                {myPendingBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onCheckIn={onCheckIn}
                    onCheckOut={onCheckOut}
                    onReportIncident={onReportIncident}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Waiting List Status */}
          {myWaitlist.length > 0 && (
            <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 space-y-3">
              <h3 className="text-sm font-bold text-purple-950 dark:text-purple-300 flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-purple-600" />
                Waiting List Queue Positions
              </h3>
              <div className="space-y-2">
                {myWaitlist.map((w) => (
                  <div
                    key={w.id}
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-purple-100 dark:border-purple-900 flex justify-between items-center text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{w.resourceName}</span>
                      <span className="text-slate-500 block text-[11px]">
                        Slot requested: {w.requestedDate} ({w.requestedTimeSlot})
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        w.status === 'promoted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {w.status === 'promoted' ? 'Slot Held For You!' : 'Queue Position #1'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Past Returned Items History */}
          {myCompletedBookings.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Completed Handover History ({myCompletedBookings.length})
              </h3>
              <div className="space-y-4">
                {myCompletedBookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onCheckIn={onCheckIn}
                    onCheckOut={onCheckOut}
                    onReportIncident={onReportIncident}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. OWNER VIEW                                             */}
      {/* ========================================================= */}
      {currentUser.role === 'owner' && (
        <div className="space-y-8">
          {/* Action Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs font-semibold gap-6">
            <button
              onClick={() => setActiveSubTab('pending')}
              className={`pb-3 relative ${
                activeSubTab === 'pending'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pending Approval Requests
              {ownerPendingBookings.length > 0 && (
                <span className="ml-2 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-white font-bold">
                  {ownerPendingBookings.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSubTab('active')}
              className={`pb-3 relative ${
                activeSubTab === 'active'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Active Check-Outs & Inspections ({ownerActiveBookings.length})
            </button>
            <button
              onClick={() => setActiveSubTab('listings')}
              className={`pb-3 relative ${
                activeSubTab === 'listings'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              My Managed Resources ({myOwnedResources.length})
            </button>
            <button
              onClick={() => setActiveSubTab('analytics')}
              className={`pb-3 relative ${
                activeSubTab === 'analytics'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Utilization Analytics
            </button>
          </div>

          {/* Sub-tab 1: Pending Requests */}
          {activeSubTab === 'pending' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Reservation Requests Awaiting Your Approval ({ownerPendingBookings.length})
                </h3>
              </div>

              {ownerPendingBookings.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-xs text-slate-500">
                  No pending requests awaiting your decision.
                </div>
              ) : (
                <div className="space-y-4">
                  {ownerPendingBookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onCheckIn={onCheckIn}
                      onCheckOut={onCheckOut}
                      onReportIncident={onReportIncident}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-tab 2: Active Checkouts */}
          {activeSubTab === 'active' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Equipment Currently Checked Out ({ownerActiveBookings.length})
              </h3>
              {ownerActiveBookings.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 border text-xs text-slate-500">
                  No equipment currently checked out.
                </div>
              ) : (
                <div className="space-y-4">
                  {ownerActiveBookings.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      onCheckIn={onCheckIn}
                      onCheckOut={onCheckOut}
                      onReportIncident={onReportIncident}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-tab 3: My Managed Resources */}
          {activeSubTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  My Listed Equipment & Laboratories ({myOwnedResources.length})
                </h3>
                <button
                  onClick={onOpenCreateResource}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 text-white"
                >
                  + Add Listing
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myOwnedResources.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex gap-4 text-xs"
                  >
                    <img
                      src={res.imageUrl}
                      alt={res.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-slate-900 dark:text-white">{res.name}</h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            res.status === 'available'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{res.location}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() =>
                            updateResource(res.id, {
                              status: res.status === 'available' ? 'maintenance' : 'available',
                            })
                          }
                          className="text-[11px] font-semibold text-indigo-600 hover:underline"
                        >
                          Toggle {res.status === 'available' ? 'Maintenance' : 'Available'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 4: Analytics */}
          {activeSubTab === 'analytics' && <AnalyticsCharts />}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MANAGER / ADMIN VIEW                                   */}
      {/* ========================================================= */}
      {(currentUser.role === 'manager' || currentUser.role === 'admin') && (
        <div className="space-y-8">
          {/* Sub Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700 text-xs font-semibold gap-6">
            <button
              onClick={() => setActiveSubTab('governance')}
              className={`pb-3 relative ${
                activeSubTab === 'governance'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Facility Overview & Metrics
            </button>
            <button
              onClick={() => setActiveSubTab('disputes')}
              className={`pb-3 relative ${
                activeSubTab === 'disputes'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Disputes & Incidents
              {pendingIncidents.length > 0 && (
                <span className="ml-2 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold">
                  {pendingIncidents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveSubTab('all_bookings')}
              className={`pb-3 relative ${
                activeSubTab === 'all_bookings'
                  ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All Campus Bookings ({bookings.length})
            </button>
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setActiveSubTab('users')}
                className={`pb-3 relative ${
                  activeSubTab === 'users'
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                User & Role Management
              </button>
            )}
          </div>

          {/* Sub-tab 1: Governance & Metrics */}
          {activeSubTab === 'governance' && <AnalyticsCharts />}

          {/* Sub-tab 2: Disputes & Incidents Queue */}
          {activeSubTab === 'disputes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Incident Reports & Damage Adjudication ({incidents.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Human review is required for all recorded discrepancies. Use Gemini AI for root-cause synthesis.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {incidents.map((inc) => (
                  <div
                    key={inc.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-3 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          {inc.category}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {inc.resourceName}
                        </h4>
                      </div>
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                          inc.status === 'under_review'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {inc.status === 'under_review' ? 'Awaiting Human Review' : 'Resolved'}
                      </span>
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      "{inc.description}"
                    </p>

                    {inc.resolutionNotes && (
                      <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <strong>Resolution Action:</strong> {inc.resolutionNotes} (Resolved by {inc.resolvedBy})
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60">
                      <span className="text-slate-400 text-[11px]">
                        Reported by {inc.reportedByName} on {new Date(inc.createdAt).toLocaleDateString()}
                      </span>
                      {inc.status === 'under_review' && (
                        <button
                          onClick={() => onReviewIncident(inc)}
                          className="px-4 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg shadow-sm transition flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Review & Adjudicate (AI Assist)</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 3: All Bookings */}
          {activeSubTab === 'all_bookings' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Global Campus Booking Records ({bookings.length})
              </h3>
              <div className="space-y-4">
                {bookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    onCheckIn={onCheckIn}
                    onCheckOut={onCheckOut}
                    onReportIncident={onReportIncident}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sub-tab 4: Users Management (Admin) */}
          {activeSubTab === 'users' && currentUser.role === 'admin' && <UserManagementView />}
        </div>
      )}
    </div>
  );
};
