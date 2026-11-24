// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { SyncSettings, SessionData, ToolkitCategory, ScheduleSettings, CmsSettings, TopicProposal } from '../../types';
import { getStoredSync, saveStoredSync, addHistoryItem, postToAppsScript } from '../../utils/storage';
import { APPS_SCRIPT_CODE } from '../../utils/appsScriptCode';

interface SuperSyncProps {
  sessions: SessionData[];
  toolkit: ToolkitCategory[];
  schedule: ScheduleSettings;
  cms: CmsSettings;
  onSyncChange: (sync: SyncSettings) => void;
  onProposalsLoaded: (proposals: TopicProposal[]) => void;
  showToast: (msg: string) => void;
}

export const SuperSync: React.FC<SuperSyncProps> = ({
  sessions,
  toolkit,
  schedule,
  cms,
  onSyncChange,
  onProposalsLoaded,
  showToast,
}) => {
  const [sync, setSync] = useState<SyncSettings>(getStoredSync());
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [syncingColl, setSyncingColl] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopied(true);
    showToast('Berhasil disalin');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSync(sync);
    onSyncChange(sync);
    addHistoryItem('superadmin', 'Sinkronisasi', 'Pengaturan sinkronisasi disimpan.');
    showToast('Berhasil disimpan');
  };

  const handleTestConnection = async () => {
    if (!sync.webAppUrl) {
      setTestResult('Gagal');
      return;
    }
    setTesting(true);
    try {
      const data = await postToAppsScript(sync.webAppUrl, {
        action: 'testConnection',
        token: sync.token,
      });
      if (data.success) {
        setTestResult('Terhubung');
        const updated: SyncSettings = { ...sync, connectionStatus: 'connected' };
        setSync(updated);
        saveStoredSync(updated);
        onSyncChange(updated);
      } else {
        setTestResult('Gagal');
        setSync({ ...sync, connectionStatus: 'failed' });
      }
    } catch {
      setTestResult('Gagal');
      setSync({ ...sync, connectionStatus: 'failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleSyncCollection = async (collectionName: string) => {
    if (!sync.webAppUrl) {
      showToast('Gagal');
      return;
    }
    setSyncingColl(collectionName);
    try {
      let ok = false;
      if (collectionName === 'Usulan') {
        const res = await postToAppsScript(sync.webAppUrl, {
          action: 'getProposals',
          token: sync.token,
          sheetName: sync.proposalsSheetName || 'Form Responses 1',
        });
        if (res.success && Array.isArray(res.proposals)) {
          onProposalsLoaded(res.proposals);
          ok = true;
        }
      } else if (collectionName === 'Sesi') {
        const res = await postToAppsScript(sync.webAppUrl, {
          action: 'syncData',
          token: sync.token,
          collection: 'Sesi',
          payload: sessions,
        });
        ok = Boolean(res.success);
      } else if (collectionName === 'Toolkit') {
        const res = await postToAppsScript(sync.webAppUrl, {
          action: 'syncData',
          token: sync.token,
          collection: 'Toolkit',
          payload: toolkit,
        });
        ok = Boolean(res.success);
      } else if (collectionName === 'Jadwal' || collectionName === 'Pengaturan CMS') {
        const res = await postToAppsScript(sync.webAppUrl, {
          action: 'syncData',
          token: sync.token,
          collection: 'Pengaturan',
          payload: { schedule, cms },
        });
        ok = Boolean(res.success);
      }

      if (ok) {
        const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const updated = { ...sync, lastSyncTime: now };
        setSync(updated);
        saveStoredSync(updated);
        onSyncChange(updated);
        addHistoryItem('superadmin', 'Sinkronisasi', `Sinkronisasi koleksi ${collectionName} berhasil.`);
        showToast('Berhasil disimpan');
      } else {
        showToast('Gagal');
      }
    } catch {
      showToast('Gagal');
    } finally {
      setSyncingColl(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Integrasi</p>
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Sinkronisasi Google Sheets</h2>
      </div>

      {/* Code Box */}
      <div className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-serif font-bold text-xl text-[#183D35]">Google Apps Script</h3>
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 bg-[#183D35] text-[#F2EBDD] rounded text-xs font-medium hover:bg-[#183D35]/90 transition-colors"
          >
            {copied ? 'Disalin' : 'Salin Kode'}
          </button>
        </div>
        <pre className="bg-[#252623] text-[#F2EBDD] p-4 rounded text-xs overflow-x-auto max-h-64">
          {APPS_SCRIPT_CODE}
        </pre>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSaveSettings} className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">URL Web App *</label>
            <input
              type="text"
              value={sync.webAppUrl}
              onChange={(e) => setSync({ ...sync, webAppUrl: e.target.value })}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 min-h-[48px] rounded text-sm focus:outline-none focus:border-[#183D35]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Token *</label>
            <input
              type="text"
              value={sync.token}
              onChange={(e) => setSync({ ...sync, token: e.target.value })}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 min-h-[48px] rounded text-sm focus:outline-none focus:border-[#183D35]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Nama Sheet Usulan</label>
            <input
              type="text"
              value={sync.proposalsSheetName || 'Form Responses 1'}
              onChange={(e) => setSync({ ...sync, proposalsSheetName: e.target.value })}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 min-h-[48px] rounded text-sm focus:outline-none focus:border-[#183D35]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-[#252623]/10">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-2 min-h-[44px] border border-[#252623] rounded text-sm font-medium hover:bg-[#252623]/5 transition-colors"
            >
              Uji Koneksi
            </button>
            {testResult && (
              <span className={`text-sm font-medium ${testResult === 'Terhubung' ? 'text-green-700' : 'text-red-600'}`}>
                {testResult}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 min-h-[44px] bg-[#183D35] text-[#F2EBDD] rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
          >
            Simpan
          </button>
        </div>
      </form>

      {/* Collections Sync */}
      <div className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-xl text-[#183D35]">Koleksi Data</h3>
        <div className="space-y-4">
          {['Sesi', 'Usulan', 'Toolkit', 'Jadwal', 'Pengaturan CMS'].map((coll) => (
            <div key={coll} className="flex justify-between items-center bg-[#F2EBDD]/30 p-4 rounded border border-[#252623]/10">
              <div>
                <span className="font-medium text-sm text-[#183D35]">{coll}</span>
                {sync.lastSyncTime && <span className="text-xs text-[#252623]/60 ml-4">{sync.lastSyncTime}</span>}
              </div>
              <button
                onClick={() => handleSyncCollection(coll)}
                disabled={syncingColl === coll}
                className="px-4 py-2 min-h-[44px] bg-[#183D35] text-[#F2EBDD] text-xs rounded hover:bg-[#183D35]/90 transition-colors"
              >
                {syncingColl === coll ? 'Menyinkronkan...' : 'Sinkronkan'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
