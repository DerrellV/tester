import { CollectionType, LibraryItem, ReadingStatus } from '../types/library';

export const COLLECTION_META: Record<
  CollectionType,
  {
    label: string;
    shortDesc: string;
    accentClass: string;
    coverTone: string;
  }
> = {
  skripsi: {
    label: 'Skripsi',
    shortDesc: 'Karya tulis ilmiah sarjana (S1) lengkap dengan abstrak dan pembimbing.',
    accentClass: 'text-[#1E3A8A] dark:text-[#93C5FD]',
    coverTone: 'bg-[#1E293B] text-slate-100',
  },
  tugas_akhir: {
    label: 'Tugas Akhir',
    shortDesc: 'Laporan proyek terapan, rancang bangun, dan karya vokasi (D3/D4).',
    accentClass: 'text-[#14532D] dark:text-[#86EFAC]',
    coverTone: 'bg-[#14452F] text-emerald-50',
  },
  buku_bacaan: {
    label: 'Buku Bacaan',
    shortDesc: 'Literatur rujukan, buku ajar, dan bacaan umum untuk semua pengunjung.',
    accentClass: 'text-[#9A3412] dark:text-[#FDBA74]',
    coverTone: 'bg-[#292524] text-stone-100',
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
    callNumber: 'SKR-TI-2025-042',
    language: 'Bahasa Indonesia',
    studentId: '21051204042',
    programStudy: 'Teknik Informatika',
    faculty: 'Fakultas Teknik',
    advisor: 'Dr. Hendra Wijaya, M.Kom.',
    isFeatured: true,
    abstractOrSummary:
      'Penelitian ini merancang mesin rekomendasi pustaka akademik berbasis kemiripan kosinus TF-IDF pada abstrak skripsi mahasiswa. Pengujian terhadap 450 dokumen menunjukkan peningkatan relevansi pencarian sebesar 34% dibandingkan pencarian kata kunci standar.',
    tableOfContents: [
      'Bab I — Latar Belakang Masalah Pencarian Literatur Kampus',
      'Bab II — Landasan Teori TF-IDF & Cosine Similarity',
      'Bab III — Arsitektur Indeksasi Dokumen & Pra-pemrosesan Teks',
      'Bab IV — Evaluasi Precision@10 dan Pengujian Kegunaan Pengunjung',
      'Bab V — Kesimpulan & Rekomendasi Pengembangan Lanjutan',
    ],
    readingExcerpt:
      'Setiap semester, ribuan mahasiswa dan peneliti pemula menghabiskan waktu berjam-jam menelusuri katalog repositori demi menemukan rujukan yang sesuai dengan topik kajian mereka. Pencarian berbasis pencocokan kata persis kerap gagal menangkap kedekatan makna ketika istilah yang digunakan berbeda namun merujuk pada domain pengetahuan yang sama.\n\nMelalui pendekatan Content-Based Filtering, sistem mengekstrak bobot istilah kunci dari judul, kata kunci, serta abstrak karya ilmiah secara otomatis. Setiap dokumen direpresentasikan sebagai vektor berdimensi istilah yang kemudian diukur sudut kemiripannya menggunakan Cosine Similarity.\n\nHasil uji coba pada kelompok mahasiswa tingkat akhir menunjukkan bahwa daftar bacaan terkait membantu mempercepat tahap tinjauan pustaka secara signifikan, terutama bagi pengunjung baru yang belum familier dengan terminologi teknis di bidang riset tertentu.',
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
    title: 'Analisis Pengalaman Pengguna pada Portal Layanan Akademik dengan Pendekatan User-Centered Design',
    author: 'Bagus Pratama Putra',
    year: 2024,
    callNumber: 'SKR-SI-2024-019',
    language: 'Bahasa Indonesia',
    studentId: '20051214019',
    programStudy: 'Sistem Informasi',
    faculty: 'Fakultas Ilmu Komputer',
    advisor: 'Rina Marlina, S.Kom., M.T.',
    abstractOrSummary:
      'Studi evaluasi kegunaan (usability testing) dilakukan kepada 32 mahasiswa dan pengunjung umum untuk memetakan kendala navigasi portal akademik. Iterasi prototipe berhasil meningkatkan skor System Usability Scale (SUS) dari 58 menjadi 84.',
    tableOfContents: [
      'Bab I — Identifikasi Kendala Akses Layanan Informasi Akademik',
      'Bab II — Prinsip User-Centered Design & Standar Aksesibilitas WCAG',
      'Bab III — Pemetaan Alur Pengguna dan Pengujian Prototipe',
      'Bab IV — Analisis Skor System Usability Scale Sebelum & Sesudah Perbaikan',
    ],
    readingExcerpt:
      'Antarmuka layanan informasi publik tidak boleh hanya dirancang untuk pengguna yang terbiasa dengan istilah teknis sistem. Pengunjung perpustakaan maupun portal kampus berasal dari latar belakang usia, perangkat, dan tingkat literasi digital yang beragam.\n\nDalam penelitian ini, pengujian tugas langsung dilakukan bersama responden dari beragam jurusan. Temuan utama memperlihatkan bahwa istilah menu yang ambigu, ukuran huruf terlalu kecil, serta langkah pencarian yang tersembunyi menjadi sumber kebingungan terbesar.\n\nSetelah menyederhanakan alur pencarian menjadi satu kolom utama dengan filter bahasa sehari-hari, tingkat keberhasilan tugas meningkat dari 64% menjadi 96% pada pengujian putaran kedua.',
    keywords: ['User-Centered Design', 'Aksesibilitas', 'Usability Testing', 'SUS'],
    isFavorite: false,
    createdAt: '2026-09-20T10:15:00.000Z',
    updatedAt: '2026-09-20T10:15:00.000Z',
    personalNotes: 'Referensi bagus untuk menyusun kuesioner System Usability Scale.',
  },
  {
    id: 'skripsi-3',
    type: 'skripsi',
    title: 'Pemanfaatan Arsitektur Kayu Tropis dalam Ruang Baca Publik Berkelanjutan di Iklim Lembap',
    author: 'Sekar Ayu Larasati',
    year: 2025,
    callNumber: 'SKR-AR-2025-011',
    language: 'Bahasa Indonesia',
    studentId: '21030411027',
    programStudy: 'Arsitektur',
    faculty: 'Fakultas Teknik Sipil & Perencanaan',
    advisor: 'Prof. Ir. Bambang Nurhadi, M.Arch.',
    coverUrl: '/src/assets/images/cover_arsitektur_nusantara_1795676923820.jpg',
    abstractOrSummary:
      'Kajian perancangan ruang baca perpustakaan daerah yang mengutamakan ventilasi silang alami, pencahayaan siang hari merata tanpa silau, serta struktur kayu lokal bersertifikat untuk kenyamanan termal pengunjung.',
    tableOfContents: [
      'Bab I — Kebutuhan Ruang Publik Literasi di Kota Tropis',
      'Bab II — Tipologi Struktur Kayu Nusantara & Kenyamanan Termal',
      'Bab III — Simulasi Pencahayaan Alami dan Akustik Ruang Baca',
      'Bab IV — Rancangan Detail Bangunan & Evaluasi Kenyamanan Pengunjung',
    ],
    readingExcerpt:
      'Perpustakaan yang ramah bukan hanya soal kelengkapan koleksi buku, melainkan juga kualitas ruang yang mengundang siapa saja untuk betah membaca berjam-jam. Di wilayah beriklim tropis lembap, ketergantungan penuh pada pendingin udara sering membuat biaya operasional membengkak.\n\nDengan mengadaptasi kemiringan atap lebar dan bukaan kisi-kisi kayu terukur, cahaya matahari pagi dapat masuk menerangi meja baca tanpa menimbulkan panas berlebih maupun pantulan silau pada halaman buku dan layar komputer.',
    keywords: ['Arsitektur Tropis', 'Ruang Baca Publik', 'Struktur Kayu', 'Pencahayaan Alami'],
    isFavorite: false,
    createdAt: '2026-10-19T09:10:00.000Z',
    updatedAt: '2026-10-19T09:10:00.000Z',
  },
  {
    id: 'skripsi-4',
    type: 'skripsi',
    title: 'Pengaruh Literasi Keuangan Digital terhadap Keputusan Investasi Generasi Muda di Wilayah Urban',
    author: 'Rizky Ramadhan Hakim',
    year: 2023,
    callNumber: 'SKR-MN-2023-088',
    language: 'Bahasa Indonesia',
    studentId: '19081020088',
    programStudy: 'Manajemen Keuangan',
    faculty: 'Fakultas Ekonomi & Bisnis',
    advisor: 'Dr. Dewi Kartika Sari, S.E., M.Si.',
    abstractOrSummary:
      'Penelitian kuantitatif terhadap 240 responden berusia 18–27 tahun untuk mengukur hubungan pemahaman risiko produk keuangan digital, perencanaan anggaran pribadi, dan ketahanan terhadap penipuan daring.',
    tableOfContents: [
      'Bab I — Fenomena Inklusi Keuangan Digital di Kalangan Mahasiswa',
      'Bab II — Teori Perilaku Keuangan & Literasi Finansial',
      'Bab III — Metode Survei & Analisis Regresi Berganda',
      'Bab IV — Pembahasan Temuan & Implikasi Edukasi Publik',
    ],
    readingExcerpt:
      'Kemudahan membuka rekening investasi hanya melalui ponsel pintar membuka partisipasi ekonomi yang luas, tetapi sekaligus membawa tantangan baru berupa keputusan impulsif akibat paparan tren media sosial.\n\nData survei menunjukkan bahwa responden yang terbiasa membaca ringkasan prospektus dan membandingkan profil risiko memiliki tingkat konsistensi menabung jangka panjang 2,3 kali lebih baik dibandingkan kelompok yang mengandalkan rekomendasi singkat tanpa verifikasi.',
    keywords: ['Literasi Keuangan', 'Ekonomi Digital', 'Perilaku Investasi', 'Edukasi Publik'],
    isFavorite: false,
    createdAt: '2026-07-14T11:20:00.000Z',
    updatedAt: '2026-07-14T11:20:00.000Z',
  },
  {
    id: 'ta-1',
    type: 'tugas_akhir',
    title: 'Rancang Bangun Aplikasi Pencatatan Inventaris Laboratorium Berbasis QR Code dan Web Responsif',
    author: 'Dimas Aditya Saputra',
    year: 2025,
    callNumber: 'TA-MI-2025-011',
    language: 'Bahasa Indonesia',
    studentId: '2203015011',
    programStudy: 'D3 Manajemen Informatika',
    faculty: 'Sekolah Vokasi',
    advisor: 'Ir. Bambang Setiawan, M.T.',
    isFeatured: true,
    abstractOrSummary:
      'Proyek akhir ini menghasilkan sistem pelacakan peminjaman alat laboratorium dengan pemindaian QR Code langsung dari peramban ponsel tanpa aplikasi tambahan, lengkap dengan log pemeliharaan berkala.',
    tableOfContents: [
      'Bab I — Masalah Pencatatan Manual di Laboratorium Kampus',
      'Bab II — Perancangan Basis Data Peminjaman & Pelabelan QR Code',
      'Bab III — Implementasi Antarmuka Responsif untuk Petugas & Mahasiswa',
      'Bab IV — Uji Coba Lapangan & Manual Penggunaan Singkat',
    ],
    readingExcerpt:
      'Proses peminjaman peralatan praktik di laboratorium vokasi sering terhambat oleh antrean buku log kertas dan ketidaksesuaian catatan kondisi alat saat dikembalikan. Dengan menempelkan stiker QR Code tahan air pada setiap perangkat, petugas cukup memindai kode menggunakan kamera peramban ponsel.\n\nDalam waktu kurang dari lima detik, riwayat kalibrasi, status ketersediaan, serta jadwal pengembalian langsung tercatat rapi dan dapat diaudit oleh kepala laboratorium kapan saja.',
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
    callNumber: 'TA-EL-2024-008',
    language: 'Bahasa Indonesia',
    studentId: '2104021008',
    programStudy: 'D4 Teknologi Rekayasa Elektronika',
    faculty: 'Politeknik Negeri',
    advisor: 'Dr. Agus Santoso, S.T., M.Eng.',
    abstractOrSummary:
      'Perangkat sensor DHT22 terhubung dengan mikrokontroler ESP32 untuk memantau kondisi ruang penyimpanan naskah fisik agar terhindar dari jamur dan kerusakan kertas akibat kelembapan tinggi.',
    tableOfContents: [
      'Bab I — Urgensi Preservasi Naskah Skripsi dan Buku Cetak Langka',
      'Bab II — Kalibrasi Sensor Suhu & Kelembapan DHT22 pada ESP32',
      'Bab III — Perancangan Peringatan Dini untuk Pustakawan',
      'Bab IV — Pengujian Akurasi 30 Hari di Ruang Arsip',
    ],
    readingExcerpt:
      'Naskah cetak tua dan arsip tugas akhir fisik sangat rentan mengalami pelapukan kertas apabila kelembapan relatif ruangan melampaui 65% secara terus-menerus. Selama ini, pemeriksaan ruang arsip dilakukan secara berkala hanya satu kali sehari.\n\nPerangkat pemantau berbasis ESP32 mencatat pembacaan suhu dan kelembapan setiap sepuluh menit serta mengirimkan notifikasi otomatis apabila kondisi melampaui ambang batas aman, sehingga tindakan pengaturan dehumidifier dapat segera dilakukan.',
    keywords: ['IoT', 'ESP32', 'Preservasi Arsip', 'Sensor Suhu'],
    isFavorite: false,
    createdAt: '2026-08-18T09:00:00.000Z',
    updatedAt: '2026-08-18T09:00:00.000Z',
  },
  {
    id: 'ta-3',
    type: 'tugas_akhir',
    title: 'Perancangan Panduan Visual Wayfinding Inklusif untuk Perpustakaan Umum Kota',
    author: 'Mutiara Putri Anggraini',
    year: 2025,
    callNumber: 'TA-DKV-2025-023',
    language: 'Bahasa Indonesia',
    studentId: '2202091023',
    programStudy: 'D4 Desain Komunikasi Visual',
    faculty: 'Fakultas Seni Rupa & Desain',
    advisor: 'Laras Widyawati, M.Ds.',
    abstractOrSummary:
      'Karya proyek akhir merancang sistem penanda arah ruang baca, rak koleksi, dan fasilitas disabilitas dengan tipografi kontras tinggi, piktogram universal, serta panduan audio QR untuk pengunjung tunanetra.',
    tableOfContents: [
      'Bab I — Observasi Orientasi Pengunjung Baru di Gedung Perpustakaan',
      'Bab II — Prinsip Desain Universal & Kontras Tipografi Ruang Publik',
      'Bab III — Sistem Piktogram, Warna Lantai, dan Penanda Braille',
      'Bab IV — Implementasi Maket & Uji Keterbacaan Pengunjung Lintas Usia',
    ],
    readingExcerpt:
      'Sebagian besar pengunjung baru merasa sungkan bertanya kepada petugas ketika kesulitan mencari rak skripsi atau ruang baca tenang. Penanda arah yang menggunakan kode klasifikasi kaku sering kali tidak dipahami oleh masyarakat umum.\n\nDengan memadukan penamaan zona yang lugas, ukuran huruf berjarak baca minimal empat meter, dan piktogram sederhana berstandar internasional, waktu tempuh pengunjung menuju rak tujuan berkurang hampir separuhnya.',
    keywords: ['Wayfinding', 'Desain Inklusif', 'Aksesibilitas Ruang', 'Tipografi'],
    isFavorite: false,
    createdAt: '2026-10-22T13:15:00.000Z',
    updatedAt: '2026-10-22T13:15:00.000Z',
  },
  {
    id: 'ta-4',
    type: 'tugas_akhir',
    title: 'Pengembangan Modul Katalogisasi Otomatis Berbasis ISBN dan Ekstraksi Metadata PDF',
    author: 'Fajar Nugroho',
    year: 2023,
    callNumber: 'TA-TI-2023-031',
    language: 'Bahasa Indonesia',
    studentId: '2001053031',
    programStudy: 'D3 Teknik Komputer',
    faculty: 'Fakultas Vokasi',
    advisor: 'Yusuf Maulana, M.Kom.',
    abstractOrSummary:
      'Alat bantu pustakawan untuk membaca nomor ISBN atau halaman sampul dokumen PDF guna mengisi data judul, penulis, tahun, dan penerbit secara otomatis tanpa pengetikan ulang manual.',
    tableOfContents: [
      'Bab I — Efisiensi Input Koleksi Baru di Perpustakaan Daerah',
      'Bab II — Parsing Metadata Dokumen PDF & Kueri Layanan ISBN',
      'Bab III — Antarmuka Verifikasi Satu Langkah bagi Pustakawan',
    ],
    readingExcerpt:
      'Memasukkan ratusan judul buku dan laporan tugas akhir secara manual rawan menimbulkan kesalahan penulisan nama penulis maupun angka tahun terbit. Modul katalogisasi ini mempercepat proses verifikasi awal agar koleksi terbaru lebih cepat tampil bagi pembaca.',
    keywords: ['Katalogisasi', 'ISBN', 'Ekstraksi PDF', 'Otomasi Pustaka'],
    isFavorite: false,
    createdAt: '2026-06-11T15:00:00.000Z',
    updatedAt: '2026-06-11T15:00:00.000Z',
  },
  {
    id: 'buku-1',
    type: 'buku_bacaan',
    title: 'The Design of Everyday Things (Edisi Revisi)',
    author: 'Don Norman',
    year: 2013,
    callNumber: '005.4 NOR d',
    language: 'English / Terjemahan',
    publisher: 'Basic Books',
    isbn: '978-0465050659',
    pages: 368,
    readingStatus: 'sedang_dibaca',
    categoryTopic: 'Desain Interaksi & UX',
    coverUrl: '/src/assets/images/cover_design_ux_1795675672466.jpg',
    isFeatured: true,
    abstractOrSummary:
      'Buku klasik tentang psikologi interaksi manusia dengan benda sehari-hari dan antarmuka digital. Menjelaskan konsep affordance, signifiers, mapping, dan feedback agar sistem mudah dipahami siapa saja tanpa instruksi rumit.',
    tableOfContents: [
      'Chapter 1 — The Psychopathology of Everyday Things',
      'Chapter 2 — The Psychology of Everyday Actions',
      'Chapter 3 — Knowledge in the Head and in the World',
      'Chapter 4 — Knowing What to Do: Constraints & Discoverability',
      'Chapter 5 — Human Error? No, Bad Design',
    ],
    readingExcerpt:
      'Dua karakteristik terpenting dari desain yang baik adalah keterlihatan (discoverability) dan pemahaman (understanding). Pengunjung tidak seharusnya menebak-nebak apakah sebuah pintu harus didorong atau ditarik, begitu pula saat menggunakan situs web atau katalog digital.\n\nKetika pengguna melakukan kesalahan saat mengoperasikan suatu sistem, hampir selalu sumber masalahnya bukan pada ketidaktelitian manusia, melainkan rancangan antarmuka yang gagal memberikan petunjuk visual yang jujur dan umpan balik yang jelas.',
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
    callNumber: '001.4 SUG m',
    language: 'Bahasa Indonesia',
    publisher: 'Alfabeta Bandung',
    isbn: '978-6022895336',
    pages: 444,
    readingStatus: 'selesai',
    categoryTopic: 'Metodologi Riset',
    coverUrl: '/src/assets/images/cover_research_methods_1795675674017.jpg',
    abstractOrSummary:
      'Panduan komprehensif penyusunan proposal penelitian, penentuan populasi dan sampel, penyusunan instrumen kuesioner, hingga teknik analisis data bagi mahasiswa penyusun skripsi dan tugas akhir.',
    tableOfContents: [
      'Bagian I — Perspektif Metode Penelitian Pendidikan & Sosial',
      'Bagian II — Metode Penelitian Kuantitatif & Statistik Deskriptif',
      'Bagian III — Metode Kualitatif, Wawancara & Triangulasi Data',
      'Bagian IV — Metode Penelitian dan Pengembangan (R&D)',
    ],
    readingExcerpt:
      'Pemilihan metode penelitian bukan ditentukan oleh selera pribadi peneliti semata, melainkan oleh rumusan masalah yang ingin dijawab secara objektif dan dapat dipertanggungjawabkan.\n\nSebelum menyusun instrumen pengumpulan data, peneliti perlu merumuskan kisi-kisi indikator secara cermat agar setiap butir pertanyaan atau lembar observasi benar-benar mengukur konsep teoretis yang diteliti.',
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
    callNumber: '005.1 MAR c',
    language: 'English / Referensi',
    publisher: 'Prentice Hall',
    isbn: '978-0134494166',
    pages: 432,
    readingStatus: 'belum_dibaca',
    categoryTopic: 'Rekayasa Perangkat Lunak',
    coverUrl: '/src/assets/images/cover_software_arch_1795675673031.jpg',
    abstractOrSummary:
      'Membahas prinsip pemisahan tanggung jawab (separation of concerns), prinsip SOLID, dan arsitektur berlapis agar kode proyek tugas akhir maupun aplikasi produksi tetap terawat dalam jangka panjang.',
    tableOfContents: [
      'Part I — Introduction: What Is Design and Architecture?',
      'Part II — Programming Paradigms',
      'Part III — Design Principles (SOLID)',
      'Part IV — Component Principles & Clean Boundaries',
    ],
    readingExcerpt:
      'Tujuan utama arsitektur perangkat lunak adalah meminimalkan sumber daya manusia yang dibutuhkan untuk membangun dan merawat sebuah sistem sepanjang siklus hidupnya.\n\nAturan bisnis inti aplikasi harus berdiri independen dari pilihan basis data, kerangka kerja antarmuka, maupun layanan eksternal, sehingga perubahan teknologi di masa depan tidak memaksa penulisan ulang keseluruhan program.',
    keywords: ['Arsitektur Kode', 'SOLID', 'Software Engineering'],
    isFavorite: false,
    createdAt: '2026-11-10T07:45:00.000Z',
    updatedAt: '2026-11-10T07:45:00.000Z',
  },
  {
    id: 'buku-4',
    type: 'buku_bacaan',
    title: 'Merawat Ekosistem Literasi dan Budaya Baca di Era Digital',
    author: 'Dr. Ratna Indriani',
    year: 2024,
    callNumber: '028.9 IND m',
    language: 'Bahasa Indonesia',
    publisher: 'Pustaka Cendekia',
    isbn: '978-6234120987',
    pages: 256,
    readingStatus: 'sedang_dibaca',
    categoryTopic: 'Literasi & Ilmu Perpustakaan',
    coverUrl: '/src/assets/images/cover_literasi_digital_1795676923676.jpg',
    abstractOrSummary:
      'Kumpulan esai tentang peran perpustakaan sebagai ruang ketiga masyarakat modern, strategi memperluas akses bacaan lintas generasi, serta menjembatani koleksi cetak dan arsip digital terbuka.',
    tableOfContents: [
      'Bab 1 — Perpustakaan Sebagai Ruang Demokratis Pengetahuan',
      'Bab 2 — Mengatasi Kelelahan Membaca di Layar Gawai',
      'Bab 3 — Kurasi Bacaan Ramah Pemula hingga Peneliti',
      'Bab 4 — Masa Depan Repositori Terbuka Nasional',
    ],
    readingExcerpt:
      'Perpustakaan yang hidup selalu memikirkan siapa pun yang melangkah masuk melewati pintunya: seorang pelajar yang mencari inspirasi judul tugas akhir, seorang pensiunan yang sekadar ingin membaca buku sejarah dengan huruf yang nyaman di mata, hingga peneliti yang memerlukan kutipan akurat dalam hitungan detik.\n\nDigitalisasi bukan berarti menggantikan kehangatan ruang baca fisik, melainkan menghadirkan jangkauan yang lebih adil bagi siapa saja tanpa batas jarak dan jam tutup gedung.',
    keywords: ['Literasi Digital', 'Ilmu Perpustakaan', 'Budaya Baca', 'Akses Terbuka'],
    isFavorite: false,
    createdAt: '2026-11-14T10:30:00.000Z',
    updatedAt: '2026-11-14T10:30:00.000Z',
  },
];

