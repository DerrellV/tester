import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  FileText,
  GraduationCap,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import {
  CollectionType,
  LibraryAttachment,
  LibraryFormInput,
  LibraryItem,
  ReadingStatus,
} from '../types/library';
import { COLLECTION_META, READING_STATUS_LABEL } from '../data/seedItems';

interface AddEditModalProps {
  isOpen: boolean;
  initialType: CollectionType;
  editingItem: LibraryItem | null;
  onClose: () => void;
  onSave: (itemData: Omit<LibraryItem, 'id' | 'createdAt' | 'updatedAt'>, editingId?: string) => void;
}

function buildEmptyForm(type: CollectionType, item?: LibraryItem | null): LibraryFormInput {
  if (item) {
    return {
      type: item.type,
      title: item.title,
      author: item.author,
      year: item.year,
      abstractOrSummary: item.abstractOrSummary,
      keywordsText: item.keywords.join(', '),
      personalNotes: item.personalNotes || '',
      coverUrl: item.coverUrl || '',
      attachment: item.attachment,
      externalUrl: item.attachment && !item.attachment.isLocalFile ? item.attachment.url : '',
      studentId: item.studentId || '',
      programStudy: item.programStudy || '',
      faculty: item.faculty || '',
      advisor: item.advisor || '',
      publisher: item.publisher || '',
      isbn: item.isbn || '',
      pages: item.pages ? String(item.pages) : '',
      readingStatus: item.readingStatus || 'belum_dibaca',
      categoryTopic: item.categoryTopic || '',
    };
  }

  return {
    type,
    title: '',
    author: '',
    year: new Date().getFullYear(),
    abstractOrSummary: '',
    keywordsText: '',
    personalNotes: '',
    coverUrl: '',
    attachment: undefined,
    externalUrl: '',
    studentId: '',
    programStudy: '',
    faculty: '',
    advisor: '',
    publisher: '',
    isbn: '',
    pages: '',
    readingStatus: 'belum_dibaca',
    categoryTopic: '',
  };
}

