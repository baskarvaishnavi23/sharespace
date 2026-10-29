import React from 'react';
import { Resource } from '../types';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Clock,
  ShieldAlert,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onSelect: (resource: Resource) => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onSelect }) => {
  const { currentUser } = useApp();

  // Check user eligibility
  const meetsVerification = !resource.eligibilityRequirements.includes('verification') || currentUser.isVerified;
  const missingQualifications = (resource.requiredQualifications || []).filter(
    (q) => !currentUser.qualifications.includes(q)
  );
  const isEligible = meetsVerification && missingQualifications.length === 0;

  const categoryBadges: Record<string, string> = {
    'Laboratory': 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200',
    'Fabrication & 3D': 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200',
    'Media & AV': 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200',
    'Electronics & Testing': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200',
    'Computing & AI': 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200',
    'Meeting & Workspace': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200',
  };

  const statusBadges: Record<string, { label: string; class: string }> = {
    available: { label: 'Available', class: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' },
    maintenance: { label: 'Under Maintenance', class: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300' },
    reserved: { label: 'Reserved', class: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' },
    deactivated: { label: 'Deactivated', class: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400' },
  };

  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Image Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
        <img
          src={resource.imageUrl}
          alt={resource.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              categoryBadges[resource.category] || 'bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            {resource.category}
          </span>
          <span className="text-[10px] font-semibold uppercase bg-slate-900/80 text-white backdrop-blur-md px-2 py-0.5 rounded-md">
            {resource.type}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span
            className={`text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs ${
              statusBadges[resource.status]?.class || 'bg-slate-100'
            }`}
          >
            {statusBadges[resource.status]?.label || resource.status}
          </span>
        </div>

        {/* Bottom Image Overlay: Capacity & Fee */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
          <span className="flex items-center gap-1 font-medium bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
            <Users className="w-3.5 h-3.5" />
            Cap: {resource.capacity} {resource.type === 'space' ? 'people' : 'unit'}
          </span>
          <span className="font-semibold bg-emerald-600/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px]">
            {resource.feeType === 'free' ? 'Free Access' : `₹${resource.hourlyFee}/hr`}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {resource.name}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {resource.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">{resource.location}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Max Duration: {resource.maxDurationHours}h per reservation</span>
          </div>
        </div>

        {/* Eligibility Strip */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
          {resource.requiredQualifications.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {resource.requiredQualifications.map((req, i) => {
                const hasIt = currentUser.qualifications.includes(req);
                return (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded ${
                      hasIt
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    }`}
                  >
                    {hasIt ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertCircle className="w-3 h-3 text-amber-500" />}
                    {req}
                  </span>
                );
              })}
            </div>
          )}

          {resource.supervisionRequired && (
            <div className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Lab technician or faculty supervision required</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => onSelect(resource)}
              className="w-full flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-indigo-600 text-white dark:bg-slate-700 dark:hover:bg-indigo-600 shadow-xs transition-colors"
            >
              <span>View Availability & Reserve</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
