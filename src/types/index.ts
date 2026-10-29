export type UserRole = 'student' | 'owner' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  institution: string;
  department: string;
  phone: string;
  avatarUrl?: string;
  isVerified: boolean;
  qualifications: string[];
  activeBookingsCount: number;
  createdAt: string;
}

export type ResourceCategory =
  | 'Laboratory'
  | 'Fabrication & 3D'
  | 'Media & AV'
  | 'Electronics & Testing'
  | 'Computing & AI'
  | 'Meeting & Workspace';

export type ResourceType = 'equipment' | 'space';

export type ResourceStatus = 'available' | 'maintenance' | 'reserved' | 'deactivated';

export interface Resource {
  id: string;
  name: string;
  category: ResourceCategory;
  type: ResourceType;
  description: string;
  imageUrl: string;
  institution: string;
  location: string;
  ownerId: string;
  ownerName: string;
  ownerDepartment: string;
  ownerEmail: string;
  availableDays: string[];
  availableTimeSlots: string[];
  capacity: number;
  usageInstructions: string[];
  safetyRules: string[];
  eligibilityRequirements: string;
  requiredQualifications: string[];
  supervisionRequired: boolean;
  maxDurationHours: number;
  feeType: 'free' | 'paid';
  hourlyFee: number;
  depositAmount: number;
  status: ResourceStatus;
  totalBookings: number;
  rating: number;
}

export type BookingStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'checked_in'
  | 'returned'
  | 'cancelled'
  | 'overdue'
  | 'incident_reported';

export interface ConditionChecklist {
  itemInspected?: boolean;
  cleanlinessVerified?: boolean;
  safetyGearEquipped?: boolean;
  damagePreExisting?: boolean;
  cleanedAndRestored?: boolean;
  allAccessoriesPresent?: boolean;
  noNewDamage?: boolean;
  powerTurnedOff?: boolean;
  returnedOnTime?: boolean;
  notes?: string;
  photoEvidenceUrl?: string;
}

export interface Booking {
  id: string;
  resourceId: string;
  resourceName: string;
  resourceCategory: ResourceCategory;
  resourceLocation: string;
  userId: string;
  userName: string;
  userEmail: string;
  userInstitution: string;
  userDepartment: string;
  ownerId: string;
  ownerName: string;
  date: string;
  timeSlot: string;
  purpose: string;
  projectDetails: string;
  attendeesCount: number;
  status: BookingStatus;
  rejectionReason?: string;
  approvalNotes?: string;
  createdAt: string;
  updatedAt: string;
  checkInTime?: string;
  checkInChecklist?: ConditionChecklist;
  checkOutTime?: string;
  checkOutNotes?: string;
  checkOutChecklist?: ConditionChecklist;
  isLateReturn?: boolean;
  incidentId?: string;
}

export interface WaitingListEntry {
  id: string;
  resourceId: string;
  resourceName: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedDate: string;
  requestedTimeSlot: string;
  priorityScore: number;
  status: 'waiting' | 'promoted' | 'expired' | 'cancelled';
  createdAt: string;
  promotedAt?: string;
}

export type IncidentCategory =
  | 'damaged'
  | 'missing_parts'
  | 'late_return'
  | 'safety_hazard'
  | 'unauthorized_access'
  | 'other';

export type IncidentStatus = 'under_review' | 'resolved' | 'dismissed';

export interface Incident {
  id: string;
  bookingId: string;
  resourceId: string;
  resourceName: string;
  reportedBy: string;
  reportedByName: string;
  reportedByRole: UserRole;
  category: IncidentCategory;
  description: string;
  photoUrl?: string;
  status: IncidentStatus;
  resolutionNotes?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type:
    | 'booking_request'
    | 'approval'
    | 'rejection'
    | 'check_in'
    | 'return_reminder'
    | 'overdue'
    | 'waitlist'
    | 'incident';
  read: boolean;
  relatedId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  resourceId?: string;
  resourceName?: string;
  bookingId?: string;
  details: string;
  reason?: string;
  immutableHash: string;
}

export interface FairUseRules {
  maxActiveBookingsPerUser: number;
  maxHoursPerWeekPerUser: number;
  requireInstitutionalVerification: boolean;
  waitingListPolicy: 'fcfs' | 'academic_priority' | 'balanced';
  autoOverdueGracePeriodMinutes: number;
}
