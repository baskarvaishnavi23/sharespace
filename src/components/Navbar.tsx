import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Bell,
  RefreshCw,
  UserCheck,
  ChevronDown,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAIMatcher: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAIMatcher }) => {
  const {
    currentUser,
    users,
    switchUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetDemoData,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const myNotifications = notifications.filter((n) => n.userId === currentUser.id);
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const roleColors: Record<UserRole, { bg: string; text: string; border: string; label: string }> = {
    student: { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', label: 'Student / Researcher' },
    owner: { bg: 'bg-blue-500/10', text: 'text-blue-700 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', label: 'Resource Owner' },
    manager: { bg: 'bg-purple-500/10', text: 'text-purple-700 dark:text-purple-400', border: 'border-purple-200 dark:border-purple-800', label: 'Facility Manager' },
    admin: { bg: 'bg-amber-500/10', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', label: 'System Administrator' },
  };

  const currentRoleStyle = roleColors[currentUser.role];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs">
      {/* Hackathon Top Announcement & Demo Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-indigo-900/50">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 uppercase tracking-wider text-[11px] bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            CodeHack India 2026
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Problem: <strong className="text-white">“Unlock Underused Equipment and Spaces”</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-teal-400"></span>
            <span className="hidden md:inline">Demonstration Engine:</span> Persistent Browser Storage (Firestore-ready)
          </span>
          <button
            onClick={() => {
              if (confirm('Reset demo database to pristine hackathon baseline? All test bookings and edits will be refreshed.')) {
                resetDemoData();
              }
            }}
            title="Reset sample data"
            className="flex items-center gap-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 px-2 py-0.5 rounded border border-slate-700 transition"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                    Share<span className="text-indigo-600 dark:text-indigo-400">Space</span>
                  </span>
                  <span className="text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  Smart Resource Sharing Platform
                </p>
              </div>
            </button>

            {/* Navigation Tabs */}
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setCurrentTab('home')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  currentTab === 'home'
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setCurrentTab('catalogue')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  currentTab === 'catalogue'
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Resource Catalogue
              </button>
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  currentTab === 'dashboard'
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {currentUser.role === 'student' && 'My Bookings & Check-In'}
                {currentUser.role === 'owner' && 'Owner Workbench'}
                {currentUser.role === 'manager' && 'Facility Governance'}
                {currentUser.role === 'admin' && 'Admin Console'}
              </button>
              <button
                onClick={() => setCurrentTab('audit')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  currentTab === 'audit'
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                Audit Log
              </button>
            </nav>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-3">
            {/* AI Assistant Quick Trigger */}
            <button
              onClick={onOpenAIMatcher}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800 rounded-lg transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">AI Resource Matcher</span>
              <span className="sm:hidden">AI</span>
            </button>

            {/* Notifications Menu */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="relative p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-900 dark:text-white">Notifications</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded-full">
                        {myNotifications.length}
                      </span>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {myNotifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      myNotifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3 text-xs cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                            !n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 whitespace-nowrap">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role Switcher Dropdown (Crucial for Hackathon Evaluation) */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border text-xs font-medium transition shadow-2xs ${currentRoleStyle.bg} ${currentRoleStyle.text} ${currentRoleStyle.border}`}
              >
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80'}
                  alt={currentUser.name}
                  className="w-6 h-6 rounded-lg object-cover ring-1 ring-white/50"
                />
                <div className="text-left hidden sm:block">
                  <div className="font-semibold leading-tight flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.isVerified && (
                      <span title="Institution Verified" className="inline-flex">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] opacity-75 uppercase tracking-wider font-bold">
                    {currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Demo Role Switcher (CodeHack Evaluation)
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      Instantly switch perspective to test multi-role workflows:
                    </p>
                  </div>

                  <div className="p-1 space-y-1">
                    {users.map((u) => {
                      const style = roleColors[u.role];
                      const isActive = u.id === currentUser.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs text-left transition ${
                            isActive
                              ? 'bg-indigo-50 dark:bg-indigo-950/60 font-medium'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={u.avatarUrl}
                              alt={u.name}
                              className="w-7 h-7 rounded-lg object-cover shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="text-slate-900 dark:text-white font-medium flex items-center gap-1 truncate">
                                {u.name}
                                {u.isVerified ? (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1 py-0.2 rounded">
                                    Verified
                                  </span>
                                ) : (
                                  <span className="text-[9px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 px-1 py-0.2 rounded">
                                    Unverified
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">{u.department}</div>
                            </div>
                          </div>
                          <span
                            className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-md shrink-0 ${style.bg} ${style.text}`}
                          >
                            {u.role}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500">
                    <p>Current Institution:</p>
                    <p className="font-medium text-slate-700 dark:text-slate-300 truncate">
                      {currentUser.institution}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Subnav */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <button
            onClick={() => setCurrentTab('home')}
            className={`py-1 px-2 font-medium ${currentTab === 'home' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('catalogue')}
            className={`py-1 px-2 font-medium ${currentTab === 'catalogue' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
          >
            Catalogue
          </button>
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`py-1 px-2 font-medium ${currentTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
          >
            {currentUser.role === 'student' ? 'My Bookings' : 'Dashboard'}
          </button>
          <button
            onClick={() => setCurrentTab('audit')}
            className={`py-1 px-2 font-medium ${currentTab === 'audit' ? 'text-indigo-600 font-bold' : 'text-slate-600'}`}
          >
            Audit Log
          </button>
        </div>
      </div>
    </header>
  );
};
