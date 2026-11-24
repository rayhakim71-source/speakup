// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect } from 'react';
import {
  getStoredSessions,
  saveStoredSessions,
  getStoredToolkit,
  saveStoredToolkit,
  getStoredSchedule,
  saveStoredSchedule,
  getStoredProposals,
  saveStoredProposals,
  getStoredCms,
  saveStoredCms,
  getStoredHistory,
  getStoredSync,
  getStoredAuth,
  clearStoredAuth,
  addHistoryItem,
  postToAppsScript,
} from './utils/storage';
import { SessionData, ToolkitCategory, ScheduleSettings, CmsSettings, TopicProposal, SyncSettings } from './types';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileSidebar } from './components/common/MobileSidebar';
import { LoginModal } from './components/common/LoginModal';
import { NotificationToast } from './components/common/NotificationToast';

import { HomeSection } from './components/public/HomeSection';
import { ThisWeekSection } from './components/public/ThisWeekSection';
import { ToolkitSection } from './components/public/ToolkitSection';
import { ArchiveSection } from './components/public/ArchiveSection';
import { AboutSection } from './components/public/AboutSection';
import { SessionDetail } from './components/public/SessionDetail';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminSessions } from './components/admin/AdminSessions';
import { AdminProposals } from './components/admin/AdminProposals';
import { AdminToolkit } from './components/admin/AdminToolkit';
import { AdminSchedule } from './components/admin/AdminSchedule';
import { AdminHistory } from './components/admin/AdminHistory';
import { AdminPassword } from './components/admin/AdminPassword';

import { SuperCms } from './components/superadmin/SuperCms';
import { SuperSync } from './components/superadmin/SuperSync';
import { SuperFirebase } from './components/superadmin/SuperFirebase';
import { SuperUsers } from './components/superadmin/SuperUsers';

