import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { HomeHero } from './components/HomeHero';
import { CatalogueView } from './components/CatalogueView';
import { DashboardView } from './components/DashboardView';
import { AuditTrailView } from './components/AuditTrailView';
import { ResourceDetailModal } from './components/ResourceDetailModal';
import { CheckInModal } from './components/CheckInModal';
import { CheckOutModal } from './components/CheckOutModal';
import { IncidentModal } from './components/IncidentModal';
import { IncidentReviewModal } from './components/IncidentReviewModal';
import { CreateResourceModal } from './components/CreateResourceModal';
import { FairUsePolicyModal } from './components/FairUsePolicyModal';
import { AIMatcherModal } from './components/AIMatcherModal';
import { Resource, Booking, Incident } from './types';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
  Layers,
  Heart,
  Github,
  Award,
} from 'lucide-react';

function MainAppContent() {
  const [currentTab, setCurrentTab] = useState<'home' | 'catalogue' | 'dashboard' | 'audit'>('home');

  // Modals state
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [checkInBooking, setCheckInBooking] = useState<Booking | null>(null);
  const [checkOutBooking, setCheckOutBooking] = useState<Booking | null>(null);
  const [incidentBooking, setIncidentBooking] = useState<Booking | null>(null);
  const [reviewIncident, setReviewIncident] = useState<Incident | null>(null);

  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);
  const [isFairUsePolicyOpen, setIsFairUsePolicyOpen] = useState(false);
  const [isAIMatcherOpen, setIsAIMatcherOpen] = useState(false);

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => setCurrentTab(tab as any)}
        onOpenAIMatcher={() => setIsAIMatcherOpen(true)}
      />

      {/* View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'home' && (
          <HomeHero
            onExplore={() => setCurrentTab('catalogue')}
            onOpenAIMatcher={() => setIsAIMatcherOpen(true)}
          />
        )}

        {currentTab === 'catalogue' && (
          <CatalogueView
            onSelectResource={(res) => setSelectedResource(res)}
            onOpenCreateResource={() => setIsCreateResourceOpen(true)}
            onOpenAIMatcher={() => setIsAIMatcherOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            onCheckIn={(b) => setCheckInBooking(b)}
            onCheckOut={(b) => setCheckOutBooking(b)}
            onReportIncident={(b) => setIncidentBooking(b)}
            onReviewIncident={(inc) => setReviewIncident(inc)}
            onOpenCreateResource={() => setIsCreateResourceOpen(true)}
            onOpenFairUsePolicy={() => setIsFairUsePolicyOpen(true)}
            onOpenAIMatcher={() => setIsAIMatcherOpen(true)}
            onNavigateCatalogue={() => setCurrentTab('catalogue')}
          />
        )}

        {currentTab === 'audit' && <AuditTrailView />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">ShareSpace</span>
            <span>— Smart Resource Sharing Platform</span>
            <span className="text-slate-400">|</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-medium">CodeHack India 2026</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Tagline: Make Idle Resources Useful. Share Safely. Access Fairly.</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedResource && (
        <ResourceDetailModal
          resource={selectedResource}
          onClose={() => setSelectedResource(null)}
          onBookingSuccess={() => {
            showToast('Booking request submitted to resource owner!');
            setCurrentTab('dashboard');
          }}
        />
      )}

      {checkInBooking && (
        <CheckInModal
          booking={checkInBooking}
          onClose={() => setCheckInBooking(null)}
          onSuccess={() => {
            showToast('Pre-use inspection verified. Checked in successfully!');
          }}
        />
      )}

      {checkOutBooking && (
        <CheckOutModal
          booking={checkOutBooking}
          onClose={() => setCheckOutBooking(null)}
          onSuccess={() => {
            showToast('Return inspection completed and resource checked out!');
          }}
        />
      )}

      {incidentBooking && (
        <IncidentModal
          booking={incidentBooking}
          onClose={() => setIncidentBooking(null)}
          onSuccess={() => {
            showToast('Incident report logged. Forwarded for facility review.');
          }}
        />
      )}

      {reviewIncident && (
        <IncidentReviewModal
          incident={reviewIncident}
          onClose={() => setReviewIncident(null)}
          onSuccess={() => {
            showToast('Incident resolved and documented in immutable audit log.');
          }}
        />
      )}

      {isCreateResourceOpen && (
        <CreateResourceModal
          isOpen={isCreateResourceOpen}
          onClose={() => setIsCreateResourceOpen(false)}
          onSuccess={() => {
            showToast('Resource listed successfully in campus catalogue!');
            setCurrentTab('catalogue');
          }}
        />
      )}

      {isFairUsePolicyOpen && (
        <FairUsePolicyModal
          isOpen={isFairUsePolicyOpen}
          onClose={() => {
            setIsFairUsePolicyOpen(false);
            showToast('Campus fair-use policies updated.');
          }}
        />
      )}

      {isAIMatcherOpen && (
        <AIMatcherModal
          isOpen={isAIMatcherOpen}
          onClose={() => setIsAIMatcherOpen(false)}
          onSelectResource={(res) => {
            setSelectedResource(res);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
