// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TopicProposal, SyncSettings } from '../../types';
import { addHistoryItem, postToAppsScript, getStoredSync } from '../../utils/storage';

interface AdminProposalsProps {
  proposals: TopicProposal[];
  sync: SyncSettings;
  role: string;
  onUpdateProposalStatus: (id: string, status: 'Baru' | 'Disetujui' | 'Ditolak') => void;
  onSaveProposals: (proposals: TopicProposal[]) => void;
  onCreateSessionFromProposal: (proposal: TopicProposal) => void;
  showToast: (msg: string) => void;
}

export const AdminProposals: React.FC<AdminProposalsProps> = ({
  proposals,
  sync,
  role,
  onUpdateProposalStatus,
  onSaveProposals,
  onCreateSessionFromProposal,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [fetchStatus, setFetchStatus] = useState<string | null>(null);
  const [detailProposal, setDetailProposal] = useState<TopicProposal | null>(null);

  const onSaveProposalsRef = useRef(onSaveProposals);
  onSaveProposalsRef.current = onSaveProposals;
  const showToastRef = useRef(showToast);
  showToastRef.current = showToast;

  const fetchFromSheet = useCallback(async (isManual = false) => {
    const activeSync = sync.webAppUrl ? sync : getStoredSync();
    if (!activeSync.webAppUrl) {
      if (isManual) showToastRef.current('Gagal');
      return;
    }
    setLoadingSheet(true);
    setFetchStatus(null);
    try {
      const data = await postToAppsScript(activeSync.webAppUrl, {
        action: 'getProposals',
        token: activeSync.token,
        sheetName: activeSync.proposalsSheetName || 'Form Responses 1',
      });
      if (data.success && Array.isArray(data.proposals)) {
        onSaveProposalsRef.current(data.proposals);
        if (isManual) showToastRef.current('Berhasil dimuat');
      } else {
        setFetchStatus(data.error || 'Gagal');
        if (isManual) showToastRef.current('Gagal');
      }
    } catch {
      setFetchStatus('Offline');
      if (isManual) showToastRef.current('Gagal');
    } finally {
      setLoadingSheet(false);
    }
  }, [sync.webAppUrl, sync.token, sync.proposalsSheetName]);

  useEffect(() => {
    fetchFromSheet(false);
  }, [fetchFromSheet]);

  const filtered = proposals
    .filter((p) => statusFilter === 'All' || p.status === statusFilter)
    .filter(
      (p) =>
        p.namaDepan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.usulanTopik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pertanyaanUtama.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const updateSheetStatus = async (p: TopicProposal, newStatus: 'Disetujui' | 'Ditolak') => {
    const activeSync = sync.webAppUrl ? sync : getStoredSync();
    const rowIdx = (p as TopicProposal & { rowIdx?: number }).rowIdx;
    if (activeSync.webAppUrl && rowIdx) {
      try {
        await postToAppsScript(activeSync.webAppUrl, {
          action: 'updateProposalStatus',
          token: activeSync.token,
          sheetName: activeSync.proposalsSheetName || 'Form Responses 1',
          rowIndex: rowIdx,
          status: newStatus,
        });
      } catch {
        // local status already updated
      }
    }
  };

  const handleApprove = async (p: TopicProposal) => {
    if (confirm('Setujui usulan ini?')) {
      onUpdateProposalStatus(p.id, 'Disetujui');
      if (detailProposal?.id === p.id) {
        setDetailProposal({ ...p, status: 'Disetujui' });
      }
      addHistoryItem(role, 'Usulan', `Menyetujui usulan topik: ${p.usulanTopik}`);
      showToast('Berhasil disimpan');
      await updateSheetStatus(p, 'Disetujui');
    }
  };

  const handleReject = async (p: TopicProposal) => {
    if (confirm('Tolak usulan ini?')) {
      onUpdateProposalStatus(p.id, 'Ditolak');
      if (detailProposal?.id === p.id) {
        setDetailProposal({ ...p, status: 'Ditolak' });
      }
      addHistoryItem(role, 'Usulan', `Menolak usulan topik: ${p.usulanTopik}`);
      showToast('Berhasil disimpan');
      await updateSheetStatus(p, 'Ditolak');
    }
  };

  const handleConvertToSession = (p: TopicProposal) => {
    if (confirm('Jadikan sesi baru (Draf)?')) {
      onCreateSessionFromProposal(p);
      addHistoryItem(role, 'Usulan', `Mengubah usulan menjadi sesi Draf: ${p.usulanTopik}`);
      showToast('Berhasil disimpan');
    }
  };

  if (detailProposal) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-[#252623]/10 pb-4">
          <button
            onClick={() => setDetailProposal(null)}
            className="text-sm font-medium text-[#183D35] hover:text-[#B96549] min-h-[44px]"
          >
            ← Kembali
          </button>
          <span className="text-sm font-semibold text-[#183D35]">{detailProposal.status}</span>
        </div>

        <div className="bg-white border border-[#252623]/10 p-6 md:p-8 rounded shadow-sm space-y-6">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wider text-[#B96549] font-semibold">
              {detailProposal.kelas} · {detailProposal.namaDepan} · {detailProposal.timestamp}
            </p>
            <h3 className="font-serif font-bold text-2xl text-[#183D35]">{detailProposal.usulanTopik}</h3>
          </div>

          {detailProposal.pertanyaanUtama && (
            <div>
              <p className="text-xs uppercase tracking-wider text-[#252623]/60 mb-1">Pertanyaan Utama</p>
              <p className="text-base italic text-[#252623]">"{detailProposal.pertanyaanUtama}"</p>
            </div>
          )}

          <div>
            <p className="text-xs uppercase tracking-wider text-[#252623]/60 mb-2">Pertanyaan Diskusi</p>
            <ol className="space-y-2 text-sm text-[#252623]/90">
              {detailProposal.diskusi1 && <li>1. {detailProposal.diskusi1}</li>}
              {detailProposal.diskusi2 && <li>2. {detailProposal.diskusi2}</li>}
              {detailProposal.diskusi3 && <li>3. {detailProposal.diskusi3}</li>}
            </ol>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[#252623]/10">
            {detailProposal.status !== 'Disetujui' && (
              <button
                onClick={() => handleApprove(detailProposal)}
                className="px-5 py-2.5 min-h-[44px] bg-[#183D35] text-[#F2EBDD] text-sm font-medium rounded hover:bg-[#183D35]/90"
              >
                Setujui
              </button>
            )}
            {detailProposal.status !== 'Ditolak' && (
              <button
                onClick={() => handleReject(detailProposal)}
                className="px-5 py-2.5 min-h-[44px] bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200"
              >
                Tolak
              </button>
            )}
            <button
              onClick={() => handleConvertToSession(detailProposal)}
              className="px-5 py-2.5 min-h-[44px] bg-[#D6A64A] text-[#183D35] text-sm font-medium rounded hover:bg-[#D6A64A]/90"
            >
              Jadikan Sesi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Manajemen</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Usulan Topik</h2>
        </div>
        <div className="flex items-center space-x-4">
          {fetchStatus && (
            <span className="text-sm text-red-600">{fetchStatus}</span>
          )}
          {sync.webAppUrl && (
            <button
              onClick={() => fetchFromSheet(true)}
              disabled={loadingSheet}
              className="bg-[#183D35] text-[#F2EBDD] px-5 py-2.5 min-h-[44px] rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
            >
              {loadingSheet ? 'Memuat...' : 'Tarik dari Sheet'}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari usulan..."
          className="flex-1 bg-white border border-[#252623]/20 px-4 py-2.5 min-h-[48px] rounded text-base md:text-sm focus:outline-none focus:border-[#183D35]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#252623]/20 px-4 py-2.5 min-h-[48px] rounded text-base md:text-sm focus:outline-none focus:border-[#183D35]"
        >
          <option value="All">Semua Status</option>
          <option value="Baru">Baru</option>
          <option value="Disetujui">Disetujui</option>
          <option value="Ditolak">Ditolak</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-[#252623]/10 p-12 text-center rounded shadow-sm">
          <p className="font-serif font-bold text-xl text-[#183D35]">Belum ada data</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-[#252623]/10 p-6 rounded shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#252623]/10 pb-4 gap-2">
                <div>
                  <span className="text-xs uppercase tracking-wider text-[#B96549] font-semibold">{p.kelas} · {p.namaDepan}</span>
                  <h3 className="font-serif font-bold text-xl text-[#183D35] mt-1">{p.usulanTopik}</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold text-[#183D35]">
                    {p.status}
                  </span>
                  <span className="text-xs text-[#252623]/60">{p.timestamp}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {p.pertanyaanUtama && (
                  <p><strong className="text-[#183D35]">Pertanyaan Utama:</strong> "{p.pertanyaanUtama}"</p>
                )}
                <div className="bg-[#F2EBDD]/40 p-3 rounded space-y-1 text-xs text-[#252623]/80">
                  {p.diskusi1 && <p>1. {p.diskusi1}</p>}
                  {p.diskusi2 && <p>2. {p.diskusi2}</p>}
                  {p.diskusi3 && <p>3. {p.diskusi3}</p>}
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-[#252623]/10">
                <button
                  onClick={() => setDetailProposal(p)}
                  className="px-4 py-2 min-h-[44px] border border-[#252623]/30 text-[#252623] text-xs font-medium rounded hover:bg-[#252623]/5"
                >
                  Detail
                </button>
                {p.status !== 'Disetujui' && (
                  <button
                    onClick={() => handleApprove(p)}
                    className="px-4 py-2 min-h-[44px] bg-[#183D35] text-[#F2EBDD] text-xs font-medium rounded hover:bg-[#183D35]/90"
                  >
                    Setujui
                  </button>
                )}
                {p.status !== 'Ditolak' && (
                  <button
                    onClick={() => handleReject(p)}
                    className="px-4 py-2 min-h-[44px] bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200"
                  >
                    Tolak
                  </button>
                )}
                <button
                  onClick={() => handleConvertToSession(p)}
                  className="px-4 py-2 min-h-[44px] bg-[#D6A64A] text-[#183D35] text-xs font-medium rounded hover:bg-[#D6A64A]/90"
                >
                  Jadikan Sesi
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
