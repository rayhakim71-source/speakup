// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import { SessionData, ToolkitCategory, ScheduleSettings, CmsSettings, HistoryItem, SyncSettings, TopicProposal, Role, GalleryPhoto } from '../types';
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
  gallery: 'speakup_gallery_v1',
};

const OLD_WEB_APP_URL = 'https://script.google.com/a/macros/guru.smp.belajar.id/s/AKfycbzmrZU3lIcpK41IWf7xjYWO8J_XCSi4GKh5yOEHcqohtjHffgwmBP37B7QpIPEA_rDAbw/exec';
const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwTAx5MwJY9kSaZIptoQ84IsGoU6gfASber-JMkQ1bI7Rpe5BxAJroiB4sk35Jmn8twYg/exec';

export async function postToAppsScript(webAppUrl: string, payload: Record<string, unknown>) {
  const res = await fetch(webAppUrl, {
    method: 'POST',
    redirect: 'follow',
    cache: 'no-store',
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

// Gallery storage & Drive photo helpers
export const getStoredGallery = (): GalleryPhoto[] => {
  const data = localStorage.getItem(KEYS.gallery);
  if (!data) return [];
  try {
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveStoredGallery = (gallery: GalleryPhoto[]) => {
  localStorage.setItem(KEYS.gallery, JSON.stringify(gallery));
};

export const getDriveThumbUrl = (fileId: string, size: 600 | 1600): string => {
  return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w${size}`;
};

const galleryFallbackMemoryCache = new Map<string, string>();
const galleryFallbackInFlight = new Map<string, Promise<string | null>>();

export const getCachedGalleryImage = (fileId: string): string | null => {
  if (galleryFallbackMemoryCache.has(fileId)) {
    return galleryFallbackMemoryCache.get(fileId) || null;
  }
  try {
    const cached = sessionStorage.getItem(`speakup_img_${fileId}`);
    if (cached) {
      galleryFallbackMemoryCache.set(fileId, cached);
      return cached;
    }
  } catch {
    // ignore storage errors
  }
  return null;
};

export const fetchGalleryImageFallback = async (webAppUrl: string, fileId: string): Promise<string | null> => {
  const existing = getCachedGalleryImage(fileId);
  if (existing) return existing;
  if (!webAppUrl || !fileId) return null;

  const pending = galleryFallbackInFlight.get(fileId);
  if (pending) return pending;

  const task = postToAppsScript(webAppUrl, { action: 'galeriGambar', fileId })
    .then((res) => {
      if (res && res.success && typeof res.dataUrl === 'string' && res.dataUrl.startsWith('data:image/')) {
        galleryFallbackMemoryCache.set(fileId, res.dataUrl);
        try {
          sessionStorage.setItem(`speakup_img_${fileId}`, res.dataUrl);
        } catch {
          // ignore sessionStorage quota errors
        }
        return res.dataUrl;
      }
      return null;
    })
    .catch(() => null)
    .finally(() => {
      galleryFallbackInFlight.delete(fileId);
    });

  galleryFallbackInFlight.set(fileId, task);
  return task;
};

export const compressImageFile = (
  file: File
): Promise<{ base64: string; mimeType: string; fileName: string }> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const maxDim = 1600;
      const longest = Math.max(img.width, img.height);
      const scale = longest > maxDim ? maxDim / longest : 1;
      const targetW = Math.max(1, Math.round(img.width * scale));
      const targetH = Math.max(1, Math.round(img.height * scale));

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }
      ctx.drawImage(img, 0, 0, targetW, targetH);

      let quality = 0.8;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);
      // Target < 1 MB
      while (dataUrl.length * 0.75 > 980 * 1024 && quality > 0.35) {
        quality = Number((quality - 0.1).toFixed(2));
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      const base64 = dataUrl.split(',')[1] || '';
      const baseName = file.name.replace(/\.[^.]+$/, '') || 'photo';
      resolve({
        base64,
        mimeType: 'image/jpeg',
        fileName: `${baseName}.jpg`,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Invalid image file'));
    };
    img.src = objectUrl;
  });
};
