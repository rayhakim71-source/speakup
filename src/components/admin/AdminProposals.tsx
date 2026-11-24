// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { TopicProposal, SessionData, SyncSettings } from '../../types';
import { addHistoryItem } from '../../utils/storage';

interface AdminProposalsProps {
  proposals: TopicProposal[];
  sessions: SessionData[];
  sync: SyncSettings;
  onUpdateProposalStatus: (id: string, status: 'Baru' | 'Disetujui' | 'Ditolak') => void;
  onCreateSessionFromProposal: (proposal: TopicProposal) => void;
  showToast: (msg: string) => void;
}

export const AdminProposals: React.FC<AdminProposalsProps> = ({
  proposals,
  sessions,
  sync,
  onUpdateProposalStatus,
  onCreateSessionFromProposal,
  showToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loadingSheet, setLoadingSheet] = useState(false);

  const fetchFromSheet = async () => {
    if (!sync.webAppUrl) {
      showToast('Gagal');
      return;
    }
    setLoadingSheet(true);
    try {
      const res = await fetch(sync.webAppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'getProposals',
          token: sync.token,
          sheetName: sync.proposalsSheetName || 'UsulanTopik',
        }),
      });
      const data = await res.json();
      if (data.success && data.proposals) {
        showToast('Berhasil disimpan');
      } else {
        showToast('Gagal');
      }
    } catch {
      showToast('Gagal');
    } finally {
      setLoadingSheet(false);
    }
  };

  const filtered = proposals
    .filter((p) => statusFilter === 'All' || p.status === statusFilter)
    .filter(
      (p) =>
        p.namaDepan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.kelas.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.usulanTopik.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.pertanyaanUtama.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleApprove = (p: TopicProposal) => {
    if (confirm('Setujui usulan ini?')) {
      onUpdateProposalStatus(p.id, 'Disetujui');
      addHistoryItem('admin', 'Usulan', `Menyetujui usulan topik: ${p.usulanTopik}`);
      showToast('Berhasil disimpan');
    }
  };

  const handleReject = (p: TopicProposal) => {
    if (confirm('Tolak usulan ini?')) {
      onUpdateProposalStatus(p.id, 'Ditolak');
      addHistoryItem('admin', 'Usulan', `Menolak usulan topik: ${p.usulanTopik}`);
      showToast('Berhasil disimpan');
    }
  };

  const handleConvertToSession = (p: TopicProposal) => {
    if (confirm('Jadikan sesi baru (Draf)?')) {
      onCreateSessionFromProposal(p);
      addHistoryItem('admin', 'Usulan', `Mengubah usulan menjadi sesi Draf: ${p.usulanTopik}`);
      showToast('Berhasil disimpan');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Manajemen</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Usulan Topik</h2>
        </div>
        {sync.webAppUrl && (
          <button
            onClick={fetchFromSheet}
            disabled={loadingSheet}
            className="bg-[#183D35] text-[#F2EBDD] px-5 py-2.5 rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
          >
            Tarik dari Sheet
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari usulan..."
          className="flex-1 bg-white border border-[#252623]/20 px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#183D35]"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-[#252623]/20 px-4 py-2.5 rounded text-sm focus:outline-none focus:border-[#183D35]"
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
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      p.status === 'Baru'
                        ? 'bg-[#D6A64A] text-[#183D35]'
                        : p.status === 'Disetujui'
                        ? 'bg-[#183D35] text-[#F2EBDD]'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {p.status}
                  </span>
                  <span className="text-xs text-[#252623]/60">{p.timestamp}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p><strong className="text-[#183D35]">Pertanyaan Utama:</strong> "{p.pertanyaanUtama}"</p>
                <div className="bg-[#F2EBDD]/40 p-3 rounded space-y-1 text-xs text-[#252623]/80">
                  <p>1. {p.diskusi1}</p>
                  <p>2. {p.diskusi2}</p>
                  <p>3. {p.diskusi3}</p>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 pt-2 border-t border-[#252623]/10">
                {p.status !== 'Disetujui' && (
                  <button
                    onClick={() => handleApprove(p)}
                    className="px-4 py-1.5 bg-[#183D35] text-[#F2EBDD] text-xs font-medium rounded hover:bg-[#183D35]/90"
                  >
                    Setujui
                  </button>
                )}
                {p.status !== 'Ditolak' && (
                  <button
                    onClick={() => handleReject(p)}
                    className="px-4 py-1.5 bg-red-100 text-red-700 text-xs font-medium rounded hover:bg-red-200"
                  >
                    Tolak
                  </button>
                )}
                <button
                  onClick={() => handleConvertToSession(p)}
                  className="px-4 py-1.5 bg-[#D6A64A] text-[#183D35] text-xs font-medium rounded hover:bg-[#D6A64A]/90"
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
