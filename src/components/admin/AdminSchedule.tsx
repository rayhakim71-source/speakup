// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { ScheduleSettings } from '../../types';

interface AdminScheduleProps {
  schedule: ScheduleSettings;
  onSaveSchedule: (schedule: ScheduleSettings) => void;
  showToast: (msg: string) => void;
}

export const AdminSchedule: React.FC<AdminScheduleProps> = ({ schedule, onSaveSchedule, showToast }) => {
  const [form, setForm] = useState<ScheduleSettings>(schedule);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSchedule(form);
    showToast('Berhasil disimpan');
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Pengaturan</p>
        <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Jadwal & Dokumentasi</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-[#252623]/10 p-8 rounded shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Hari Kegiatan</label>
            <input
              type="text"
              value={form.day}
              onChange={(e) => setForm({ ...form, day: e.target.value })}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Label Waktu</label>
            <input
              type="text"
              value={form.timeLabel}
              onChange={(e) => setForm({ ...form, timeLabel: e.target.value })}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Jam (Opsional)</label>
            <input
              type="text"
              value={form.timeStr}
              onChange={(e) => setForm({ ...form, timeStr: e.target.value })}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tempat</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tautan Dokumentasi Umum (Google Drive / Photos / Instagram)</label>
          <input
            type="text"
            value={form.generalDocLink}
            onChange={(e) => setForm({ ...form, generalDocLink: e.target.value })}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tautan Formulir Usulan</label>
          <input
            type="text"
            value={form.proposalFormLink || ''}
            onChange={(e) => setForm({ ...form, proposalFormLink: e.target.value })}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
          />
        </div>

        <div className="pt-4 border-t border-[#252623]/10 space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="noSession"
              checked={form.noSessionThisWeek}
              onChange={(e) => setForm({ ...form, noSessionThisWeek: e.target.checked })}
              className="w-4 h-4 text-[#183D35] focus:ring-[#183D35] border-gray-300 rounded"
            />
            <label htmlFor="noSession" className="text-sm font-medium text-[#183D35]">Tidak Ada Sesi Minggu Ini</label>
          </div>

          {form.noSessionThisWeek && (
            <div>
              <label className="block text-sm font-medium mb-1">Catatan</label>
              <input
                type="text"
                value={form.noSessionNote}
                onChange={(e) => setForm({ ...form, noSessionNote: e.target.value })}
                className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#183D35] text-[#F2EBDD] rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
          >
            Simpan
          </button>
        </div>
      </form>
    </div>
  );
};
