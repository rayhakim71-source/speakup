// ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.

export type Role = 'public' | 'admin' | 'superadmin';

export interface VocabularyItem {
  word: string;
  definition: string;
  indonesian: string;
  example: string;
}

export interface ExpressionItem {
  expression: string;
  function?: string;
  meaningIndonesian?: string;
  example: string;
}

export interface SessionData {
  id: string;
  number: string; // e.g. "Session 05"
  topik: string;
  pertanyaanUtama: string;
  tanggal: string; // formatted date
  dateMode: 'auto' | 'manual';
  rawDate?: string;
  pembicara?: string;
  status: 'Mendatang' | 'Arsip' | 'Draf';
  tautanDokumentasi?: string;
  ringkasan?: string;
  pengantar?: string;
  discussionQuestions: string[];
  vocabulary: VocabularyItem[];
  expressions: ExpressionItem[];
  tantanganPertanyaan?: string;
  tantanganRespons?: string;
  sentenceStarters: string[];
  miniChallenge: string;
  preparationChallenge: string;
}

export interface ToolkitCategory {
  id: string;
  name: string;
  expressions: ExpressionItem[];
}

export interface ScheduleSettings {
  day: string; // e.g. "Saturday"
  timeLabel: string; // e.g. "First Break"
  timeStr: string; // e.g. ""
  location: string; // e.g. "Language Lab"
  generalDocLink: string;
  proposalFormLink: string;
  noSessionThisWeek: boolean;
  noSessionNote: string;
}

export interface TopicProposal {
  id: string;
  timestamp: string;
  namaDepan: string;
  kelas: string;
  usulanTopik: string;
  pertanyaanUtama: string;
  diskusi1: string;
  diskusi2: string;
  diskusi3: string;
  status: 'Baru' | 'Disetujui' | 'Ditolak';
}

export interface CmsSettings {
  programName: string;
  slogan: string;
  heroTopLabel: string;
  logoSource: 'drive' | 'tautan';
  logoValue: string;
  heroImageSource: 'drive' | 'tautan';
  heroImageValue: string;
  faviconValue: string;
  pageTitle: string;
  pageDescription: string;
  primaryColor: string;
  creamColor: string;
  goldColor: string;
  terracottaColor: string;
  charcoalColor: string;
  menuItems: { label: string; href: string; visible: boolean }[];
  buttons: { name: string; label: string; href: string; visible: boolean }[];
  sections: { id: string; title: string; subtitle: string; visible: boolean }[];
  features: { printEnabled: boolean; archiveSearchEnabled: boolean; toolkitSearchEnabled: boolean; nextSessionEnabled: boolean };
  footer: { address: string; whatsapp: string; instagram: string; scheduleText: string; copyright: string };
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  role: string;
  action: string;
  details: string;
}

export interface SyncSettings {
  webAppUrl: string;
  token: string;
  driveFolderId: string;
  spreadsheetId: string;
  proposalsSheetName: string;
  lastSyncTime?: string;
  connectionStatus: 'idle' | 'connected' | 'failed';
}
