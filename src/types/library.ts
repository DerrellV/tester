export type CollectionType = 'skripsi' | 'tugas_akhir' | 'buku_bacaan';

export type ReadingStatus = 'belum_dibaca' | 'sedang_dibaca' | 'selesai';

export type SortOption = 'terbaru' | 'judul_az' | 'tahun_terbaru';

export type ViewMode = 'grid' | 'table';

export type NavFilter = 'semua' | CollectionType | 'favorit';

export type ThemeMode = 'light' | 'sepia' | 'dark';

export type TextScale = 'normal' | 'large' | 'xlarge';

export type YearFilter = 'semua' | '2025_plus' | '2024' | '2022_2023' | 'sebelum_2022';

export interface LibraryAttachment {
  name: string;
  sizeBytes?: number;
  url: string;
  isLocalFile?: boolean;
}

export interface LibraryItem {
  id: string;
  type: CollectionType;
  title: string;
  author: string;
  year: number;
  abstractOrSummary: string;
  keywords: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  personalNotes?: string;
  coverUrl?: string;
  attachment?: LibraryAttachment;
  callNumber?: string;
  language?: string;
  tableOfContents?: string[];
  readingExcerpt?: string;
  isFeatured?: boolean;

  // Fields khusus Skripsi & Tugas Akhir
  studentId?: string; // NIM
  programStudy?: string;
  faculty?: string;
  advisor?: string; // Dosen Pembimbing

  // Fields khusus Buku Bacaan
  publisher?: string;
  isbn?: string;
  pages?: number;
  readingStatus?: ReadingStatus;
  categoryTopic?: string;
}

export interface LibraryFormInput {
  type: CollectionType;
  title: string;
  author: string;
  year: number;
  abstractOrSummary: string;
  keywordsText: string;
  personalNotes: string;
  coverUrl: string;
  attachment?: LibraryAttachment;
  externalUrl: string;
  callNumber: string;
  language: string;
  readingExcerpt: string;

  studentId: string;
  programStudy: string;
  faculty: string;
  advisor: string;

  publisher: string;
  isbn: string;
  pages: string;
  readingStatus: ReadingStatus;
  categoryTopic: string;
}
