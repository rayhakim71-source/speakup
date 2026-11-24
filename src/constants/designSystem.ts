/**
 * // ATURAN BAKU: lihat designSystem. UI harus selalu minimalis, bersih, dan tanpa teks petunjuk.
 * 
 * PERMANENT DESIGN SYSTEM & CONSTANTS FOR "SPEAK UP!"
 * - Prinsip: minimalis, bersih, ringkas, dan jelas, tampil seperti produk jadi yang profesional.
 * - Tanpa teks panjang: dilarang paragraf instruksi, tips, teks bantuan, atau penjelasan fungsi di seluruh tampilan, formulir, dan pengaturan CMS, termasuk penjelasan teknis (Drive, Apps Script, spreadsheet, format dan batas file).
 * - Teks hanya label singkat 1-3 kata. Placeholder dikosongkan atau berisi contoh isi murni, bukan instruksi.
 * - Tombol aksi (Simpan, Hapus, Kosongkan) tegas, langsung, dan fungsional, dengan label kata kerja singkat.
 * - Setiap kolom gambar selalu punya tombol "Hapus Gambar" berikon tempat sampah di samping pratinjau; logo, banner, dan gambar popup juga bisa dihapus satu per satu.
 * - Semua kolom edit atau input teks otomatis membesar ke bawah mengikuti isinya, tanpa bilah gulir internal.
 * - Tidak ada gambar bawaan yang ditulis mati di kode atau komponen. Semua gambar berasal dari pengaturan yang bisa diganti atau dihapus dari panel; bila kosong tampilkan kerangka netral.
 * - Tidak ada tombol pengalih tema terang/gelap. Notifikasi hasil aksi tampil hanya 0,5 detik lalu hilang sendiri.
 * - Di HP: header hanya berisi logo atau nama; menu berupa sidebar tersembunyi yang dibuka tombol 120x25 berikon hamburger di tepi kiri tengah layar, tidak ikut ter-scroll, dengan layar belakang terkunci saat sidebar terbuka dan ketuk di luar untuk menutup.
 * - Dilarang pill badge, chip, atau kotak berbingkai yang menyerupai tombol tetapi tidak bisa diklik; dilarang ikon dekoratif tanpa fungsi (ikon hanya untuk kontrol interaktif fungsional); tampilan compact dan hemat ruang vertikal.
 * - Visual bersih: spasi lega, tanpa elemen dekoratif tanpa fungsi, dan tampilan HP tetap rapi, proporsional, serta tidak ada elemen tersembunyi.
 */

export const COLORS = {
  primary: '#183D35',
  cream: '#F2EBDD',
  gold: '#D6A64A',
  terracotta: '#B96549',
  charcoal: '#252623',
};

export const FONTS = {
  heading: 'Playfair Display, serif',
  body: 'DM Sans, sans-serif',
};
