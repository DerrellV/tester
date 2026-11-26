import { CollectionType, LibraryItem, ReadingStatus } from '../types/library';

export const COLLECTION_META: Record<
  CollectionType,
  {
    label: string;
    shortDesc: string;
    accentText: string;
    coverTone: string;
  }
> = {
  skripsi: {
    label: 'Skripsi',
    shortDesc: 'Karya ilmiah sarjana (S1) beserta NIM, prodi, dan pembimbing.',
    accentText: 'text-indigo-700',
    coverTone: 'bg-indigo-950 text-indigo-50',
  },
  tugas_akhir: {
    label: 'Tugas Akhir',
    shortDesc: 'Laporan proyek akhir atau diploma (D3/D4) dan dokumentasi karya.',
    accentText: 'text-teal-700',
    coverTone: 'bg-teal-950 text-teal-50',
  },
  buku_bacaan: {
    label: 'Buku Bacaan',
    shortDesc: 'Buku referensi kuliah, literatur riset, atau bacaan umum.',
    accentText: 'text-amber-800',
    coverTone: 'bg-stone-900 text-stone-50',
  },
};

export const READING_STATUS_LABEL: Record<ReadingStatus, string> = {
  belum_dibaca: 'Belum Dibaca',
  sedang_dibaca: 'Sedang Dibaca',
  selesai: 'Selesai Dibaca',
};

