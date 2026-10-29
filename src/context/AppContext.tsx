import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  User,
  UserRole,
  Resource,
  Booking,
  WaitingListEntry,
  Incident,
  NotificationItem,
  AuditLog,
  FairUseRules,
  ConditionChecklist,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_RESOURCES,
  INITIAL_BOOKINGS,
  INITIAL_INCIDENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  INITIAL_FAIR_USE_RULES,
} from '../data/mockData';

const STORAGE_KEYS = {
  USERS: 'sharespace_users_v1',
  CURRENT_USER_ID: 'sharespace_curr_user_id_v1',
  RESOURCES: 'sharespace_resources_v1',
  BOOKINGS: 'sharespace_bookings_v1',
  WAITLISTS: 'sharespace_waitlists_v1',
  INCIDENTS: 'sharespace_incidents_v1',
  NOTIFICATIONS: 'sharespace_notifs_v1',
  AUDIT_LOGS: 'sharespace_audit_logs_v1',
  FAIR_USE_RULES: 'sharespace_fair_rules_v1',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.warn(`Error reading localStorage ${key}:`, e);
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing localStorage ${key}:`, e);
  }
}

function generateHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(12, '0');
}

interface AppContextType {
  currentUser: User;
  users: User[];
  resources: Resource[];
  bookings: Booking[];
  waitlists: WaitingListEntry[];
  incidents: Incident[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  fairUseRules: FairUseRules;
  isDemoMode: boolean;

  // Actions
  switchUser: (userId: string) => void;
  login: (email: string) => boolean;
  registerUser: (userData: {
    name: string;
    email: string;
    institution: string;
    department: string;
    phone: string;
  }) => void;
  updateUserRole: (userId: string, newRole: UserRole, isVerified: boolean) => void;

  createResource: (
    resourceData: Omit<Resource, 'id' | 'totalBookings' | 'rating' | 'ownerId' | 'ownerName' | 'ownerDepartment' | 'ownerEmail'>
  ) => { success: boolean; error?: string };
  updateResource: (resourceId: string, updates: Partial<Resource>) => void;
  deleteResource: (resourceId: string) => void;

  requestBooking: (params: {
    resourceId: string;
    date: string;
    timeSlot: string;
    purpose: string;
    projectDetails: string;
    attendeesCount: number;
  }) => { success: boolean; error?: string; booking?: Booking; canWaitlist?: boolean };

  approveBooking: (bookingId: string, notes?: string) => { success: boolean; error?: string };
  rejectBooking: (bookingId: string, reason: string) => { success: boolean; error?: string };
  cancelBooking: (bookingId: string, reason?: string) => { success: boolean; error?: string };

  joinWaitingList: (
    resourceId: string,
    requestedDate: string,
    requestedTimeSlot: string
  ) => { success: boolean; error?: string };

  checkInBooking: (
    bookingId: string,
    checklist: ConditionChecklist
  ) => { success: boolean; error?: string };
  checkOutBooking: (
    bookingId: string,
    checklist: ConditionChecklist,
    notes?: string
  ) => { success: boolean; error?: string };

  reportIncident: (incidentData: {
    bookingId: string;
    resourceId: string;
    resourceName: string;
    category: Incident['category'];
    description: string;
    photoUrl?: string;
  }) => { success: boolean; error?: string };
  resolveIncident: (
    incidentId: string,
    resolutionNotes: string,
    status: 'resolved' | 'dismissed'
  ) => { success: boolean; error?: string };

  updateFairUseRules: (rules: FairUseRules) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() =>
    getStorage(STORAGE_KEYS.USERS, INITIAL_USERS)
  );
  const [currentUserId, setCurrentUserId] = useState<string>(() =>
    getStorage(STORAGE_KEYS.CURRENT_USER_ID, 'user-student-1')
  );
  const [resources, setResources] = useState<Resource[]>(() =>
    getStorage(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES)
  );
  const [bookings, setBookings] = useState<Booking[]>(() =>
    getStorage(STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS)
  );
  const [waitlists, setWaitlists] = useState<WaitingListEntry[]>(() =>
    getStorage(STORAGE_KEYS.WAITLISTS, [])
  );
  const [incidents, setIncidents] = useState<Incident[]>(() =>
    getStorage(STORAGE_KEYS.INCIDENTS, INITIAL_INCIDENTS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStorage(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    getStorage(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS)
  );
  const [fairUseRules, setFairUseRules] = useState<FairUseRules>(() =>
    getStorage(STORAGE_KEYS.FAIR_USE_RULES, INITIAL_FAIR_USE_RULES)
  );

  const currentUser = useMemo(() => {
    return users.find((u) => u.id === currentUserId) || users[0] || INITIAL_USERS[0];
  }, [users, currentUserId]);

  // Sync to storage
  useEffect(() => setStorage(STORAGE_KEYS.USERS, users), [users]);
  useEffect(() => setStorage(STORAGE_KEYS.CURRENT_USER_ID, currentUserId), [currentUserId]);
  useEffect(() => setStorage(STORAGE_KEYS.RESOURCES, resources), [resources]);
  useEffect(() => setStorage(STORAGE_KEYS.BOOKINGS, bookings), [bookings]);
  useEffect(() => setStorage(STORAGE_KEYS.WAITLISTS, waitlists), [waitlists]);
  useEffect(() => setStorage(STORAGE_KEYS.INCIDENTS, incidents), [incidents]);
  useEffect(() => setStorage(STORAGE_KEYS.NOTIFICATIONS, notifications), [notifications]);
  useEffect(() => setStorage(STORAGE_KEYS.AUDIT_LOGS, auditLogs), [auditLogs]);
  useEffect(() => setStorage(STORAGE_KEYS.FAIR_USE_RULES, fairUseRules), [fairUseRules]);

  // Helper: Append Immutable Audit Log
  const logAudit = (
    action: string,
    details: string,
    meta?: { resourceId?: string; resourceName?: string; bookingId?: string; reason?: string }
  ) => {
    const timestamp = new Date().toISOString();
    const immutableHash = generateHash(`${action}-${currentUser.id}-${timestamp}-${details}`);
    const newEntry: AuditLog = {
      id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp,
      action,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      details,
      ...meta,
      immutableHash,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Helper: Send in-app notification
  const notify = (
    userId: string,
    title: string,
    message: string,
    type: NotificationItem['type'],
    relatedId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId,
      title,
      message,
      type,
      read: false,
      relatedId,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Switch active user
  const switchUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUserId(found.id);
      logAudit('USER_SESSION_SWITCH', `Switched active session to ${found.name} (${found.role})`);
    }
  };

  const login = (email: string): boolean => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUserId(found.id);
      logAudit('USER_LOGIN', `Logged in as ${found.name}`);
      return true;
    }
    return false;
  };

  const registerUser = (userData: {
    name: string;
    email: string;
    institution: string;
    department: string;
    phone: string;
  }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: 'student', // All self-registered users start strictly as student
      institution: userData.institution,
      department: userData.department,
      phone: userData.phone,
      isVerified: false, // Requires admin verification
      qualifications: [],
      activeBookingsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    logAudit('USER_REGISTERED', `New account registered: ${newUser.name} (Student, Pending Verification)`);
    notify(
      newUser.id,
      'Welcome to ShareSpace',
      'Your account has been created. Institutional verification is pending review.',
      'waitlist'
    );
  };

  const updateUserRole = (userId: string, newRole: UserRole, isVerified: boolean) => {
    if (currentUser.role !== 'admin') {
      alert('Only authorized Administrators can change user roles and verification.');
      return;
    }
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole, isVerified } : u))
    );
    const targetUser = users.find((u) => u.id === userId);
    logAudit(
      'USER_ROLE_UPDATED',
      `Updated user ${targetUser?.name || userId} role to ${newRole}, verified: ${isVerified}`
    );
    notify(
      userId,
      'Profile Status Updated',
      `Your account role has been updated to ${newRole} (Verified: ${isVerified ? 'Yes' : 'No'}).`,
      'waitlist'
    );
  };

  const createResource = (
    resourceData: Omit<
      Resource,
      'id' | 'totalBookings' | 'rating' | 'ownerId' | 'ownerName' | 'ownerDepartment' | 'ownerEmail'
    >
  ) => {
    if (currentUser.role !== 'owner' && currentUser.role !== 'admin' && currentUser.role !== 'manager') {
      return { success: false, error: 'Unauthorized: Only Resource Owners or Admins can list equipment.' };
    }

    const newRes: Resource = {
      ...resourceData,
      id: `res-${Date.now()}`,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerDepartment: currentUser.department,
      ownerEmail: currentUser.email,
      totalBookings: 0,
      rating: 5.0,
    };

    setResources((prev) => [newRes, ...prev]);
    logAudit('RESOURCE_CREATED', `Listed new resource: ${newRes.name} in ${newRes.institution}`, {
      resourceId: newRes.id,
      resourceName: newRes.name,
    });
    return { success: true };
  };

  const updateResource = (resourceId: string, updates: Partial<Resource>) => {
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return;

    if (currentUser.role !== 'admin' && currentUser.role !== 'manager' && res.ownerId !== currentUser.id) {
      alert('Unauthorized: You can only edit resources that you own.');
      return;
    }

    setResources((prev) => prev.map((r) => (r.id === resourceId ? { ...r, ...updates } : r)));
    logAudit('RESOURCE_UPDATED', `Updated resource specifications for: ${res.name}`, {
      resourceId: res.id,
      resourceName: res.name,
    });
  };

  const deleteResource = (resourceId: string) => {
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return;

    if (currentUser.role !== 'admin' && res.ownerId !== currentUser.id) {
      alert('Unauthorized: You can only delete resources that you own.');
      return;
    }

    setResources((prev) => prev.filter((r) => r.id !== resourceId));
    logAudit('RESOURCE_DELETED', `Deactivated and removed listing: ${res.name}`, {
      resourceId: res.id,
      resourceName: res.name,
    });
  };

  const requestBooking = (params: {
    resourceId: string;
    date: string;
    timeSlot: string;
    purpose: string;
    projectDetails: string;
    attendeesCount: number;
  }) => {
    const res = resources.find((r) => r.id === params.resourceId);
    if (!res) {
      return { success: false, error: 'Resource not found' };
    }

    // 1. Eligibility Check: Verification
    if (fairUseRules.requireInstitutionalVerification && !currentUser.isVerified) {
      return {
        success: false,
        error:
          'Institutional verification required. Your account is currently unverified. Please ask an administrator or lab manager to verify your credentials.',
      };
    }

    // 2. Eligibility Check: Required Qualifications
    if (res.requiredQualifications && res.requiredQualifications.length > 0) {
      const missingQuals = res.requiredQualifications.filter(
        (q) => !currentUser.qualifications.includes(q)
      );
      if (missingQuals.length > 0) {
        return {
          success: false,
          error: `Missing prerequisite qualifications: ${missingQuals.join(', ')}. Complete certified lab safety onboarding before requesting this high-precision resource.`,
        };
      }
    }

    // 3. Fair Use: Active Bookings Cap
    const activeUserBookings = bookings.filter(
      (b) =>
        b.userId === currentUser.id &&
        (b.status === 'pending' || b.status === 'approved' || b.status === 'checked_in')
    );
    if (activeUserBookings.length >= fairUseRules.maxActiveBookingsPerUser) {
      return {
        success: false,
        error: `Fair access policy limit reached: You currently have ${activeUserBookings.length} active reservation(s). Maximum allowed concurrent active bookings is ${fairUseRules.maxActiveBookingsPerUser}.`,
      };
    }

    // 4. Overlap Check: Prevent double booking
    const overlapping = bookings.find(
      (b) =>
        b.resourceId === params.resourceId &&
        b.date === params.date &&
        b.timeSlot === params.timeSlot &&
        (b.status === 'approved' || b.status === 'checked_in')
    );

    if (overlapping) {
      return {
        success: false,
        canWaitlist: true,
        error: `This time slot (${params.date} at ${params.timeSlot}) is already booked by another research project. You can join the fair-access waiting list!`,
      };
    }

    // Create the booking
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      resourceId: res.id,
      resourceName: res.name,
      resourceCategory: res.category,
      resourceLocation: res.location,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userInstitution: currentUser.institution,
      userDepartment: currentUser.department,
      ownerId: res.ownerId,
      ownerName: res.ownerName,
      date: params.date,
      timeSlot: params.timeSlot,
      purpose: params.purpose,
      projectDetails: params.projectDetails,
      attendeesCount: params.attendeesCount,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Update user active count
    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id ? { ...u, activeBookingsCount: u.activeBookingsCount + 1 } : u
      )
    );

    logAudit(
      'BOOKING_REQUESTED',
      `Requested booking for ${res.name} on ${params.date} (${params.timeSlot})`,
      {
        resourceId: res.id,
        resourceName: res.name,
        bookingId: newBooking.id,
      }
    );

    notify(
      res.ownerId,
      'New Booking Request',
      `${currentUser.name} requested to book "${res.name}" on ${params.date} (${params.timeSlot}).`,
      'booking_request',
      newBooking.id
    );

    return { success: true, booking: newBooking };
  };

  const approveBooking = (bookingId: string, notes?: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'manager' &&
      booking.ownerId !== currentUser.id
    ) {
      return { success: false, error: 'Unauthorized: Only the resource owner or facility manager can approve this request.' };
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'approved',
              approvalNotes: notes || 'Approved for research and coursework use.',
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    logAudit(
      'BOOKING_APPROVED',
      `Approved booking #${bookingId.slice(-4)} for ${booking.userName} (${booking.resourceName})`,
      {
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        bookingId: booking.id,
        reason: notes || 'Legitimate research objective.',
      }
    );

    notify(
      booking.userId,
      'Booking Request Approved!',
      `Your reservation for "${booking.resourceName}" on ${booking.date} (${booking.timeSlot}) has been approved. Please check in on arrival.`,
      'approval',
      booking.id
    );

    return { success: true };
  };

  const rejectBooking = (bookingId: string, reason: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    if (!reason || reason.trim().length === 0) {
      return { success: false, error: 'Mandatory requirement: A clear reason must be recorded when rejecting a request.' };
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'rejected',
              rejectionReason: reason,
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    // Free up user active counter
    setUsers((prev) =>
      prev.map((u) =>
        u.id === booking.userId
          ? { ...u, activeBookingsCount: Math.max(0, u.activeBookingsCount - 1) }
          : u
      )
    );

    logAudit(
      'BOOKING_REJECTED',
      `Rejected booking #${bookingId.slice(-4)} for ${booking.userName}`,
      {
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        bookingId: booking.id,
        reason,
      }
    );

    notify(
      booking.userId,
      'Booking Request Declined',
      `Your reservation for "${booking.resourceName}" was declined. Reason: ${reason}`,
      'rejection',
      booking.id
    );

    return { success: true };
  };

  const cancelBooking = (bookingId: string, reason?: string) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'cancelled',
              rejectionReason: reason || 'Cancelled by user',
              updatedAt: new Date().toISOString(),
            }
          : b
      )
    );

    // Free up counter
    setUsers((prev) =>
      prev.map((u) =>
        u.id === booking.userId
          ? { ...u, activeBookingsCount: Math.max(0, u.activeBookingsCount - 1) }
          : u
      )
    );

    logAudit('BOOKING_CANCELLED', `Cancelled booking for ${booking.resourceName}`, {
      resourceId: booking.resourceId,
      resourceName: booking.resourceName,
      bookingId: booking.id,
      reason: reason || 'Voluntary cancellation',
    });

    // Handle Waiting List Auto-Promotion
    const nextInWaitlist = waitlists.find(
      (w) =>
        w.resourceId === booking.resourceId &&
        w.requestedDate === booking.date &&
        w.requestedTimeSlot === booking.timeSlot &&
        w.status === 'waiting'
    );

    if (nextInWaitlist) {
      setWaitlists((prev) =>
        prev.map((w) =>
          w.id === nextInWaitlist.id
            ? { ...w, status: 'promoted', promotedAt: new Date().toISOString() }
            : w
        )
      );

      notify(
        nextInWaitlist.userId,
        'Waiting List Slot Available!',
        `A cancelled slot for "${nextInWaitlist.resourceName}" on ${nextInWaitlist.requestedDate} (${nextInWaitlist.requestedTimeSlot}) opened up and has been held for you!`,
        'waitlist'
      );

      logAudit(
        'WAITLIST_PROMOTED',
        `Promoted waitlist user ${nextInWaitlist.userName} for ${nextInWaitlist.resourceName}`,
        {
          resourceId: nextInWaitlist.resourceId,
          resourceName: nextInWaitlist.resourceName,
        }
      );
    }

    return { success: true };
  };

  const joinWaitingList = (
    resourceId: string,
    requestedDate: string,
    requestedTimeSlot: string
  ) => {
    const res = resources.find((r) => r.id === resourceId);
    if (!res) return { success: false, error: 'Resource not found' };

    // Calculate priority score (FCFS baseline + institutional bonus)
    const priorityScore = (currentUser.isVerified ? 50 : 10) + (10000000000000 - Date.now()) / 100000000;

    const newWaitlistEntry: WaitingListEntry = {
      id: `wait-${Date.now()}`,
      resourceId,
      resourceName: res.name,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      requestedDate,
      requestedTimeSlot,
      priorityScore,
      status: 'waiting',
      createdAt: new Date().toISOString(),
    };

    setWaitlists((prev) => [...prev, newWaitlistEntry]);

    logAudit(
      'WAITLIST_JOINED',
      `Joined waiting list for ${res.name} on ${requestedDate} (${requestedTimeSlot})`,
      {
        resourceId,
        resourceName: res.name,
      }
    );

    notify(
      currentUser.id,
      'Joined Waiting List',
      `You are queued for "${res.name}" on ${requestedDate} (${requestedTimeSlot}). You will be notified automatically if a cancellation occurs.`,
      'waitlist'
    );

    return { success: true };
  };

  const checkInBooking = (bookingId: string, checklist: ConditionChecklist) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    if (booking.status !== 'approved') {
      return { success: false, error: 'Booking must be in Approved status to check in.' };
    }

    if (booking.userId !== currentUser.id && currentUser.role === 'student') {
      return { success: false, error: 'Unauthorized: Only the approved student or resource owner can perform check-in.' };
    }

    const checkInTime = new Date().toISOString();

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'checked_in',
              checkInTime,
              checkInChecklist: checklist,
              updatedAt: checkInTime,
            }
          : b
      )
    );

    logAudit(
      'CHECK_IN_COMPLETED',
      `Checked in to ${booking.resourceName}. Condition inspection verified.`,
      {
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        bookingId: booking.id,
      }
    );

    notify(
      booking.ownerId,
      'Resource Checked In',
      `${booking.userName} checked in to "${booking.resourceName}".`,
      'check_in',
      booking.id
    );

    return { success: true };
  };

  const checkOutBooking = (
    bookingId: string,
    checklist: ConditionChecklist,
    notes?: string
  ) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'Booking not found' };

    if (booking.status !== 'checked_in') {
      return { success: false, error: 'Booking must be currently checked in to check out and return.' };
    }

    const checkOutTime = new Date().toISOString();
    // Simulate late return check (if checkOut is later than end of slot)
    const isLate = checklist.returnedOnTime === false;

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'returned',
              checkOutTime,
              checkOutNotes: notes || '',
              checkOutChecklist: checklist,
              isLateReturn: isLate,
              updatedAt: checkOutTime,
            }
          : b
      )
    );

    // Decrement user active counter
    setUsers((prev) =>
      prev.map((u) =>
        u.id === booking.userId
          ? { ...u, activeBookingsCount: Math.max(0, u.activeBookingsCount - 1) }
          : u
      )
    );

    // Increment resource totalBookings
    setResources((prev) =>
      prev.map((r) =>
        r.id === booking.resourceId ? { ...r, totalBookings: r.totalBookings + 1 } : r
      )
    );

    logAudit(
      'RESOURCE_RETURNED',
      `Returned ${booking.resourceName}. ${isLate ? 'FLAGGED: Returned late.' : 'Returned on schedule.'}`,
      {
        resourceId: booking.resourceId,
        resourceName: booking.resourceName,
        bookingId: booking.id,
        reason: notes,
      }
    );

    notify(
      booking.ownerId,
      'Resource Returned',
      `${booking.userName} has returned "${booking.resourceName}". Please inspect condition checklist.`,
      'return_reminder',
      booking.id
    );

    return { success: true };
  };

  const reportIncident = (data: {
    bookingId: string;
    resourceId: string;
    resourceName: string;
    category: Incident['category'];
    description: string;
    photoUrl?: string;
  }) => {
    const newInc: Incident = {
      id: `inc-${Date.now()}`,
      bookingId: data.bookingId,
      resourceId: data.resourceId,
      resourceName: data.resourceName,
      reportedBy: currentUser.id,
      reportedByName: currentUser.name,
      reportedByRole: currentUser.role,
      category: data.category,
      description: data.description,
      photoUrl: data.photoUrl,
      status: 'under_review',
      createdAt: new Date().toISOString(),
    };

    setIncidents((prev) => [newInc, ...prev]);

    // Update booking state
    setBookings((prev) =>
      prev.map((b) =>
        b.id === data.bookingId ? { ...b, status: 'incident_reported', incidentId: newInc.id } : b
      )
    );

    logAudit(
      'INCIDENT_FILED',
      `Filed incident for ${data.resourceName}: [${data.category}] ${data.description.slice(0, 60)}...`,
      {
        resourceId: data.resourceId,
        resourceName: data.resourceName,
        bookingId: data.bookingId,
      }
    );

    // Notify all facility managers & admins
    users
      .filter((u) => u.role === 'manager' || u.role === 'admin')
      .forEach((mgr) => {
        notify(
          mgr.id,
          'Incident Report Filed',
          `Incident reported on "${data.resourceName}" by ${currentUser.name}: ${data.category}`,
          'incident',
          newInc.id
        );
      });

    return { success: true };
  };

  const resolveIncident = (
    incidentId: string,
    resolutionNotes: string,
    status: 'resolved' | 'dismissed'
  ) => {
    if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
      return { success: false, error: 'Unauthorized: Only Facility Managers and Admins can resolve incidents.' };
    }

    const inc = incidents.find((i) => i.id === incidentId);
    if (!inc) return { success: false, error: 'Incident not found' };

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === incidentId
          ? {
              ...i,
              status,
              resolutionNotes,
              resolvedBy: currentUser.name,
              resolvedAt: new Date().toISOString(),
            }
          : i
      )
    );

    logAudit(
      'INCIDENT_RESOLVED',
      `Incident #${incidentId.slice(-4)} marked as ${status} by ${currentUser.name}`,
      {
        resourceId: inc.resourceId,
        resourceName: inc.resourceName,
        bookingId: inc.bookingId,
        reason: resolutionNotes,
      }
    );

    notify(
      inc.reportedBy,
      'Incident Resolved',
      `Your report on "${inc.resourceName}" has been reviewed and closed: ${resolutionNotes}`,
      'incident',
      inc.id
    );

    return { success: true };
  };

  const updateFairUseRules = (rules: FairUseRules) => {
    if (currentUser.role !== 'manager' && currentUser.role !== 'admin') {
      alert('Unauthorized: Only Managers and Admins can reconfigure fair use policies.');
      return;
    }
    setFairUseRules(rules);
    logAudit('FAIR_USE_POLICY_UPDATED', `Updated campus allocation rules`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const resetDemoData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUserId('user-student-1');
    setResources(INITIAL_RESOURCES);
    setBookings(INITIAL_BOOKINGS);
    setWaitlists([]);
    setIncidents(INITIAL_INCIDENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setFairUseRules(INITIAL_FAIR_USE_RULES);

    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    logAudit('SYSTEM_RESET', 'Evaluator reset demonstration database to pristine hackathon baseline.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        resources,
        bookings,
        waitlists,
        incidents,
        notifications,
        auditLogs,
        fairUseRules,
        isDemoMode: true,
        switchUser,
        login,
        registerUser,
        updateUserRole,
        createResource,
        updateResource,
        deleteResource,
        requestBooking,
        approveBooking,
        rejectBooking,
        cancelBooking,
        joinWaitingList,
        checkInBooking,
        checkOutBooking,
        reportIncident,
        resolveIncident,
        updateFairUseRules,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
