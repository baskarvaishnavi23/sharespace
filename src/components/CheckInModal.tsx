import React, { useState } from 'react';
import { Booking } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Camera,
  AlertTriangle,
  Upload,
  Check,
} from 'lucide-react';

interface CheckInModalProps {
  booking: Booking | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({ booking, onClose, onSuccess }) => {
  const { checkInBooking } = useApp();

  const [itemInspected, setItemInspected] = useState(false);
  const [cleanlinessVerified, setCleanlinessVerified] = useState(false);
  const [safetyGearEquipped, setSafetyGearEquipped] = useState(false);
  const [damagePreExisting, setDamagePreExisting] = useState(false);
  const [notes, setNotes] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!booking) return null;

  // Handle mock photo upload or preset sample camera inspection photo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUseSamplePhoto = () => {
    setPhotoPreview(
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemInspected || !cleanlinessVerified) {
      setErrorMsg('Mandatory safety requirement: You must inspect the item and verify cleanliness before checking in.');
      return;
    }

    const res = checkInBooking(booking.id, {
      itemInspected,
      cleanlinessVerified,
      safetyGearEquipped,
      damagePreExisting,
      notes: notes.trim() || undefined,
      photoEvidenceUrl: photoPreview || undefined,
    });

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to complete check-in.');
    }
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
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Pre-Use Check-In Inspection
              </h3>
              <p className="text-xs text-slate-500">
                Resource: <strong className="text-slate-800 dark:text-slate-200">{booking.resourceName}</strong>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            To prevent false damage attribution, verify that the equipment or space is in working order and clean before initiating your work session.
          </p>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Checklists */}
            <div className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  itemInspected
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={itemInspected}
                  onChange={(e) => setItemInspected(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Physical & Operational Inspection Complete <span className="text-rose-500">*</span>
                  </div>
                  <div className="text-slate-500">
                    Cables, buttons, accessories, and power connections are intact without visible structural defects.
                  </div>
                </div>
              </label>

              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  cleanlinessVerified
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={cleanlinessVerified}
                  onChange={(e) => setCleanlinessVerified(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Cleanliness & Sanitisation Verified <span className="text-rose-500">*</span>
                  </div>
                  <div className="text-slate-500">
                    The work surface or instrument is clean, free of previous debris, residue, or spills.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={safetyGearEquipped}
                  onChange={(e) => setSafetyGearEquipped(e.target.checked)}
                  className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900 dark:text-white">
                    Personal Protective Equipment (PPE) Equipped
                  </div>
                  <div className="text-slate-500">
                    Safety goggles, ESD wrist-strap, or lab coats as mandated by lab rules.
                  </div>
                </div>
              </label>
            </div>

            {/* Optional Photo Upload */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Optional Condition Photo Evidence
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition">
                  <Camera className="w-3.5 h-3.5 text-slate-500" />
                  <span>Upload Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleUseSamplePhoto}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  (Or attach demo inspection photo)
                </button>
              </div>

              {photoPreview && (
                <div className="relative mt-2 h-28 w-44 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={photoPreview} alt="Inspection" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(null)}
                    className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Pre-existing Condition Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Minor scuff mark on rear casing prior to session start"
                className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            {/* Actions */}
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
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/30 transition"
              >
                Confirm & Check In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
