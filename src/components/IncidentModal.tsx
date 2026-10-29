import React, { useState } from 'react';
import { Booking, IncidentCategory } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  AlertTriangle,
  Camera,
  ShieldAlert,
} from 'lucide-react';

interface IncidentModalProps {
  booking: Booking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ booking, onClose, onSuccess }) => {
  const { reportIncident } = useApp();

  const [category, setCategory] = useState<IncidentCategory>('damaged');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please describe what occurred or what is damaged/missing.');
      return;
    }

    const res = reportIncident({
      bookingId: booking.id,
      resourceId: booking.resourceId,
      resourceName: booking.resourceName,
      category,
      description: description.trim(),
      photoUrl: photoUrl || undefined,
    });

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to submit incident report.');
    }
  };

  const handleUseDemoPhoto = () => {
    setPhotoUrl('https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80');
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
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Report Damage or Safety Incident
              </h3>
              <p className="text-xs text-slate-500">
                Resource: <strong className="text-slate-800 dark:text-slate-200">{booking.resourceName}</strong>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200">
            ShareSpace enforces human review for all incidents. Facility managers and owners inspect reports objectively before taking maintenance or accountability measures.
          </p>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Incident Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IncidentCategory)}
                className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="damaged">Damaged Equipment / Space</option>
                <option value="missing_parts">Missing Cables, Tools, or Components</option>
                <option value="late_return">Severe Late Return Disruption</option>
                <option value="safety_hazard">Safety Hazard / Spill / Electrical Malfunction</option>
                <option value="unauthorized_access">Unauthorised Access / Rule Breach</option>
                <option value="other">Other Conflict</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Incident Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what occurred, any observed damage, missing parts, or safety concerns..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Photo Evidence
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleUseDemoPhoto}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Attach damage inspection photo
                </button>
              </div>

              {photoUrl && (
                <div className="relative mt-2 h-24 w-36 rounded-xl overflow-hidden border">
                  <img src={photoUrl} alt="Damage" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoUrl(null)}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md shadow-rose-600/30 transition"
              >
                Submit Incident Report
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
