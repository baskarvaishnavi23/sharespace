import React, { useState } from 'react';
import { Booking, BookingStatus } from '../types';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  User,
  FileText,
  AlertCircle,
  Check,
  X,
} from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onCheckIn: (booking: Booking) => void;
  onCheckOut: (booking: Booking) => void;
  onReportIncident: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCheckIn,
  onCheckOut,
  onReportIncident,
}) => {
  const { currentUser, approveBooking, rejectBooking, cancelBooking } = useApp();

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);

  const statusConfig: Record<
    BookingStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    pending: { label: 'Pending Approval', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
    approved: { label: 'Approved (Ready for Check-In)', bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800' },
    checked_in: { label: 'Active Session (Checked In)', bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
    returned: { label: 'Returned & Inspected', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700' },
    rejected: { label: 'Request Declined', bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-800' },
    cancelled: { label: 'Cancelled', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500', border: 'border-slate-200 dark:border-slate-700' },
    overdue: { label: 'Overdue Return', bg: 'bg-rose-100 dark:bg-rose-950', text: 'text-rose-800 dark:text-rose-300', border: 'border-rose-300' },
    incident_reported: { label: 'Incident Reported', bg: 'bg-purple-50 dark:bg-purple-950/50', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  };

  const statusStyle = statusConfig[booking.status];

  // Role permissions
  const isOwnerOfResource = currentUser.id === booking.ownerId;
  const isStudentOfBooking = currentUser.id === booking.userId;
  const isManagerOrAdmin = currentUser.role === 'manager' || currentUser.role === 'admin';

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs hover:shadow-md transition space-y-4">
      {/* Top Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
              #{booking.id.slice(-6)}
            </span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {statusStyle.label}
            </span>
            {booking.isLateReturn && (
              <span className="text-[10px] font-bold uppercase bg-rose-500 text-white px-2 py-0.5 rounded">
                Late Handover
              </span>
            )}
          </div>
          <h4 className="font-bold text-base text-slate-900 dark:text-white mt-1">
            {booking.resourceName}
          </h4>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            {booking.resourceLocation}
          </p>
        </div>

        {/* Date & Slot Badge */}
        <div className="text-right">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/60 px-2.5 py-1 rounded-lg">
            <Calendar className="w-3.5 h-3.5 text-indigo-500" />
            <span>{booking.date}</span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-end gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            <span>{booking.timeSlot}</span>
          </div>
        </div>
      </div>

      {/* Booking Details Strip */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs space-y-1.5">
        <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1 font-medium">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <strong>Researcher:</strong> {booking.userName} ({booking.userDepartment})
          </span>
          <span>Attendees: {booking.attendeesCount}</span>
        </div>
        <p className="text-slate-700 dark:text-slate-300">
          <strong className="text-slate-900 dark:text-white">Stated Purpose:</strong> {booking.purpose}
        </p>
        {booking.approvalNotes && (
          <p className="text-emerald-700 dark:text-emerald-400 text-[11px]">
            <strong>Approval Notes:</strong> {booking.approvalNotes}
          </p>
        )}
        {booking.rejectionReason && (
          <p className="text-rose-700 dark:text-rose-400 text-[11px]">
            <strong>Decline Reason:</strong> {booking.rejectionReason}
          </p>
        )}
        {booking.checkInTime && (
          <p className="text-slate-500 text-[11px]">
            Checked In at {new Date(booking.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
        {booking.checkOutNotes && (
          <p className="text-slate-500 text-[11px]">
            <strong>Return Notes:</strong> {booking.checkOutNotes}
          </p>
        )}
      </div>

      {/* Action Buttons based on Role & State */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          {/* Incident reporting available for approved, checked_in, or returned */}
          {(booking.status === 'approved' ||
            booking.status === 'checked_in' ||
            booking.status === 'returned') && (
            <button
              onClick={() => onReportIncident(booking)}
              className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold flex items-center gap-1 transition"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Report Issue</span>
            </button>
          )}

          {/* User can cancel pending or approved booking */}
          {(isStudentOfBooking || isManagerOrAdmin) &&
            (booking.status === 'pending' || booking.status === 'approved') && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this booking? This slot will be released to the waiting list.')) {
                    cancelBooking(booking.id);
                  }
                }}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                Cancel Reservation
              </button>
            )}
        </div>

        <div className="flex items-center gap-2">
          {/* Owner / Manager: Approval / Rejection actions for Pending */}
          {booking.status === 'pending' && (isOwnerOfResource || isManagerOrAdmin) && (
            <>
              <button
                onClick={() => setShowRejectModal(true)}
                className="px-3 py-1.5 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200 dark:border-rose-800 rounded-lg transition"
              >
                Decline Request
              </button>
              <button
                onClick={() => setShowApproveModal(true)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition"
              >
                Approve Request
              </button>
            </>
          )}

          {/* Student: Check-In when Approved */}
          {booking.status === 'approved' && (isStudentOfBooking || isManagerOrAdmin) && (
            <button
              onClick={() => onCheckIn(booking)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Perform Check-In Inspection</span>
            </button>
          )}

          {/* Student or Owner: Check-Out when Checked-In */}
          {booking.status === 'checked_in' && (isStudentOfBooking || isOwnerOfResource || isManagerOrAdmin) && (
            <button
              onClick={() => onCheckOut(booking)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Complete Return Inspection</span>
            </button>
          )}
        </div>
      </div>

      {/* Reject Modal with Mandatory Reason */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-2xl space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Decline Booking Request #{booking.id.slice(-6)}
            </h4>
            <p className="text-xs text-slate-500">
              In accordance with platform fairness rules, a documented reason must be provided to the researcher.
            </p>
            <textarea
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="e.g. Laboratory scheduled for planned sensor calibration during this window."
              className="w-full text-xs p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
              required
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!rejectReason.trim()) {
                    alert('Please enter a rejection reason.');
                    return;
                  }
                  rejectBooking(booking.id, rejectReason.trim());
                  setShowRejectModal(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal with Optional Safety Notes */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 border shadow-2xl space-y-4">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Approve Booking Request #{booking.id.slice(-6)}
            </h4>
            <p className="text-xs text-slate-500">
              Provide handover notes or safety reminders for the student.
            </p>
            <input
              type="text"
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="e.g. Approved. Please pick up access key card from Lab Office 204."
              className="w-full text-xs p-3 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  approveBooking(booking.id, approvalNotes.trim());
                  setShowApproveModal(false);
                }}
                className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