export function AddEditModal({
  isOpen,
  initialType,
  editingItem,
  onClose,
  onSave,
}: AddEditModalProps) {
  const [form, setForm] = useState<LibraryFormInput>(() =>
    buildEmptyForm(initialType, editingItem)
  );
  const [errors, setErrors] = useState<{ title?: string; author?: string; year?: string }>({});
  const docInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setForm(buildEmptyForm(initialType, editingItem));
      setErrors({});
    }
  }, [isOpen, initialType, editingItem]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isAcademic = form.type === 'skripsi' || form.type === 'tugas_akhir';

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const attachment: LibraryAttachment = {
      name: file.name,
      sizeBytes: file.size,
      url: objectUrl,
      isLocalFile: true,
    };
    setForm((prev) => ({
      ...prev,
      attachment,
      externalUrl: '',
    }));
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm((prev) => ({ ...prev, coverUrl: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { title?: string; author?: string; year?: string } = {};

    if (!form.title.trim()) {
      nextErrors.title = 'Judul wajib diisi agar koleksi mudah ditemukan.';
    }
    if (!form.author.trim()) {
      nextErrors.author = isAcademic
        ? 'Nama penulis atau mahasiswa wajib diisi.'
        : 'Nama penulis buku wajib diisi.';
    }
    const yearNum = Number(form.year);
    if (!yearNum || yearNum < 1900 || yearNum > 2100) {
      nextErrors.year = 'Masukkan tahun yang valid (misal: 2025).';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    let finalAttachment = form.attachment;
    if (!finalAttachment && form.externalUrl.trim()) {
      finalAttachment = {
        name: form.externalUrl.trim(),
        url: form.externalUrl.trim().startsWith('http')
          ? form.externalUrl.trim()
          : `https://${form.externalUrl.trim()}`,
        isLocalFile: false,
      };
    }

    const keywords = form.keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const parsedPages = Number(form.pages);

    onSave(
      {
        type: form.type,
        title: form.title.trim(),
        author: form.author.trim(),
        year: yearNum,
        abstractOrSummary: form.abstractOrSummary.trim(),
        keywords,
        isFavorite: editingItem ? editingItem.isFavorite : false,
        personalNotes: form.personalNotes.trim() || undefined,
        coverUrl: form.coverUrl.trim() || undefined,
        attachment: finalAttachment,
        studentId: isAcademic ? form.studentId.trim() || undefined : undefined,
        programStudy: isAcademic ? form.programStudy.trim() || undefined : undefined,
        faculty: isAcademic ? form.faculty.trim() || undefined : undefined,
        advisor: isAcademic ? form.advisor.trim() || undefined : undefined,
        publisher: !isAcademic ? form.publisher.trim() || undefined : undefined,
        isbn: !isAcademic ? form.isbn.trim() || undefined : undefined,
        pages: !isAcademic && parsedPages > 0 ? parsedPages : undefined,
        readingStatus: !isAcademic ? form.readingStatus : undefined,
        categoryTopic: !isAcademic ? form.categoryTopic.trim() || undefined : undefined,
      },
      editingItem?.id
    );
  };

  const typeChoices: {
    id: CollectionType;
    label: string;
    desc: string;
    icon: typeof GraduationCap;
  }[] = [
    {
      id: 'skripsi',
      label: 'Skripsi',
      desc: 'Karya tulis sarjana (S1)',
      icon: GraduationCap,
    },
    {
      id: 'tugas_akhir',
      label: 'Tugas Akhir',
      desc: 'Proyek akhir / Diploma',
      icon: FileText,
    },
    {
      id: 'buku_bacaan',
      label: 'Buku Bacaan',
      desc: 'Referensi atau literatur',
      icon: BookOpen,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white border border-stone-200 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 shrink-0">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-stone-900">
              {editingItem ? 'Edit Data Koleksi' : 'Tambah Koleksi Baru'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Pilih jenis koleksi terlebih dahulu, lalu lengkapi informasi di bawahnya.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="p-2 -mr-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Step 1: Pilih Jenis Koleksi */}
          <div>
            <label className="block text-sm font-semibold text-stone-800 mb-2.5">
              1. Pilih Jenis Koleksi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {typeChoices.map((choice) => {
                const Icon = choice.icon;
                const active = form.type === choice.id;
                return (
                  <button
                    key={choice.id}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, type: choice.id }))}
                    className={`flex items-start gap-3 p-3.5 rounded-lg border text-left transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                      active
                        ? 'border-indigo-600 bg-indigo-50/70 text-stone-900'
                        : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 mt-0.5 shrink-0 ${
                        active ? 'text-indigo-700' : 'text-stone-400'
                      }`}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold whitespace-nowrap">
                        {choice.label}
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5">
                        {choice.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Informasi Utama */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <p className="text-sm font-semibold text-stone-800">
              2. Informasi Utama ({COLLECTION_META[form.type].label})
            </p>

            <div>
              <label
                htmlFor="field-title"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                Judul {COLLECTION_META[form.type].label}{' '}
                <span className="text-red-600">*</span>
              </label>
              <input
                id="field-title"
                type="text"
                value={form.title}
                onChange={(e) => {
                  setForm((prev) => ({ ...prev, title: e.target.value }));
                  if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder={
                  isAcademic
                    ? 'Contoh: Perancangan Sistem Informasi Perpustakaan Berbasis Web'
                    : 'Contoh: Metodologi Penelitian Pendidikan'
                }
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 ${
                  errors.title ? 'border-red-500' : 'border-stone-300'
                }`}
              />
              {errors.title && (
                <p className="text-xs text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="field-author"
                  className="block text-xs font-semibold text-stone-700 mb-1.5"
                >
                  {isAcademic ? 'Nama Penulis / Mahasiswa' : 'Nama Penulis Buku'}{' '}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id="field-author"
                  type="text"
                  value={form.author}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, author: e.target.value }));
                    if (errors.author) setErrors((prev) => ({ ...prev, author: undefined }));
                  }}
                  placeholder={
                    isAcademic ? 'Contoh: Budi Santoso' : 'Contoh: Don Norman'
                  }
                  className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 ${
                    errors.author ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.author && (
                  <p className="text-xs text-red-600 mt-1">{errors.author}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="field-year"
                  className="block text-xs font-semibold text-stone-700 mb-1.5"
                >
                  Tahun Terbit <span className="text-red-600">*</span>
                </label>
                <input
                  id="field-year"
                  type="number"
                  min={1900}
                  max={2100}
                  value={form.year}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, year: Number(e.target.value) }));
                    if (errors.year) setErrors((prev) => ({ ...prev, year: undefined }));
                  }}
                  className={`w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 ${
                    errors.year ? 'border-red-500' : 'border-stone-300'
                  }`}
                />
                {errors.year && (
                  <p className="text-xs text-red-600 mt-1">{errors.year}</p>
                )}
              </div>
            </div>

            {/* Dynamic Fields Based on Type */}
            {isAcademic ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="field-nim"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    NIM / Nomor Induk Mahasiswa
                  </label>
                  <input
                    id="field-nim"
                    type="text"
                    value={form.studentId}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, studentId: e.target.value }))
                    }
                    placeholder="Contoh: 21051204042"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-advisor"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Dosen Pembimbing
                  </label>
                  <input
                    id="field-advisor"
                    type="text"
                    value={form.advisor}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, advisor: e.target.value }))
                    }
                    placeholder="Contoh: Dr. Hendra Wijaya, M.Kom."
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-prodi"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Program Studi / Jurusan
                  </label>
                  <input
                    id="field-prodi"
                    type="text"
                    value={form.programStudy}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, programStudy: e.target.value }))
                    }
                    placeholder="Contoh: Teknik Informatika"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-faculty"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Fakultas / Institusi
                  </label>
                  <input
                    id="field-faculty"
                    type="text"
                    value={form.faculty}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, faculty: e.target.value }))
                    }
                    placeholder="Contoh: Fakultas Teknik"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="field-publisher"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Penerbit
                  </label>
                  <input
                    id="field-publisher"
                    type="text"
                    value={form.publisher}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, publisher: e.target.value }))
                    }
                    placeholder="Contoh: Gramedia Pustaka Utama"
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-status"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Status Bacaan
                  </label>
                  <select
                    id="field-status"
                    value={form.readingStatus}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        readingStatus: e.target.value as ReadingStatus,
                      }))
                    }
                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  >
                    {(Object.keys(READING_STATUS_LABEL) as ReadingStatus[]).map(
                      (statusKey) => (
                        <option key={statusKey} value={statusKey}>
                          {READING_STATUS_LABEL[statusKey]}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="field-isbn"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Nomor ISBN (Opsional)
                  </label>
                  <input
                    id="field-isbn"
                    type="text"
                    value={form.isbn}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, isbn: e.target.value }))
                    }
                    placeholder="Contoh: 978-602-000-000-0"
                    className="w-full px-3.5 py-2.5 text-sm font-mono bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="field-pages"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Jumlah Halaman (Opsional)
                  </label>
                  <input
                    id="field-pages"
                    type="number"
                    min={1}
                    value={form.pages}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, pages: e.target.value }))
                    }
                    placeholder="Contoh: 320"
                    className="w-full px-3.5 py-2.5 text-sm font-mono tabular-nums bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Abstrak / Ringkasan & Kata Kunci */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <p className="text-sm font-semibold text-stone-800">
              3. Ringkasan & Kata Kunci
            </p>

            <div>
              <label
                htmlFor="field-abstract"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                {isAcademic ? 'Abstrak Singkat' : 'Sinopsis / Ringkasan Buku'}
              </label>
              <textarea
                id="field-abstract"
                rows={3}
                value={form.abstractOrSummary}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    abstractOrSummary: e.target.value,
                  }))
                }
                placeholder={
                  isAcademic
                    ? 'Tuliskan tujuan, metode, atau hasil utama penelitian...'
                    : 'Tuliskan inti bahasan atau ringkasan isi buku...'
                }
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 resize-y"
              />
            </div>

            <div>
              <label
                htmlFor="field-keywords"
                className="block text-xs font-semibold text-stone-700 mb-1.5"
              >
                Kata Kunci / Topik (pisahkan dengan koma)
              </label>
              <input
                id="field-keywords"
                type="text"
                value={form.keywordsText}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, keywordsText: e.target.value }))
                }
                placeholder="Contoh: Desain UX, Sistem Informasi, Pustaka Digital"
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Step 4: Lampiran File / Tautan & Sampul */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            <p className="text-sm font-semibold text-stone-800">
              4. Lampiran Dokumen & Sampul (Opsional)
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Unggah File PDF / Dokumen */}
              <div className="p-3.5 border border-stone-200 rounded-lg bg-stone-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">
                    File Dokumen (PDF/DOCX)
                  </span>
                  {form.attachment && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          attachment: undefined,
                          externalUrl: '',
                        }))
                      }
                      className="text-xs text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  )}
                </div>

                <input
                  ref={docInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.epub,.txt"
                  onChange={handleDocumentUpload}
                  className="hidden"
                />

                {form.attachment ? (
                  <div className="text-xs text-stone-700 bg-white border border-stone-200 rounded-md px-3 py-2 truncate">
                    {form.attachment.name}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => docInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-stone-300 hover:border-stone-400 rounded-md text-xs font-medium text-stone-700 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Pilih File dari Perangkat
                  </button>
                )}

                <div className="relative">
                  <LinkIcon
                    className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={form.externalUrl}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        externalUrl: e.target.value,
                        attachment: undefined,
                      }))
                    }
                    placeholder="Atau tempel tautan dokumen (URL)..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-stone-200 rounded-md focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Unggah Sampul */}
              <div className="p-3.5 border border-stone-200 rounded-lg bg-stone-50/50 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">
                    Gambar Sampul (Opsional)
                  </span>
                  {form.coverUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, coverUrl: '' }))}
                      className="text-xs text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Hapus
                    </button>
                  )}
                </div>

                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />

                {form.coverUrl ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={form.coverUrl}
                      alt="Pratinjau sampul"
                      className="w-10 h-14 object-cover rounded border border-stone-200"
                    />
                    <span className="text-xs text-stone-600">
                      Sampul siap digunakan
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-stone-300 hover:border-stone-400 rounded-md text-xs font-medium text-stone-700 transition-colors"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    Unggah Gambar Sampul
                  </button>
                )}
                <p className="text-[11px] text-stone-500 leading-snug">
                  Jika dikosongkan, sistem membuat sampul tipografi otomatis yang rapi.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors whitespace-nowrap"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              {editingItem ? 'Simpan Perubahan' : 'Simpan ke Koleksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
