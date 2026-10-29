import React, { useState } from 'react';
import { Resource, Booking } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Users,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building2,
  HelpCircle,
  FileText,
} from 'lucide-react';

interface ResourceDetailModalProps {
  resource: Resource | null;
  onClose: () => void;
  onBookingSuccess: () => void;
}

export const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({
  resource,
  onClose,
  onBookingSuccess,
}) => {
  const { currentUser, bookings, requestBooking, joinWaitingList, fairUseRules } = useApp();

  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [purpose, setPurpose] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [waitlistSuccess, setWaitlistSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Slot Suggestion state
  const [suggestedSlots, setSuggestedSlots] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!resource) return null;

  // Active bookings on this resource for the selected date
  const existingBookingsOnDate = bookings.filter(
    (b) =>
      b.resourceId === resource.id &&
      b.date === selectedDate &&
      (b.status === 'approved' || b.status === 'checked_in')
  );

  const bookedSlots = existingBookingsOnDate.map((b) => b.timeSlot);

  // Eligibility evaluation
  const isVerifiedEligible = !fairUseRules.requireInstitutionalVerification || currentUser.isVerified;
  const missingQualifications = (resource.requiredQualifications || []).filter(
    (q) => !currentUser.qualifications.includes(q)
  );
  const isFullyEligible = isVerifiedEligible && missingQualifications.length === 0;

  // Handle Request
  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setWaitlistSuccess(null);

    if (!selectedSlot) {
      setErrorMsg('Please select an available time slot.');
      return;
    }
    if (!purpose.trim()) {
      setErrorMsg('Please state your intended purpose or research objective.');
      return;
    }

    setIsSubmitting(true);
    const result = requestBooking({
      resourceId: resource.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      purpose,
      projectDetails,
      attendeesCount,
    });

    setIsSubmitting(false);
    if (!result.success) {
      setErrorMsg(result.error || 'Failed to submit booking request.');
    } else {
      onBookingSuccess();
      onClose();
    }
  };

  // Handle Waitlist
  const handleJoinWaitlist = () => {
    if (!selectedSlot) {
      setErrorMsg('Please select a time slot to join its waiting list.');
      return;
    }
    const result = joinWaitingList(resource.id, selectedDate, selectedSlot);
    if (result.success) {
      setWaitlistSuccess(`You have been queued for ${selectedDate} (${selectedSlot}). You will be automatically notified if this slot becomes available!`);
      setErrorMsg(null);
    } else {
      setErrorMsg(result.error || 'Failed to join waiting list.');
    }
  };

  // Handle AI Alternative Slots
  const handleSuggestSlots = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/suggest-slots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestedDate: selectedDate,
          requestedTime: selectedSlot || '10:00 - 12:00',
          resourceName: resource.name,
          existingBookings: bookedSlots,
        }),
      });
      const data = await res.json();
      if (data.suggestedSlots) {
        setSuggestedSlots(data.suggestedSlots);
      }
    } catch (e) {
      console.warn('AI slot suggestion failed', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header with image background banner */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-900 overflow-hidden">
          <img
            src={resource.imageUrl}
            alt={resource.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-indigo-600">
                {resource.category}
              </span>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md">
                {resource.type}
              </span>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-500/30">
                {resource.feeType === 'free' ? 'Free Access' : `₹${resource.hourlyFee}/hour`}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {resource.name}
            </h2>
            <p className="text-xs text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              {resource.location} ({resource.institution})
            </p>
          </div>
        </div>

        {/* Modal Grid Content */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 max-h-[75vh] overflow-y-auto">
          {/* Left Column: Specifications & Safety Rules */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Description & Specifications
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {resource.description}
              </p>
            </div>

            {/* Operating Instructions */}
            {resource.usageInstructions && resource.usageInstructions.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-500" />
                  Usage & Operating Guidelines
                </h4>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {resource.usageInstructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety & Compliance */}
            {resource.safetyRules && resource.safetyRules.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 space-y-2">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  Mandatory Safety Regulations
                </h4>
                <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1 list-disc list-inside">
                  {resource.safetyRules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Owner & Governance Info */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Managing Department & Owner
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {resource.ownerName}
                </span>
                <span className="text-slate-500 block">{resource.ownerDepartment}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">
                  Capacity Limit
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Max {resource.capacity} {resource.type === 'space' ? 'people' : 'user'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Booking & Scheduling Form */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />
                Schedule Reservation
              </h3>
              <p className="text-xs text-slate-500">
                Bookings require owner review and condition check-in.
              </p>
            </div>

            {/* Eligibility Status Banner */}
            <div
              className={`p-3 rounded-xl border text-xs space-y-1 ${
                isFullyEligible
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold">
                {isFullyEligible ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Eligible to Request</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Prerequisites Required</span>
                  </>
                )}
              </div>
              {!currentUser.isVerified && (
                <p className="text-[11px] leading-tight text-rose-700 dark:text-rose-400">
                  • Institutional verification missing. (Ask Admin to verify your account).
                </p>
              )}
              {missingQualifications.map((mq, i) => (
                <p key={i} className="text-[11px] leading-tight text-rose-700 dark:text-rose-400">
                  • Missing qualification: <strong>{mq}</strong>
                </p>
              ))}
            </div>

            {/* Error or Waitlist Messages */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 text-xs space-y-2">
                <p className="font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  {errorMsg}
                </p>
                {/* If slot already booked, offer waiting list & AI alternatives */}
                {selectedSlot && bookedSlots.includes(selectedSlot) && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleJoinWaitlist}
                      className="px-2.5 py-1 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition"
                    >
                      Join Waiting List for this Slot
                    </button>
                    <button
                      type="button"
                      onClick={handleSuggestSlots}
                      disabled={isAiLoading}
                      className="px-2.5 py-1 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      {isAiLoading ? 'Analyzing...' : 'Suggest Alternative Slots (AI)'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {waitlistSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-medium">
                {waitlistSuccess}
              </div>
            )}

            {/* AI Suggested Alternatives Result */}
            {suggestedSlots.length > 0 && (
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
                <div className="font-bold text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Recommended Alternative Slots:
                </div>
                <div className="space-y-1">
                  {suggestedSlots.map((s, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedSlot(s.time);
                        if (s.date && s.date !== 'Next Business Day') setSelectedDate(s.date);
                      }}
                      className="p-1.5 bg-white dark:bg-slate-900 rounded border border-purple-100 hover:border-purple-400 cursor-pointer flex justify-between items-center"
                    >
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {s.date || selectedDate} — {s.time}
                      </span>
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">
                        Select
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              {/* Date Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reservation Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Time Slots Radio/Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Available Time Slots ({selectedDate})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {resource.availableTimeSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        type="button"
                        key={slot}
                        disabled={resource.status !== 'available'}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition relative ${
                          isBooked
                            ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 border-slate-200 cursor-not-allowed opacity-75'
                            : isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{slot}</span>
                          {isBooked ? (
                            <span className="text-[9px] bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-1 py-0.2 rounded font-bold">
                              Reserved
                            </span>
                          ) : (
                            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                              Free
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stated Purpose & Project Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Intended Research Purpose & Output <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g. Prototyping lightweight robotics gripper for CodeHack India 2026..."
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Team Members
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={resource.capacity}
                    value={attendeesCount}
                    onChange={(e) => setAttendeesCount(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Project / Course Code
                  </label>
                  <input
                    type="text"
                    value={projectDetails}
                    onChange={(e) => setProjectDetails(e.target.value)}
                    placeholder="CodeHack 2026"
                    className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!isFullyEligible || resource.status !== 'available' || isSubmitting}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all ${
                    !isFullyEligible || resource.status !== 'available'
                      ? 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
                  }`}
                >
                  {isSubmitting ? 'Submitting Request...' : 'Submit Booking Request to Owner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
