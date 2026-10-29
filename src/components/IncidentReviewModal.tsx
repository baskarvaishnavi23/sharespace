import React, { useState } from 'react';
import { Incident, Booking, Resource } from '../types';
import { useApp } from '../context/AppContext';
import {
  X,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  FileText,
  User,
  Clock,
} from 'lucide-react';

interface IncidentReviewModalProps {
  incident: Incident | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const IncidentReviewModal: React.FC<IncidentReviewModalProps> = ({
  incident,
  onClose,
  onSuccess,
}) => {
  const { bookings, resources, resolveIncident } = useApp();

  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionStatus, setResolutionStatus] = useState<'resolved' | 'dismissed'>('resolved');
  const [aiAnalysis, setAiAnalysis] = useState<any | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!incident) return null;

  const relatedBooking = bookings.find((b) => b.id === incident.bookingId);
  const relatedResource = resources.find((r) => r.id === incident.resourceId);

  // Gemini AI Incident Summarization trigger
  const handleGenerateAiSummary = async () => {
    setIsAiLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/gemini/summarize-incident', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incident,
          booking: relatedBooking,
          resource: relatedResource,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
        if (!resolutionNotes) {
          setResolutionNotes(
            `Reviewed: ${data.analysis.summary} Proposed Action: ${data.analysis.recommendedActions?.join('; ')}`
          );
        }
      }
    } catch (e) {
      console.warn('AI incident summarization failed', e);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolutionNotes.trim()) {
      setErrorMsg('Mandatory requirement: A documented resolution note is required before closing an incident.');
      return;
    }

    const res = resolveIncident(incident.id, resolutionNotes.trim(), resolutionStatus);
    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to resolve incident.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Facility Incident Review & Dispute Adjudication
              </h3>
              <p className="text-xs text-slate-500">
                Incident #{incident.id.slice(-6)} • Category: <span className="uppercase font-semibold">{incident.category}</span>
              </p>
            </div>
          </div>

          {/* Incident Details Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Affected Resource</span>
                <span className="font-semibold text-slate-900 dark:text-white text-sm">
                  {incident.resourceName}
                </span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Reported By</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {incident.reportedByName} ({incident.reportedByRole})
                </span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                Reported Narrative
              </span>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                "{incident.description}"
              </p>
            </div>

            {incident.photoUrl && (
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                  Attached Photo Evidence
                </span>
                <div className="h-32 w-52 rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700">
                  <img src={incident.photoUrl} alt="Incident" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </div>

          {/* AI Incident Summarizer & Recommendations */}
          <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h4 className="font-bold text-xs text-purple-950 dark:text-purple-300">
                  Gemini AI Incident Synthesis & Root-Cause Insight
                </h4>
              </div>
              <button
                type="button"
                onClick={handleGenerateAiSummary}
                disabled={isAiLoading}
                className="px-2.5 py-1 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition"
              >
                {isAiLoading ? 'Synthesizing...' : aiAnalysis ? 'Re-Analyze' : 'Generate AI Summary'}
              </button>
            </div>

            {aiAnalysis ? (
              <div className="text-xs space-y-2 text-purple-900 dark:text-purple-200">
                <p>
                  <strong>Summary:</strong> {aiAnalysis.summary}
                </p>
                <div className="flex gap-4 text-[11px]">
                  <span>
                    Severity: <strong>{aiAnalysis.severity}</strong>
                  </span>
                  <span>
                    Probable Cause: <strong>{aiAnalysis.rootCauseGuess}</strong>
                  </span>
                </div>
                {aiAnalysis.recommendedActions && (
                  <div>
                    <span className="font-semibold block mb-0.5">Recommended Fair Actions:</span>
                    <ul className="list-disc list-inside space-y-0.5">
                      {aiAnalysis.recommendedActions.map((act: string, idx: number) => (
                        <li key={idx}>{act}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-purple-800/80 dark:text-purple-300/80">
                Click “Generate AI Summary” to parse checklists, estimate severity, and produce objective resolution steps.
              </p>
            )}
          </div>

          {/* Manager Resolution Form */}
          <form onSubmit={handleResolve} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Adjudication Action
              </label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={resolutionStatus === 'resolved'}
                    onChange={() => setResolutionStatus('resolved')}
                    className="text-purple-600"
                  />
                  <span>Mark as Resolved (Corrective Action Taken)</span>
                </label>
                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={resolutionStatus === 'dismissed'}
                    onChange={() => setResolutionStatus('dismissed')}
                    className="text-purple-600"
                  />
                  <span>Dismiss Incident (Non-actionable / False Alarm)</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Resolution Rationale & Action Plan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Document your findings, repair arrangements, or policy clarification..."
                className="w-full text-xs px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs">
                {errorMsg}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-md shadow-purple-600/30 transition"
              >
                Record Resolution & Notify Parties
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