export const STORAGE_KEY = 'pustaka_karya_items_v2';
const LEGACY_STORAGE_KEY = 'pustaka_karya_items_v1';

export function loadLibraryItems(): LibraryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Migrate any custom items from v1 if present
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed)) {
        const seedMap = new Map(SEED_LIBRARY_ITEMS.map((item) => [item.id, item]));
        const merged: LibraryItem[] = [];
        for (const item of legacyParsed) {
          if (item && typeof item.id === 'string') {
            const seedUpgrade = seedMap.get(item.id);
            if (seedUpgrade) {
              merged.push({
                ...seedUpgrade,
                isFavorite: Boolean(item.isFavorite),
                personalNotes: item.personalNotes ?? seedUpgrade.personalNotes,
                readingStatus: item.readingStatus ?? seedUpgrade.readingStatus,
              });
              seedMap.delete(item.id);
            } else {
              merged.push(item);
            }
          }
        }
        // Append new seed items
        for (const newSeed of seedMap.values()) {
          merged.push(newSeed);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LIBRARY_ITEMS));
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
  return `${author} (${year}). ${title} [${jenis}${inst ? `, ${inst}` : ''}].`;
}

export function formatIeeeCitation(item: LibraryItem): string {
  const author = item.author.trim() || 'Penulis Tidak Diketahui';
  const year = item.year || new Date().getFullYear();
  const title = item.title.trim();

  if (item.type === 'buku_bacaan') {
    const pub = item.publisher ? `, ${item.publisher}` : '';
    return `${author}, "${title}"${pub}, ${year}.`;
  }

  const jenis = item.type === 'skripsi' ? 'Skripsi' : 'Tugas Akhir';
  const inst = [item.programStudy, item.faculty].filter(Boolean).join(', ');
  return `${author}, "${title}," ${jenis}${inst ? `, ${inst}` : ''}, ${year}.`;
}

export function formatBibtexCitation(item: LibraryItem): string {
  const cleanId = item.id.replace(/[^a-zA-Z0-9]/g, '_');
  const author = item.author.trim() || 'Unknown';
  const year = item.year || new Date().getFullYear();
  const title = item.title.trim();

  if (item.type === 'buku_bacaan') {
    return `@book{${cleanId},\n  author = {${author}},\n  title = {${title}},\n  publisher = {${item.publisher || 'Penerbit'}},\n  year = {${year}}${item.isbn ? `,\n  isbn = {${item.isbn}}` : ''}\n}`;
  }

  return `@mastersthesis{${cleanId},\n  author = {${author}},\n  title = {${title}},\n  school = {${item.faculty || item.programStudy || 'Universitas'}},\n  year = {${year}},\n  type = {${item.type === 'skripsi' ? 'Skripsi' : 'Tugas Akhir'}}\n}`;
}
