import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ResourceCategory, ResourceType, ResourceStatus } from '../types';
import {
  X,
  Plus,
  Trash2,
  Building2,
  MapPin,
  Clock,
  ShieldCheck,
  DollarSign,
  Package,
} from 'lucide-react';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { createResource, currentUser } = useApp();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ResourceCategory>('Laboratory');
  const [type, setType] = useState<ResourceType>('equipment');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'
  );
  const [institution, setInstitution] = useState(currentUser.institution || 'Indian Institute of Technology, Delhi');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [maxDurationHours, setMaxDurationHours] = useState(3);
  const [feeType, setFeeType] = useState<'free' | 'paid'>('free');
  const [hourlyFee, setHourlyFee] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [supervisionRequired, setSupervisionRequired] = useState(false);
  const [eligibilityRequirements, setEligibilityRequirements] = useState(
    'Open to verified institutional research students and project teams.'
  );

  // Selected Days
  const [availableDays, setAvailableDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  // Time Slots
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([
    '09:00 - 12:00',
    '13:00 - 16:00',
    '16:30 - 19:30',
  ]);
  const [newSlotInput, setNewSlotInput] = useState('');

  // Instructions & Safety Rules
  const [instructions, setInstructions] = useState<string[]>([
    'Complete pre-operation safety checklist before power-up.',
    'Sanitize and clean work table after session.',
  ]);
  const [newInstruction, setNewInstruction] = useState('');

  const [safetyRules, setSafetyRules] = useState<string[]>([
    'Wear eye protection and adhere to lab guidelines at all times.',
  ]);
  const [newSafetyRule, setNewSafetyRule] = useState('');

  const [qualifications, setQualifications] = useState<string[]>(['Lab Safety Certified Level 1']);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddSlot = () => {
    if (newSlotInput.trim() && !availableTimeSlots.includes(newSlotInput.trim())) {
      setAvailableTimeSlots([...availableTimeSlots, newSlotInput.trim()]);
      setNewSlotInput('');
    }
  };

  const handleAddInstruction = () => {
    if (newInstruction.trim()) {
      setInstructions([...instructions, newInstruction.trim()]);
      setNewInstruction('');
    }
  };

  const handleAddSafetyRule = () => {
    if (newSafetyRule.trim()) {
      setSafetyRules([...safetyRules, newSafetyRule.trim()]);
      setNewSafetyRule('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      setErrorMsg('Please specify resource name and physical location.');
      return;
    }
    if (availableDays.length === 0) {
      setErrorMsg('Please select at least one available operational day.');
      return;
    }

    const res = createResource({
      name: name.trim(),
      category,
      type,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
      institution: institution.trim(),
      location: location.trim(),
      availableDays,
      availableTimeSlots,
      capacity,
      usageInstructions: instructions,
      safetyRules,
      eligibilityRequirements: eligibilityRequirements.trim(),
      requiredQualifications: qualifications,
      supervisionRequired,
      maxDurationHours,
      feeType,
      hourlyFee: feeType === 'free' ? 0 : hourlyFee,
      depositAmount,
      status: 'available',
    });

    if (res.success) {
      onSuccess();
      onClose();
    } else {
      setErrorMsg(res.error || 'Failed to list resource.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                List Campus Resource or Space
              </h3>
              <p className="text-xs text-slate-500">
                Register underused equipment, laboratories, or project rooms
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Fluke 289 True-RMS Precision Multimeter Kit"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Laboratory">Laboratory</option>
                  <option value="Fabrication & 3D">Fabrication & 3D</option>
                  <option value="Media & AV">Media & AV</option>
                  <option value="Electronics & Testing">Electronics & Testing</option>
                  <option value="Computing & AI">Computing & AI</option>
                  <option value="Meeting & Workspace">Meeting & Workspace</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Resource Type
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={type === 'equipment'}
                      onChange={() => setType('equipment')}
                      className="text-indigo-600"
                    />
                    <span>Equipment / Tool</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      checked={type === 'space'}
                      onChange={() => setType('space')}
                      className="text-indigo-600"
                    />
                    <span>Room / Facility Space</span>
                  </label>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description & Key Specifications
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Technical capabilities, brand/model, accessories included..."
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Institution
                </label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Physical Location (Building / Room) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Block 4, Mechatronics Lab Room 208"
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Concurrent User Capacity
                </label>
                <input
                  type="number"
                  min={1}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 1)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Max Booking Duration (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={maxDurationHours}
                  onChange={(e) => setMaxDurationHours(parseInt(e.target.value, 10) || 3)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Operational Days */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Available Operating Days
              </label>
              <div className="flex flex-wrap gap-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                  const isChecked = availableDays.includes(day);
                  return (
                    <button
                      type="button"
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition ${
                        isChecked
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Safety & Prerequisite Qualifications */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                Safety & Qualification Prerequisites
              </h4>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={supervisionRequired}
                    onChange={(e) => setSupervisionRequired(e.target.checked)}
                    className="text-amber-600"
                  />
                  <span>Mandatory Lab Technician or Faculty Supervisor presence required</span>
                </label>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Required Qualification Badges (Select applicable):
                  </label>
                  <div className="flex flex-wrap gap-2 text-xs">
                    {[
                      'Lab Safety Certified Level 1',
                      '3D Printer Operator Certification',
                      'Precision Machining Safety',
                    ].map((q) => {
                      const hasQ = qualifications.includes(q);
                      return (
                        <button
                          type="button"
                          key={q}
                          onClick={() => {
                            setQualifications((prev) =>
                              prev.includes(q) ? prev.filter((item) => item !== q) : [...prev, q]
                            );
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                            hasQ
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300'
                              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200'
                          }`}
                        >
                          {q}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
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
                className="px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition"
              >
                Publish Resource Listing
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
