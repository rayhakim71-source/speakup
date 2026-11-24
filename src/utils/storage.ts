// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { SessionData, ToolkitCategory, ScheduleSettings, CmsSettings, HistoryItem, SyncSettings, TopicProposal, Role } from '../types';
import { initialSessions, initialToolkit, initialSchedule, initialCms, initialProposals } from '../data/initialData';

const KEYS = {
  sessions: 'speakup_sessions_v1',
  toolkit: 'speakup_toolkit_v1',
  schedule: 'speakup_schedule_v1',
  cms: 'speakup_cms_v1',
  history: 'speakup_history_v1',
  sync: 'speakup_sync_v1',
  auth: 'speakup_auth_v1',
  passwords: 'speakup_passwords_v1',
  proposals: 'speakup_proposals_v1',
};

const OLD_WEB_APP_URL = 'https://script.google.com/a/macros/guru.smp.belajar.id/s/AKfycbzmrZU3lIcpK41IWf7xjYWO8J_XCSi4GKh5yOEHcqohtjHffgwmBP37B7QpIPEA_rDAbw/exec';
const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwTAx5MwJY9kSaZIptoQ84IsGoU6gfASber-JMkQ1bI7Rpe5BxAJroiB4sk35Jmn8twYg/exec';

export async function postToAppsScript(webAppUrl: string, payload: Record<string, unknown>) {
  const res = await fetch(webAppUrl, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export const getStoredSessions = (): SessionData[] => {
  const data = localStorage.getItem(KEYS.sessions);
  if (!data) return initialSessions;
  try { return JSON.parse(data); } catch { return initialSessions; }
};

export const saveStoredSessions = (sessions: SessionData[]) => {
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
};

export const getStoredToolkit = (): ToolkitCategory[] => {
  const data = localStorage.getItem(KEYS.toolkit);
  if (!data) return initialToolkit;
  try { return JSON.parse(data); } catch { return initialToolkit; }
};

export const saveStoredToolkit = (toolkit: ToolkitCategory[]) => {
  localStorage.setItem(KEYS.toolkit, JSON.stringify(toolkit));
};

export const getStoredSchedule = (): ScheduleSettings => {
  const data = localStorage.getItem(KEYS.schedule);
  if (!data) return initialSchedule;
  try {
    const parsed = JSON.parse(data);
    return { ...initialSchedule, ...parsed };
  } catch { return initialSchedule; }
};

export const saveStoredSchedule = (schedule: ScheduleSettings) => {
  localStorage.setItem(KEYS.schedule, JSON.stringify(schedule));
};

export const getStoredProposals = (): TopicProposal[] => {
  const data = localStorage.getItem(KEYS.proposals);
  if (!data) return initialProposals;
  try { return JSON.parse(data); } catch { return initialProposals; }
};

export const saveStoredProposals = (proposals: TopicProposal[]) => {
  localStorage.setItem(KEYS.proposals, JSON.stringify(proposals));
};

export const getStoredCms = (): CmsSettings => {
  const data = localStorage.getItem(KEYS.cms);
  if (!data) return initialCms;
  try { return JSON.parse(data); } catch { return initialCms; }
};

export const saveStoredCms = (cms: CmsSettings) => {
  localStorage.setItem(KEYS.cms, JSON.stringify(cms));
};

export const getStoredHistory = (): HistoryItem[] => {
  const data = localStorage.getItem(KEYS.history);
  if (!data) return [
    { id: 'h-1', timestamp: '2026-11-22 10:00', role: 'superadmin', action: 'Inisialisasi', details: 'Sistem dimulai dengan data contoh.' }
  ];
  try { return JSON.parse(data); } catch { return []; }
};

export const addHistoryItem = (role: string, action: string, details: string) => {
  const history = getStoredHistory();
  const newItem: HistoryItem = {
    id: 'h-' + Date.now(),
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    role,
    action,
    details,
  };
  localStorage.setItem(KEYS.history, JSON.stringify([newItem, ...history]));
};

export const getStoredSync = (): SyncSettings => {
  const data = localStorage.getItem(KEYS.sync);
  const defaultSync: SyncSettings = {
    webAppUrl: DEFAULT_WEB_APP_URL,
    token: 'GANTI_DENGAN_TOKEN_ANDA',
    driveFolderId: '',
    spreadsheetId: '',
    proposalsSheetName: 'Form Responses 1',
    connectionStatus: 'idle',
  };
  if (!data) return defaultSync;
  try {
    const parsed = JSON.parse(data);
    const resolvedUrl =
      !parsed.webAppUrl || parsed.webAppUrl === OLD_WEB_APP_URL
        ? DEFAULT_WEB_APP_URL
        : parsed.webAppUrl;
    const resolvedSheetName =
      !parsed.proposalsSheetName || parsed.proposalsSheetName === 'UsulanTopik'
        ? 'Form Responses 1'
        : parsed.proposalsSheetName;
    return {
      ...defaultSync,
      ...parsed,
      webAppUrl: resolvedUrl,
      proposalsSheetName: resolvedSheetName,
    };
  } catch { return defaultSync; }
};

export const saveStoredSync = (sync: SyncSettings) => {
  localStorage.setItem(KEYS.sync, JSON.stringify(sync));
};

// Passwords storage
export const getStoredPasswords = () => {
  const data = localStorage.getItem(KEYS.passwords);
  if (!data) {
    const defaults = { admin: 'admin123', superadmin: 'superadmin123' };
    localStorage.setItem(KEYS.passwords, JSON.stringify(defaults));
    return defaults;
  }
  try { return JSON.parse(data); } catch { return { admin: 'admin123', superadmin: 'superadmin123' }; }
};

export const saveStoredPasswords = (pwds: { admin: string; superadmin: string }) => {
  localStorage.setItem(KEYS.passwords, JSON.stringify(pwds));
};

// Auth state
export interface AuthState {
  isLoggedIn: boolean;
  role: Role;
  lastActive: number;
}

export const getStoredAuth = (): AuthState => {
  const data = localStorage.getItem(KEYS.auth);
  if (!data) return { isLoggedIn: false, role: 'public', lastActive: Date.now() };
  try {
    const auth: AuthState = JSON.parse(data);
    if (auth.isLoggedIn && Date.now() - auth.lastActive > 1800000) {
      localStorage.removeItem(KEYS.auth);
      return { isLoggedIn: false, role: 'public', lastActive: Date.now() };
    }
    return auth;
  } catch {
    return { isLoggedIn: false, role: 'public', lastActive: Date.now() };
  }
};

export const saveStoredAuth = (auth: AuthState) => {
  localStorage.setItem(KEYS.auth, JSON.stringify({ ...auth, lastActive: Date.now() }));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(KEYS.auth);
};