export default function App() {
  const [sessions, setSessions] = useState<SessionData[]>(getStoredSessions());
  const [toolkit, setToolkit] = useState<ToolkitCategory[]>(getStoredToolkit());
  const [schedule, setSchedule] = useState<ScheduleSettings>(getStoredSchedule());
  const [proposals, setProposals] = useState<TopicProposal[]>(getStoredProposals());
  const [cms, setCms] = useState<CmsSettings>(getStoredCms());
  const [sync, setSync] = useState<SyncSettings>(getStoredSync());
  const [auth, setAuth] = useState(getStoredAuth());

  const [currentView, setCurrentView] = useState<'public' | 'session-detail' | 'admin'>('public');
  const [publicView, setPublicView] = useState<'home' | 'this-week' | 'toolkit' | 'archive' | 'about'>('home');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [editingSessionIdFromProposal, setEditingSessionIdFromProposal] = useState<string | null>(null);
  const [adminMenu, setAdminMenu] = useState<string>('dashboard');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 500);
  };

  // URL Routing / Hash sync
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#home';
      if (hash.startsWith('#session/')) {
        const id = hash.replace('#session/', '');
        setSelectedSessionId(id);
        setCurrentView('session-detail');
      } else if (hash === '#admin' || hash === '#superadmin') {
        if (auth.isLoggedIn) {
          setCurrentView('admin');
        } else {
          setIsLoginOpen(true);
        }
      } else if (hash === '#this-week') {
        setCurrentView('public');
        setPublicView('this-week');
      } else if (hash === '#toolkit') {
        setCurrentView('public');
        setPublicView('toolkit');
      } else if (hash === '#archive') {
        setCurrentView('public');
        setPublicView('archive');
      } else if (hash === '#about') {
        setCurrentView('public');
        setPublicView('about');
      } else {
        setCurrentView('public');
        setPublicView('home');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash || window.location.hash === '#') {
      window.location.hash = '#home';
    } else {
      handleHashChange();
    }

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [auth.isLoggedIn]);

  // Pull synced public data from Google Sheets on initial load
  useEffect(() => {
    const activeSync = getStoredSync();
    if (!activeSync.webAppUrl) return;
    let cancelled = false;
    postToAppsScript(activeSync.webAppUrl, { action: 'getPublicData' })
      .then((res) => {
        if (cancelled || !res || !res.success) return;
        if (Array.isArray(res.sessions) && res.sessions.length > 0) {
          setSessions((prev) => {
            const drafts = prev.filter((s) => s.status === 'Draf');
            const merged = [...drafts, ...res.sessions.filter((s: SessionData) => s.status !== 'Draf')];
            saveStoredSessions(merged);
            return merged;
          });
        }
        if (Array.isArray(res.toolkit) && res.toolkit.length > 0) {
          setToolkit(res.toolkit);
          saveStoredToolkit(res.toolkit);
        }
        if (res.schedule) {
          setSchedule((prev) => {
            const merged = { ...prev, ...res.schedule };
            saveStoredSchedule(merged);
            return merged;
          });
        }
        if (res.cms) {
          setCms((prev) => {
            const merged = { ...prev, ...res.cms };
            saveStoredCms(merged);
            return merged;
          });
        }
      })
      .catch(() => {
        // fallback cleanly to local storage when offline
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNavigate = (href: string) => {
    if (href.startsWith('#')) {
      window.location.hash = href;
    }
  };

  const handleOpenDashboard = () => {
    setCurrentView('admin');
    window.location.hash = auth.role === 'superadmin' ? '#superadmin' : '#admin';
  };

  const handleLogout = () => {
    clearStoredAuth();
    setAuth({ isLoggedIn: false, role: 'public', lastActive: Date.now() });
    setCurrentView('public');
    setPublicView('home');
    window.location.hash = '#home';
    showToast('Berhasil keluar');
  };

  const upcomingSession = sessions.find((s) => s.status === 'Mendatang') || null;
  const selectedArchivedSession = sessions.find((s) => s.id === selectedSessionId) || null;
  const hasDocumentation = Boolean(upcomingSession?.tautanDokumentasi || schedule.generalDocLink);
  const docLink = upcomingSession?.tautanDokumentasi || schedule.generalDocLink;

  // Save handlers
  const handleSaveSessions = (updated: SessionData[]) => {
    setSessions(updated);
    saveStoredSessions(updated);
  };

  const handleSaveToolkit = (updated: ToolkitCategory[]) => {
    setToolkit(updated);
    saveStoredToolkit(updated);
    addHistoryItem(auth.role, 'Toolkit', 'Speaking Toolkit diperbarui.');
  };

  const handleSaveSchedule = (updated: ScheduleSettings) => {
    setSchedule(updated);
    saveStoredSchedule(updated);
    addHistoryItem(auth.role, 'Jadwal', 'Pengaturan jadwal diperbarui.');
  };

  const handleSaveCms = (updated: CmsSettings) => {
    setCms(updated);
    saveStoredCms(updated);
    addHistoryItem(auth.role, 'CMS', 'Pengaturan CMS diperbarui.');
  };

  const handleUpdateProposalStatus = (id: string, status: 'Baru' | 'Disetujui' | 'Ditolak') => {
    const updated = proposals.map((p) => (p.id === id ? { ...p, status } : p));
    setProposals(updated);
    saveStoredProposals(updated);
  };

  const handleCreateSessionFromProposal = (proposal: TopicProposal) => {
    const nextNum = 'Session ' + String(sessions.length + 1).padStart(2, '0');
    const newSes: SessionData = {
      id: 'ses-' + Date.now(),
      number: nextNum,
      topik: proposal.usulanTopik,
      pertanyaanUtama: proposal.pertanyaanUtama,
      tanggal: 'Saturday, upcoming',
      dateMode: 'auto',
      pembicara: proposal.namaDepan,
      status: 'Draf',
      tautanDokumentasi: '',
      ringkasan: '',
      pengantar: '',
      discussionQuestions: [proposal.diskusi1, proposal.diskusi2, proposal.diskusi3].filter(Boolean),
      vocabulary: [],
      expressions: [],
      sentenceStarters: ['I think...', 'In my opinion...'],
      miniChallenge: 'Share your ideas.',
      preparationChallenge: '',
    };
    const updatedSessions = [newSes, ...sessions];
    handleSaveSessions(updatedSessions);
    handleUpdateProposalStatus(proposal.id, 'Disetujui');
    setEditingSessionIdFromProposal(newSes.id);
    setAdminMenu('sessions');
  };

  // Session actions for admin
  const handleSaveSingleSession = (session: SessionData) => {
    const exists = sessions.some((s) => s.id === session.id);
    let updated: SessionData[];
    if (exists) {
      updated = sessions.map((s) => (s.id === session.id ? session : s));
    } else {
      updated = [session, ...sessions];
    }
    handleSaveSessions(updated);
    addHistoryItem(auth.role, 'Sesi', 'Daftar sesi diperbarui.');
  };

  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    handleSaveSessions(updated);
    addHistoryItem(auth.role, 'Sesi', 'Sesi dihapus.');
  };

  const handleToggleStatus = (id: string) => {
    const updated = sessions.map((s) => {
      if (s.id === id) {
        const newStatus = s.status === 'Mendatang' ? 'Arsip' : 'Mendatang';
        return { ...s, status: newStatus as any };
      }
      if (s.status === 'Mendatang') {
        return { ...s, status: 'Arsip' as any };
      }
      return s;
    });
    handleSaveSessions(updated);
    addHistoryItem(auth.role, 'Sesi', 'Status sesi diubah.');
    showToast('Berhasil disimpan');
  };

  if (currentView === 'admin' && auth.isLoggedIn) {
    return (
      <AdminLayout
        role={auth.role}
        activeMenu={adminMenu}
        onSelectMenu={(menu) => setAdminMenu(menu)}
        onLogout={handleLogout}
        onGoHome={() => {
          setCurrentView('public');
          setPublicView('home');
          window.location.hash = '#home';
        }}
      >
        {adminMenu === 'dashboard' && (
          <AdminDashboard sessions={sessions} proposals={proposals} schedule={schedule} onNavigateMenu={(m) => setAdminMenu(m)} />
        )}
        {adminMenu === 'sessions' && (
          <AdminSessions
            sessions={sessions}
            initialEditSessionId={editingSessionIdFromProposal}
            onClearInitialEdit={() => setEditingSessionIdFromProposal(null)}
            onSaveSession={handleSaveSingleSession}
            onDeleteSession={handleDeleteSession}
            onToggleStatus={handleToggleStatus}
            showToast={showToast}
          />
        )}
        {adminMenu === 'proposals' && (
          <AdminProposals
            proposals={proposals}
            sync={sync}
            role={auth.role}
            onUpdateProposalStatus={handleUpdateProposalStatus}
            onSaveProposals={(props) => {
              setProposals(props);
              saveStoredProposals(props);
            }}
            onCreateSessionFromProposal={handleCreateSessionFromProposal}
            showToast={showToast}
          />
        )}
        {adminMenu === 'toolkit' && (
          <AdminToolkit toolkit={toolkit} onSaveToolkit={handleSaveToolkit} showToast={showToast} />
        )}
        {adminMenu === 'schedule' && (
          <AdminSchedule schedule={schedule} onSaveSchedule={handleSaveSchedule} showToast={showToast} />
        )}
        {adminMenu === 'history' && <AdminHistory history={getStoredHistory()} />}
        {adminMenu === 'password' && <AdminPassword showToast={showToast} />}
        {adminMenu === 'cms' && auth.role === 'superadmin' && (
          <SuperCms cms={cms} onSaveCms={handleSaveCms} showToast={showToast} />
        )}
        {adminMenu === 'sync' && auth.role === 'superadmin' && (
          <SuperSync
            sessions={sessions}
            toolkit={toolkit}
            schedule={schedule}
            cms={cms}
            onSyncChange={(updated) => setSync(updated)}
            onProposalsLoaded={(props) => {
              setProposals(props);
              saveStoredProposals(props);
            }}
            showToast={showToast}
          />
        )}
        {adminMenu === 'firebase' && auth.role === 'superadmin' && <SuperFirebase />}
        {adminMenu === 'users' && auth.role === 'superadmin' && <SuperUsers showToast={showToast} />}
        <NotificationToast message={toastMessage} />
      </AdminLayout>
    );
  }

  if (currentView === 'session-detail' && selectedArchivedSession && (selectedArchivedSession.status !== 'Draf' || auth.isLoggedIn)) {
    return (
      <div className="min-h-screen bg-[#F2EBDD] text-[#252623] flex flex-col justify-between">
        <SessionDetail
          session={selectedArchivedSession}
          schedule={schedule}
          onBack={() => {
            setCurrentView('public');
            setPublicView('archive');
            window.location.hash = '#archive';
          }}
        />
        <Footer cms={cms} schedule={schedule} />
        <NotificationToast message={toastMessage} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2EBDD] text-[#252623] flex flex-col justify-between">
      <Header
        cms={cms}
        authRole={auth.role}
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        hasDocumentation={hasDocumentation}
        docLink={docLink}
        proposalFormLink={schedule.proposalFormLink}
      />

      <MobileSidebar
        cms={cms}
        authRole={auth.role}
        onNavigate={handleNavigate}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        hasDocumentation={hasDocumentation}
        docLink={docLink}
        proposalFormLink={schedule.proposalFormLink}
      />

      <main className="flex-1">
        {publicView === 'home' && (
          <HomeSection
            cms={cms}
            schedule={schedule}
            upcomingSession={upcomingSession}
            onExplore={() => handleNavigate('#this-week')}
            onViewDoc={() => {}}
          />
        )}
        {publicView === 'this-week' && <ThisWeekSection session={upcomingSession} schedule={schedule} />}
        {publicView === 'toolkit' && cms.features.toolkitSearchEnabled && <ToolkitSection toolkit={toolkit} />}
        {publicView === 'archive' && (
          <ArchiveSection
            sessions={sessions}
            onSelectSession={(id) => {
              window.location.hash = `#session/${id}`;
            }}
          />
        )}
        {publicView === 'about' && <AboutSection cms={cms} />}
      </main>

      <Footer cms={cms} schedule={schedule} />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(role) => {
          setAuth({ isLoggedIn: true, role, lastActive: Date.now() });
          setCurrentView('admin');
          window.location.hash = role === 'superadmin' ? '#superadmin' : '#admin';
        }}
        showToast={showToast}
      />

      <NotificationToast message={toastMessage} />
    </div>
  );
};
