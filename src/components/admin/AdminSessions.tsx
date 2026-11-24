// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState, useEffect } from 'react';
import { SessionData } from '../../types';
import { AdminSessionForm } from './AdminSessionForm';

interface AdminSessionsProps {
  sessions: SessionData[];
  initialEditSessionId?: string | null;
  onClearInitialEdit?: () => void;
  onSaveSession: (session: SessionData) => void;
  onDeleteSession: (id: string) => void;
  onToggleStatus: (id: string) => void;
  showToast: (msg: string) => void;
}

export const AdminSessions: React.FC<AdminSessionsProps> = ({
  sessions,
  initialEditSessionId,
  onClearInitialEdit,
  onSaveSession,
  onDeleteSession,
  onToggleStatus,
  showToast,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Mendatang' | 'Arsip' | 'Draf'>('All');

  useEffect(() => {
    if (initialEditSessionId) {
      const target = sessions.find((s) => s.id === initialEditSessionId);
      if (target) {
        setCurrentSession(target);
        setIsEditing(true);
      }
      onClearInitialEdit?.();
    }
  }, [initialEditSessionId, sessions, onClearInitialEdit]);

  const filtered = sessions
    .filter((s) => statusFilter === 'All' || s.status === statusFilter)
    .filter((s) => s.topik.toLowerCase().includes(searchQuery.toLowerCase()) || s.number.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleEdit = (session: SessionData) => {
    setCurrentSession(session);
    setIsEditing(true);
  };

  const handleAdd = () => {
    setCurrentSession(null);
    setIsEditing(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-[#B96549] mb-2">Manajemen</p>
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#183D35]">Sesi</h2>
        </div>
        {!isEditing && (
          <button
            onClick={handleAdd}
            className="bg-[#183D35] text-[#F2EBDD] px-5 py-2.5 min-h-[44px] rounded text-sm font-medium hover:bg-[#183D35]/90 transition-colors"
          >
            Tambah Sesi
          </button>
        )}
      </div>

      {isEditing ? (
        <AdminSessionForm
          session={currentSession}
          onSave={(ses) => {
            onSaveSession(ses);
            setIsEditing(false);
            showToast('Berhasil disimpan');
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari sesi..."
              className="flex-1 bg-white border border-[#252623]/20 px-4 py-2.5 min-h-[48px] rounded text-sm focus:outline-none focus:border-[#183D35]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white border border-[#252623]/20 px-4 py-2.5 min-h-[48px] rounded text-sm focus:outline-none focus:border-[#183D35]"
            >
              <option value="All">Semua Status</option>
              <option value="Mendatang">Mendatang</option>
              <option value="Arsip">Arsip</option>
              <option value="Draf">Draf</option>
            </select>
          </div>

          <div className="bg-white border border-[#252623]/10 rounded shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F2EBDD]/60 border-b border-[#252623]/10 text-xs uppercase tracking-wider text-[#183D35]">
                    <th className="p-4">Nomor</th>
                    <th className="p-4">Topik</th>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252623]/10 text-sm">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-[#252623]/60 italic">
                        Belum ada data
                      </td>
                    </tr>
                  ) : (
                    filtered.map((session) => (
                      <tr key={session.id} className="hover:bg-[#F2EBDD]/30 transition-colors">
                        <td className="p-4 font-serif font-bold text-[#B96549]">{session.number}</td>
                        <td className="p-4 font-medium text-[#183D35]">{session.topik}</td>
                        <td className="p-4 text-[#252623]/80">{session.tanggal}</td>
                        <td className="p-4">
                          <span
                            className={`text-xs font-semibold ${
                              session.status === 'Mendatang'
                                ? 'text-[#183D35]'
                                : session.status === 'Draf'
                                ? 'text-[#B96549]'
                                : 'text-[#252623]/60'
                            }`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => onToggleStatus(session.id)}
                            className="px-3 py-1 bg-white border border-[#252623]/30 rounded text-xs hover:bg-[#252623]/5"
                          >
                            {session.status === 'Mendatang' ? 'Arsipkan' : 'Jadikan Mendatang'}
                          </button>
                          <button
                            onClick={() => handleEdit(session)}
                            className="px-3 py-1 bg-[#183D35] text-[#F2EBDD] rounded text-xs hover:bg-[#183D35]/90"
                          >
                            Ubah
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Hapus sesi ini?')) {
                                onDeleteSession(session.id);
                                showToast('Berhasil dihapus');
                              }
                            }}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