export const SEED_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'skripsi-1',
    type: 'skripsi',
    title: 'Perancangan Sistem Rekomendasi Literatur Akademik Menggunakan Metode Content-Based Filtering',
    author: 'Nadia Kusuma Wardani',
    year: 2025,
    studentId: '21051204042',
    programStudy: 'Teknik Informatika',
    faculty: 'Fakultas Teknik',
    advisor: 'Dr. Hendra Wijaya, M.Kom.',
    abstractOrSummary:
      'Penelitian ini merancang mesin rekomendasi pustaka akademik berbasis kemiripan kosinus TF-IDF pada abstrak skripsi mahasiswa. Pengujian terhadap 450 dokumen menunjukkan peningkatan relevansi pencarian sebesar 34% dibandingkan pencarian kata kunci standar.',
    keywords: ['Sistem Rekomendasi', 'TF-IDF', 'Pustaka Digital', 'Pencarian Semantik'],
    isFavorite: true,
    createdAt: '2026-10-12T08:30:00.000Z',
    updatedAt: '2026-10-12T08:30:00.000Z',
    personalNotes: 'Bab 3 bagian pembobotan TF-IDF sangat jelas untuk dijadikan acuan metodologi.',
    attachment: {
      name: 'Skripsi_Nadia_Kusuma_2025.pdf',
      url: 'https://scholar.google.com',
      isLocalFile: false,
    },
  },
  {
    id: 'skripsi-2',
    type: 'skripsi',
    title: 'Analisis Pengalaman Pengguna pada Portal Layanan Akademik Mahasiswa dengan Pendekatan User-Centered Design',
    author: 'Bagus Pratama Putra',
    year: 2024,
    studentId: '20051214019',
    programStudy: 'Sistem Informasi',
    faculty: 'Fakultas Ilmu Komputer',
    advisor: 'Rina Marlina, S.Kom., M.T.',
    abstractOrSummary:
      'Studi evaluasi kegunaan (usability testing) dilakukan kepada 32 mahasiswa untuk memetakan kendala navigasi pengisian KRS dan pelacakan status tugas akhir. Iterasi prototipe berhasil meningkatkan skor SUS dari 58 menjadi 84.',
    keywords: ['User-Centered Design', 'SUS', 'Usability Testing', 'Portal Akademik'],
    isFavorite: false,
    createdAt: '2026-09-20T10:15:00.000Z',
    updatedAt: '2026-09-20T10:15:00.000Z',
    personalNotes: 'Referensi bagus untuk menyusun kuesioner System Usability Scale.',
  },
  {
    id: 'ta-1',
    type: 'tugas_akhir',
    title: 'Rancang Bangun Aplikasi Pencatatan Inventaris Laboratorium Berbasis QR Code dan Web Responsif',
    author: 'Dimas Aditya Saputra',
    year: 2025,
    studentId: '2203015011',
    programStudy: 'D3 Manajemen Informatika',
    faculty: 'Sekolah Vokasi',
    advisor: 'Ir. Bambang Setiawan, M.T.',
    abstractOrSummary:
      'Proyek akhir ini menghasilkan sistem pelacakan peminjaman alat laboratorium dengan pemindaian QR Code langsung dari peramban ponsel tanpa aplikasi tambahan, lengkap dengan log pemeliharaan berkala.',
    keywords: ['QR Code', 'Inventaris Lab', 'Aplikasi Web', 'Vokasi'],
    isFavorite: true,
    createdAt: '2026-10-05T14:20:00.000Z',
    updatedAt: '2026-10-05T14:20:00.000Z',
    personalNotes: 'Arsitektur tabel peminjaman alat rapi dan mudah diadaptasi.',
  },
  {
    id: 'ta-2',
    type: 'tugas_akhir',
    title: 'Implementasi Sistem Monitoring Suhu dan Kelembapan Ruang Arsip Perpustakaan Berbasis IoT',
    author: 'Siti Nurhaliza',
    year: 2024,
    studentId: '2104021008',
    programStudy: 'D4 Teknologi Rekayasa Elektronika',
    faculty: 'Politeknik Negeri',
    advisor: 'Dr. Agus Santoso, S.T., M.Eng.',
    abstractOrSummary:
      'Perangkat sensor DHT22 terhubung dengan mikrokontroler ESP32 untuk memantau kondisi ruang penyimpanan naskah fisik agar terhindar dari jamur dan kerusakan kertas akibat kelembapan tinggi.',
    keywords: ['IoT', 'ESP32', 'Preservasi Arsip', 'Sensor Suhu'],
    isFavorite: false,
    createdAt: '2026-08-18T09:00:00.000Z',
    updatedAt: '2026-08-18T09:00:00.000Z',
  },
  {
    id: 'buku-1',
    type: 'buku_bacaan',
    title: 'The Design of Everyday Things (Edisi Revisi)',
    author: 'Don Norman',
    year: 2013,
    publisher: 'Basic Books',
    isbn: '978-0465050659',
    pages: 368,
    readingStatus: 'sedang_dibaca',
    categoryTopic: 'Desain Interaksi & UX',
    coverUrl: '/src/assets/images/cover_design_ux_1795675672466.jpg',
    abstractOrSummary:
      'Buku klasik tentang psikologi interaksi manusia dengan benda dan antarmuka digital. Menjelaskan konsep mendasar seperti affordance, signifiers, mapping, dan feedback agar sistem mudah dipahami pengguna.',
    keywords: ['Desain UX', 'Psikologi Kognitif', 'Affordance', 'Interaksi Manusia-Komputer'],
    isFavorite: true,
    createdAt: '2026-11-01T11:00:00.000Z',
    updatedAt: '2026-11-01T11:00:00.000Z',
    personalNotes: 'Bab 2 tentang Seven Stages of Action wajib dikutip pada tinjauan pustaka UX.',
  },
  {
    id: 'buku-2',
    type: 'buku_bacaan',
    title: 'Metode Penelitian Kuantitatif, Kualitatif, dan R&D',
    author: 'Prof. Dr. Sugiyono',
    year: 2022,
    publisher: 'Alfabeta Bandung',
    isbn: '978-6022895336',
    pages: 444,
    readingStatus: 'selesai',
    categoryTopic: 'Metodologi Riset',
    coverUrl: '/src/assets/images/cover_research_methods_1795675674017.jpg',
    abstractOrSummary:
      'Panduan komprehensif penyusunan proposal penelitian, penentuan populasi dan sampel, penyusunan instrumen kuesioner, hingga analisis data untuk mahasiswa penyusun skripsi dan tugas akhir.',
    keywords: ['Metodologi', 'Statistik Penelitian', 'R&D', 'Skripsi'],
    isFavorite: true,
    createdAt: '2026-10-28T16:40:00.000Z',
    updatedAt: '2026-10-28T16:40:00.000Z',
    personalNotes: 'Rumus penentuan ukuran sampel Slovin dan tabel Krejcie-Morgan ada di halaman 126.',
  },
  {
    id: 'buku-3',
    type: 'buku_bacaan',
    title: 'Clean Architecture: Panduan Merancang Struktur Perangkat Lunak',
    author: 'Robert C. Martin',
    year: 2018,
    publisher: 'Prentice Hall',
    isbn: '978-0134494166',
    pages: 432,
    readingStatus: 'belum_dibaca',
    categoryTopic: 'Rekayasa Perangkat Lunak',
    coverUrl: '/src/assets/images/cover_software_arch_1795675673031.jpg',
    abstractOrSummary:
      'Membahas prinsip pemisahan tanggung jawab (separation of concerns), prinsip SOLID, dan arsitektur berlapis agar kode proyek tugas akhir maupun aplikasi produksi tetap terawat dalam jangka panjang.',
    keywords: ['Arsitektur Kode', 'SOLID', 'Software Engineering'],
    isFavorite: false,
    createdAt: '2026-11-10T07:45:00.000Z',
    updatedAt: '2026-11-10T07:45:00.000Z',
  },
];

export const STORAGE_KEY = 'pustaka_karya_items_v1';

export function loadLibraryItems(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LIBRARY_ITEMS));
      return SEED_LIBRARY_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return SEED_LIBRARY_ITEMS;
  } catch {
    return SEED_LIBRARY_ITEMS;
  }
}

export function saveLibraryItems(items: LibraryItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function formatApaCitation(item: LibraryItem): string {
  const author = item.author.trim() || 'Penulis Tidak Diketahui';
  const year = item.year || new Date().getFullYear();
  const title = item.title.trim();

  if (item.type === 'buku_bacaan') {
    const pub = item.publisher ? ` ${item.publisher}.` : '';
    return `${author} (${year}). ${title}.${pub}`;
  }

  const jenis = item.type === 'skripsi' ? 'Skripsi' : 'Tugas Akhir';
  const inst = [item.programStudy, item.faculty].filter(Boolean).join(', ');
  const instPart = inst ? ` ${inst}.` : '';
  return `${author} (${year}). ${title} [${jenis}${instPart ? `,${instPart.slice(0, -1)}` : ''}].`;
}
