// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

import React, { useState } from 'react';
import { SessionData, VocabularyItem, ExpressionItem } from '../../types';

interface AdminSessionFormProps {
  session?: SessionData | null;
  onSave: (session: SessionData) => void;
  onCancel: () => void;
}

export const AdminSessionForm: React.FC<AdminSessionFormProps> = ({ session, onSave, onCancel }) => {
  const [number, setNumber] = useState(session?.number || 'Session 06');
  const [topik, setTopik] = useState(session?.topik || '');
  const [pertanyaanUtama, setPertanyaanUtama] = useState(session?.pertanyaanUtama || '');
  const [tanggal, setTanggal] = useState(session?.tanggal || 'Saturday, 5 December 2026');
  const [dateMode, setDateMode] = useState<'auto' | 'manual'>(session?.dateMode || 'auto');
  const [pembicara, setPembicara] = useState(session?.pembicara || '');
  const [status, setStatus] = useState<'Mendatang' | 'Arsip' | 'Draf'>(session?.status || 'Mendatang');
  const [tautanDokumentasi, setTautanDokumentasi] = useState(session?.tautanDokumentasi || '');
  const [ringkasan, setRingkasan] = useState(session?.ringkasan || '');
  const [pengantar, setPengantar] = useState(session?.pengantar || '');
  const [discussionQuestions, setDiscussionQuestions] = useState<string[]>(session?.discussionQuestions || ['', '']);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>(session?.vocabulary || []);
  const [expressions, setExpressions] = useState<ExpressionItem[]>(session?.expressions || []);
  const [sentenceStarters, setSentenceStarters] = useState<string[]>(session?.sentenceStarters || ['', '']);
  const [miniChallenge, setMiniChallenge] = useState(session?.miniChallenge || '');
  const [preparationChallenge, setPreparationChallenge] = useState(session?.preparationChallenge || '');
  const [tantanganPertanyaan, setTantanganPertanyaan] = useState(session?.tantanganPertanyaan || '');
  const [tantanganRespons, setTantanganRespons] = useState(session?.tantanganRespons || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!number.trim() || !topik.trim() || !pertanyaanUtama.trim()) {
      setError('Nomor, topik, dan pertanyaan utama wajib diisi.');
      return;
    }

    const newSession: SessionData = {
      id: session?.id || 'ses-' + Date.now(),
      number,
      topik,
      pertanyaanUtama,
      tanggal,
      dateMode,
      pembicara,
      status,
      tautanDokumentasi,
      ringkasan,
      pengantar,
      discussionQuestions: discussionQuestions.filter(q => q.trim()),
      vocabulary,
      expressions,
      sentenceStarters: sentenceStarters.filter(s => s.trim()),
      miniChallenge,
      preparationChallenge,
      tantanganPertanyaan,
      tantanganRespons,
    };

    onSave(newSession);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white border border-[#252623]/10 p-8 rounded shadow-sm">
      <div className="flex justify-between items-center border-b border-[#252623]/10 pb-4">
        <h3 className="font-serif font-bold text-2xl text-[#183D35]">
          {session ? 'Ubah Sesi' : 'Tambah Sesi'}
        </h3>
        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}
      </div>

      {/* Info Section */}
      <div className="space-y-4">
        <h4 className="font-serif font-bold text-lg text-[#183D35]">Informasi Sesi</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nomor *</label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            >
              <option value="Mendatang">Mendatang</option>
              <option value="Arsip">Arsip</option>
              <option value="Draf">Draf</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Topik *</label>
          <input
            type="text"
            value={topik}
            onChange={(e) => setTopik(e.target.value)}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pertanyaan Utama *</label>
          <textarea
            value={pertanyaanUtama}
            onChange={(e) => setPertanyaanUtama(e.target.value)}
            rows={2}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tanggal</label>
            <input
              type="text"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Pembicara (Opsional)</label>
            <input
              type="text"
              value={pembicara}
              onChange={(e) => setPembicara(e.target.value)}
              className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tautan Dokumentasi Sesi (Opsional)</label>
          <input
            type="text"
            value={tautanDokumentasi}
            onChange={(e) => setTautanDokumentasi(e.target.value)}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pengantar</label>
          <textarea
            value={pengantar}
            onChange={(e) => setPengantar(e.target.value)}
            rows={3}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Ringkasan Diskusi (Untuk Arsip)</label>
          <textarea
            value={ringkasan}
            onChange={(e) => setRingkasan(e.target.value)}
            rows={3}
            className="w-full bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
          />
        </div>
      </div>

      {/* Discussion Questions */}
      <div className="space-y-4 pt-4 border-t border-[#252623]/10">
        <div className="flex justify-between items-center">
          <h4 className="font-serif font-bold text-lg text-[#183D35]">Discussion Questions</h4>
          <button
            type="button"
            onClick={() => setDiscussionQuestions([...discussionQuestions, ''])}
            className="px-3 py-1 bg-[#183D35] text-[#F2EBDD] text-xs rounded"
          >
            Tambah Pertanyaan
          </button>
        </div>
        {discussionQuestions.map((q, idx) => (
          <div key={idx} className="flex space-x-2">
            <input
              type="text"
              value={q}
              onChange={(e) => {
                const updated = [...discussionQuestions];
                updated[idx] = e.target.value;
                setDiscussionQuestions(updated);
              }}
              className="flex-1 bg-[#F2EBDD]/50 border border-[#252623]/20 px-3 py-2 rounded text-sm focus:outline-none focus:border-[#183D35]"
            />
            <button
              type="button"
              onClick={() => setDiscussionQuestions(discussionQuestions.filter((_, i) => i !== idx))}
              className="px-3 py-2 bg-red-100 text-red-700 text-xs rounded"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>

      {/* Vocabulary */}
      <div className="space-y-4 pt-4 border-t border-[#252623]/10">
        <div className="flex justify-between items-center">
          <h4 className="font-serif font-bold text-lg text-[#183D35]">Kosakata</h4>
          <button
            type="button"
            onClick={() => setVocabulary([...vocabulary, { word: '', definition: '', indonesian: '', example: '' }])}
            className="px-3 py-1 bg-[#183D35] text-[#F2EBDD] text-xs rounded"
          >
            Tambah Kosakata
          </button>
        </div>
        {vocabulary.map((vocab, idx) => (
          <div key={idx} className="bg-[#F2EBDD]/30 p-4 rounded border border-[#252623]/10 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Kata Inggris"
                value={vocab.word}
                onChange={(e) => {
                  const updated = [...vocabulary];
                  updated[idx].word = e.target.value;
                  setVocabulary(updated);
                }}
                className="bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm"
              />
              <input
                type="text"
                placeholder="Arti Indonesia"
                value={vocab.indonesian}
                onChange={(e) => {
                  const updated = [...vocabulary];
                  updated[idx].indonesian = e.target.value;
                  setVocabulary(updated);
                }}
                className="bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm"
              />
            </div>
            <input
              type="text"
              placeholder="Definisi sederhana"
              value={vocab.definition}
              onChange={(e) => {
                const updated = [...vocabulary];
                updated[idx].definition = e.target.value;
                setVocabulary(updated);
              }}
              className="w-full bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Contoh kalimat"
                value={vocab.example}
                onChange={(e) => {
                  const updated = [...vocabulary];
                  updated[idx].example = e.target.value;
                  setVocabulary(updated);
                }}
                className="flex-1 bg-white border border-[#252623]/20 px-3 py-2 rounded text-sm"
              />
              <button
                type="button"
                onClick={() => setVocabulary(vocabulary.filter((_, i) => i !== idx))}
                className="px-3 py-2 bg-red-100 text-red-700 text-xs rounded"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-[#252623]/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-[#252623]/30 rounded text-sm hover:bg-[#252623]/5"
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-[#183D35] text-[#F2EBDD] rounded text-sm hover:bg-[#183D35]/90"
        >
          Simpan
        </button>
      </div>
    </form>
  );
};
