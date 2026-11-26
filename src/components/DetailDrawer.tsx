import { useEffect, useState } from 'react';
import {
  Bookmark,
  BookOpen,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  FileText,
  Paperclip,
  Trash2,
  X,
} from 'lucide-react';
import { LibraryItem, ReadingStatus } from '../types/library';
import {
  COLLECTION_META,
  READING_STATUS_LABEL,
  formatApaCitation,
  formatBibtexCitation,
  formatIeeeCitation,
} from '../data/seedItems';
import { ItemCover } from './ItemCover';

interface DetailDrawerProps {
  item: LibraryItem | null;
  initialTab?: 'info' | 'reader';
  onClose: () => void;
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateReadingStatus: (id: string, status: ReadingStatus) => void;
}

type CitationFormat = 'apa' | 'ieee' | 'bibtex';
type ReaderFontSize = 'sm' | 'md' | 'lg';

export function DetailDrawer({
  item,
  initialTab = 'info',
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateNotes,
  onUpdateReadingStatus,
}: DetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'reader'>(initialTab);
  const [citationFormat, setCitationFormat] = useState<CitationFormat>('apa');
  const [readerSize, setReaderSize] = useState<ReaderFontSize>('md');
  const [notesDraft, setNotesDraft] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (item) {
      setActiveTab(initialTab);
      setNotesDraft(item.personalNotes || '');
      setNotesSaved(false);
      setCopiedCitation(false);
      setConfirmingDelete(false);
    }
  }, [item, initialTab]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose]);

  if (!item) return null;

  const meta = COLLECTION_META[item.type];
  const isAcademic = item.type === 'skripsi' || item.type === 'tugas_akhir';

  const citationText =
    citationFormat === 'apa'
      ? formatApaCitation(item)
      : citationFormat === 'ieee'
        ? formatIeeeCitation(item)
        : formatBibtexCitation(item);

  const excerptText =
    item.readingExcerpt ||
    item.abstractOrSummary ||
    'Belum ada cuplikan teks untuk koleksi ini.';
  const paragraphs = excerptText
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const readerProseClass =
    readerSize === 'sm'
      ? 'text-[15px] leading-relaxed'
      : readerSize === 'lg'
        ? 'text-[19px] leading-loose'
        : 'text-[17px] leading-[1.8]';

  const handleCopyCitation = async () => {
    try {
      await navigator.clipboard.writeText(citationText);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2000);
    } catch {
      setCopiedCitation(false);
    }
  };

  const handleSaveNotes = () => {
    onUpdateNotes(item.id, notesDraft.trim());
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-stone-950/50 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-2xl bg-[var(--bg-surface)] text-[var(--text-primary)] border-l border-[var(--border-hairline)] h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-b border-[var(--border-hairline)] shrink-0">
          <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
            <span className={`font-semibold ${meta.accentClass}`}>
              {meta.label}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{item.year}</span>
            {item.callNumber && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums hidden sm:inline">
                  {item.callNumber}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              aria-label={
                item.isFavorite
                  ? 'Hapus dari rak tersimpan'
                  : 'Simpan ke rak tersimpan'
              }
              className={`min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] ${
                item.isFavorite
                  ? 'text-amber-600 dark:text-amber-400 bg-[var(--bg-subtle)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
              }`}
            >
              <Bookmark
                className="w-4 h-4"
                fill={item.isFavorite ? 'currentColor' : 'none'}
              />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panel detail"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mode Switcher Bar (Ringkasan vs Mode Baca) */}
        <div className="px-5 sm:px-6 py-2.5 border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)]/50 flex items-center justify-between gap-4 shrink-0">
          <div
            className="inline-flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-lg"
            role="tablist"
            aria-label="Tampilan detail koleksi"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'info'}
              onClick={() => setActiveTab('info')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'info'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ringkasan & Informasi</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'reader'}
              onClick={() => setActiveTab('reader')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'reader'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mode Baca Cuplikan</span>
            </button>
          </div>

          {activeTab === 'reader' && (
            <div className="flex items-center gap-1" aria-label="Ukuran huruf baca">
              {(['sm', 'md', 'lg'] as ReaderFontSize[]).map((sz, idx) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setReaderSize(sz)}
                  aria-label={`Ukuran teks baca ${sz}`}
                  aria-pressed={readerSize === sz}
                  className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                    readerSize === sz
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold border border-[var(--border-strong)]'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {idx === 0 ? 'A-' : idx === 1 ? 'A' : 'A+'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Content */}
        {activeTab === 'info' ? (
          <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-6 space-y-6">
            {/* Cover + Title Block */}
            <div className="flex gap-5 items-start">
              <div className="w-24 sm:w-28 aspect-[3/4] shrink-0 rounded-lg overflow-hidden">
                <ItemCover
                  type={item.type}
                  title={item.title}
                  author={item.author}
                  year={item.year}
                  callNumber={item.callNumber}
                  coverUrl={item.coverUrl}
                  className="w-full h-full rounded-lg"
                />
              </div>

              <div className="min-w-0 flex-1">
                <h2
                  id="detail-title"
                  className="font-serif text-xl sm:text-2xl font-semibold text-[var(--text-primary)] leading-snug mb-2"
                >
                  {item.title}
                </h2>
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  {item.author}
                  {item.language ? ` · ${item.language}` : ''}
                </p>

                {!isAcademic && (
                  <div className="mt-3">
                    <label
                      htmlFor="detail-reading-status"
                      className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1"
                    >
                      Status Bacaan Pengunjung
                    </label>
                    <select
                      id="detail-reading-status"
                      value={item.readingStatus || 'belum_dibaca'}
                      onChange={(e) =>
                        onUpdateReadingStatus(
                          item.id,
                          e.target.value as ReadingStatus
                        )
                      }
                      className="px-3 py-1.5 text-xs font-medium bg-[var(--bg-subtle)] text-[var(--text-primary)] border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[var(--accent-primary)]"
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
                )}
              </div>
            </div>

            {/* Accession Metadata Grid */}
            <dl className="border-t border-b border-[var(--border-hairline)] py-4 grid grid-cols-1 sm:grid-cols-2 gap-y-3.5 gap-x-6 text-sm">
              {isAcademic ? (
                <>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">
                      NIM / Nomor Induk
                    </dt>
                    <dd className="font-mono text-[var(--text-primary)] tabular-nums mt-0.5">
                      {item.studentId || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">
                      Program Studi
                    </dt>
                    <dd className="text-[var(--text-primary)] mt-0.5">
                      {item.programStudy || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">
                      Fakultas / Sekolah
                    </dt>
                    <dd className="text-[var(--text-primary)] mt-0.5">
                      {item.faculty || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">
                      Dosen Pembimbing
                    </dt>
                    <dd className="text-[var(--text-primary)] mt-0.5">
                      {item.advisor || '—'}
                    </dd>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">Penerbit</dt>
                    <dd className="text-[var(--text-primary)] mt-0.5">
                      {item.publisher || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">ISBN</dt>
                    <dd className="font-mono text-[var(--text-primary)] tabular-nums mt-0.5">
                      {item.isbn || '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">
                      Jumlah Halaman
                    </dt>
                    <dd className="font-mono text-[var(--text-primary)] tabular-nums mt-0.5">
                      {item.pages ? `${item.pages} halaman` : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[var(--text-muted)]">
                      Topik / Bidang
                    </dt>
                    <dd className="text-[var(--text-primary)] mt-0.5">
                      {item.categoryTopic || 'Umum'}
                    </dd>
                  </div>
                </>
              )}
            </dl>

            {/* Abstrak / Ringkasan */}
            <div>
              <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-2">
                {isAcademic ? 'Abstrak Penelitian' : 'Sinopsis Buku'}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                {item.abstractOrSummary || 'Belum ada ringkasan yang ditambahkan.'}
              </p>
            </div>

            {/* Daftar Isi / Pokok Bahasan */}
            {item.tableOfContents && item.tableOfContents.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-2">
                  Pokok Bahasan / Daftar Isi
                </h3>
                <ol className="space-y-1.5 text-sm text-[var(--text-secondary)] border-t border-[var(--border-hairline)] pt-2.5">
                  {item.tableOfContents.map((chapter, index) => (
                    <li key={index} className="flex items-baseline gap-3 py-1">
                      <span className="font-mono text-xs text-[var(--text-muted)] tabular-nums shrink-0">
                        {String(index + 1).padStart(2, '0')}.
                      </span>
                      <span>{chapter}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Kata Kunci */}
            {item.keywords.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-[var(--text-muted)] mb-1.5">
                  Kata Kunci
                </h3>
                <p className="text-sm text-[var(--text-primary)]">
                  {item.keywords.join(' · ')}
                </p>
              </div>
            )}

            {/* Lampiran Dokumen */}
            {item.attachment && (
              <div className="p-4 bg-[var(--bg-subtle)]/70 border border-[var(--border-hairline)] rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Paperclip
                    className="w-4 h-4 text-[var(--text-secondary)] shrink-0"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[var(--text-primary)] truncate">
                      {item.attachment.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {item.attachment.isLocalFile
                        ? 'Berkas terlampir dari perangkat'
                        : 'Tautan dokumen eksternal'}
                    </p>
                  </div>
                </div>
                <a
                  href={item.attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={
                    item.attachment.isLocalFile ? item.attachment.name : undefined
                  }
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[var(--accent-text)] bg-[var(--bg-surface)] border border-[var(--border-strong)] hover:border-[var(--accent-primary)] rounded-md whitespace-nowrap shrink-0 transition-colors"
                >
                  <span>Buka Berkas</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            )}

            {/* Salin Sitasi */}
            <div className="p-4 bg-[var(--bg-subtle)]/70 border border-[var(--border-hairline)] rounded-lg space-y-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-[var(--text-primary)]">
                    Salin Sitasi
                  </h3>
                  <div className="inline-flex items-center gap-1 p-0.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-md">
                    {(['apa', 'ieee', 'bibtex'] as CitationFormat[]).map((fmt) => (
                      <button
                        key={fmt}
                        type="button"
                        onClick={() => setCitationFormat(fmt)}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded transition-colors ${
                          citationFormat === fmt
                            ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyCitation}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-text)] hover:underline whitespace-nowrap"
                >
                  {copiedCitation ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Sitasi</span>
                    </>
                  )}
                </button>
              </div>
              <p
                className={`text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap ${
                  citationFormat === 'bibtex' ? 'font-mono text-[11px]' : 'font-serif'
                }`}
              >
                {citationText}
              </p>
            </div>

            {/* Catatan Pengunjung */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="detail-personal-notes"
                  className="text-xs font-semibold text-[var(--text-secondary)]"
                >
                  Catatan Bacaan Anda
                </label>
                {notesSaved && (
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Catatan tersimpan
                  </span>
                )}
              </div>
              <textarea
                id="detail-personal-notes"
                rows={3}
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                placeholder="Catat halaman penting, kutipan, atau poin tinjauan pustaka di sini..."
                className="w-full px-3.5 py-2.5 text-sm bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border-strong)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)] resize-y"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="px-4 py-2 text-xs font-semibold text-[var(--text-primary)] bg-[var(--bg-subtle)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors"
                >
                  Simpan Catatan
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Mode Baca Cuplikan (Editorial Reading View) */
          <div className="flex-1 overflow-y-auto px-6 sm:px-10 py-8">
            <article className="max-w-prose mx-auto space-y-6">
              <header className="pb-6 border-b border-[var(--border-hairline)] space-y-2">
                <p className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                  {meta.label} · {item.year}
                  {item.callNumber ? ` · ${item.callNumber}` : ''}
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-tight">
                  {item.title}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  Oleh {item.author}
                  {item.programStudy ? ` — ${item.programStudy}` : ''}
                  {item.publisher ? ` — ${item.publisher}` : ''}
                </p>
              </header>

              <div className={`font-serif text-[var(--text-primary)] space-y-5 ${readerProseClass}`}>
                {paragraphs.map((para, idx) => (
                  <p
                    key={idx}
                    className={
                      idx === 0
                        ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-none'
                        : ''
                    }
                  >
                    {para}
                  </p>
                ))}
              </div>

              {item.attachment && (
                <div className="pt-6 border-t border-[var(--border-hairline)] flex items-center justify-between gap-4">
                  <p className="text-xs text-[var(--text-muted)]">
                    Ingin membaca naskah lengkap?
                  </p>
                  <a
                    href={item.attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] rounded-lg whitespace-nowrap transition-colors"
                  >
                    <span>Buka Dokumen Penuh</span>
                    <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              )}
            </article>
          </div>
        )}

        {/* Drawer Footer: Subtle Management Actions */}
        <div className="px-5 sm:px-6 py-3 border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)]/50 flex items-center justify-between gap-4 shrink-0">
          {!confirmingDelete ? (
            <>
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-lg transition-colors whitespace-nowrap"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Koleksi</span>
              </button>

              <button
                type="button"
                onClick={() => setConfirmingDelete(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:underline py-1.5 px-2 rounded transition-colors whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2.5 w-full justify-between">
              <span className="text-xs font-medium text-red-700 dark:text-red-400">
                Yakin ingin menghapus item ini?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="px-3 py-1.5 text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-md"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Ya, Hapus
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
