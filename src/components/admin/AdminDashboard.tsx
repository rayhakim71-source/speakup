// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React from 'react';
import { SessionData, ScheduleSettings, TopicProposal } from '../../types';

interface AdminDashboardProps {
  sessions: SessionData[];
  proposals: TopicProposal[];
  schedule: ScheduleSettings;
  onNavigateMenu: (menu: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ sessions, proposals, schedule, onNavigateMenu }) => {
  const upcoming = sessions.find((s) => s.status === 'Mendatang');
  const archivedCount = sessions.filter((s) => s.status === 'Arsip').length;
  const newProposalsCount = proposals.filter((p) => p.status === 'Baru').length;
  const hasDoc = Boolean(upcoming?.tautanDokumentasi || schedule.generalDocLink);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Dashboard</p>
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Dasbor</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-[#252623]/10 p-6 rounded shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#252623]/60 mb-2">Sesi Mendatang</p>
          <p className="font-serif font-bold text-xl text-[#183D35] mb-1">
            {schedule.noSessionThisWeek ? 'Tidak ada sesi' : upcoming ? upcoming.number : 'Belum ada'}
          </p>
          <p className="text-sm text-[#252623]/80 truncate">{upcoming?.topik || '-'}</p>
        </div>

        <div className="bg-white border border-[#252623]/10 p-6 rounded shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#252623]/60 mb-2">Usulan Baru</p>
          <p className="font-serif font-bold text-3xl text-[#183D35]">{newProposalsCount}</p>
          <p className="text-sm text-[#252623]/80">Menunggu review</p>
        </div>

        <div className="bg-white border border-[#252623]/10 p-6 rounded shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#252623]/60 mb-2">Jumlah Arsip</p>
          <p className="font-serif font-bold text-3xl text-[#183D35]">{archivedCount}</p>
          <p className="text-sm text-[#252623]/80">Sesi tersimpan</p>
        </div>

        <div className="bg-white border border-[#252623]/10 p-6 rounded shadow-sm">
          <p className="text-xs uppercase tracking-wider text-[#252623]/60 mb-2">Status Dokumentasi</p>
          <p className="font-serif font-bold text-2xl text-[#183D35]">{hasDoc ? 'Terisi' : 'Kosong'}</p>
          <p className="text-sm text-[#252623]/80">Tautan tautan aktif</p>
        </div>
      </div>

      <div className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-2xl text-[#183D35]">Aksi Cepat</h3>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => onNavigateMenu('sessions')}
            className="bg-[#183D35] text-[#F2EBDD] px-6 py-3 rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
          >
            Ubah Sesi Mendatang
          </button>
          <button
            onClick={() => onNavigateMenu('proposals')}
            className="border border-[#183D35] text-[#183D35] px-6 py-3 rounded text-sm font-medium hover:bg-[#183D35]/10 transition-colors"
          >
            Lihat Usulan Topik
          </button>
        </div>
      </div>
    </div>
  );
};
