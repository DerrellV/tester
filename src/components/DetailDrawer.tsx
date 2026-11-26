import { useEffect, useState } from 'react';
import {
  Bookmark,
  Check,
  Copy,
  Edit3,
  ExternalLink,
  Paperclip,
  Trash2,
  X,
} from 'lucide-react';
import { LibraryItem, ReadingStatus } from '../types/library';
import {
  COLLECTION_META,
  READING_STATUS_LABEL,
  formatApaCitation,
} from '../data/seedItems';
import { ItemCover } from './ItemCover';

interface DetailDrawerProps {
  item: LibraryItem | null;
  onClose: () => void;
  onEdit: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onUpdateReadingStatus: (id: string, status: ReadingStatus) => void;
}

export function DetailDrawer({
  item,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite,
  onUpdateNotes,
  onUpdateReadingStatus,
}: DetailDrawerProps) {
  const [notesDraft, setNotesDraft] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    if (item) {
      setNotesDraft(item.personalNotes || '');
      setNotesSaved(false);
      setCopiedCitation(false);
      setConfirmingDelete(false);
    }
  }, [item]);

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
  const citationText = formatApaCitation(item);

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
      className="fixed inset-0 z-50 flex justify-end bg-stone-950/45 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <aside className="relative z-10 w-full max-w-xl bg-white border-l border-stone-200 h-full flex flex-col shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className={`font-semibold ${meta.accentText}`}>
              {meta.label}
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{item.year}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onToggleFavorite(item.id)}
              aria-label={
                item.isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'
              }
              className={`p-2 rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                item.isFavorite
                  ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Bookmark
                className="w-4 h-4"
                fill={item.isFavorite ? 'currentColor' : 'none'}
              />
            </button>
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup panel detail"
              className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Cover + Title Block */}
          <div className="flex gap-5 items-start">
            <div className="w-24 sm:w-28 aspect-[3/4] shrink-0 rounded-lg overflow-hidden">
              <ItemCover
                type={item.type}
                title={item.title}
                author={item.author}
                year={item.year}
                coverUrl={item.coverUrl}
                className="w-full h-full rounded-lg"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2
                id="detail-title"
                className="font-serif text-xl font-semibold text-stone-900 leading-snug mb-2"
              >
                {item.title}
              </h2>
              <p className="text-sm font-medium text-stone-700">{item.author}</p>

              {!isAcademic && (
                <div className="mt-3">
                  <label
                    htmlFor="detail-reading-status"
                    className="block text-[11px] font-semibold text-stone-500 mb-1"
                  >
                    Status Bacaan
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
                    className="px-3 py-1.5 text-xs font-medium bg-stone-50 border border-stone-300 rounded-lg focus:outline-none focus:border-indigo-600"
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

          {/* Metadata Table */}
          <div className="border-t border-b border-stone-200 py-4 grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
            {isAcademic ? (
              <>
                <div>
                  <span className="block text-xs text-stone-500">NIM</span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {item.studentId || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">
                    Program Studi
                  </span>
                  <span className="text-stone-900">
                    {item.programStudy || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">Fakultas</span>
                  <span className="text-stone-900">{item.faculty || '—'}</span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">
                    Dosen Pembimbing
                  </span>
                  <span className="text-stone-900">{item.advisor || '—'}</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="block text-xs text-stone-500">Penerbit</span>
                  <span className="text-stone-900">
                    {item.publisher || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">ISBN</span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {item.isbn || '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">
                    Jumlah Halaman
                  </span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {item.pages ? `${item.pages} halaman` : '—'}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">
                    Tahun Terbit
                  </span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {item.year}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Abstrak / Ringkasan */}
          <div>
            <h3 className="text-xs font-semibold text-stone-500 mb-2">
              {isAcademic ? 'Abstrak' : 'Ringkasan Buku'}
            </h3>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {item.abstractOrSummary || 'Belum ada ringkasan yang ditambahkan.'}
            </p>
          </div>

          {/* Kata Kunci */}
          {item.keywords.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold text-stone-500 mb-1.5">
                Kata Kunci
              </h3>
              <p className="text-sm text-stone-800">
                {item.keywords.join(' · ')}
              </p>
            </div>
          )}

          {/* Lampiran Dokumen */}
          {item.attachment && (
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <Paperclip
                  className="w-4 h-4 text-stone-600 shrink-0"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-stone-800 truncate">
                    {item.attachment.name}
                  </p>
                  <p className="text-[11px] text-stone-500">
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-white border border-stone-200 hover:border-indigo-300 rounded-md whitespace-nowrap shrink-0 transition-colors"
              >
                <span>Buka</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          )}

          {/* Salin Sitasi APA */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-2">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-semibold text-stone-700">
                Format Sitasi (APA)
              </h3>
              <button
                type="button"
                onClick={handleCopyCitation}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 whitespace-nowrap"
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
            <p className="text-xs text-stone-600 font-serif leading-relaxed">
              {citationText}
            </p>
          </div>

          {/* Catatan Pribadi */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="detail-personal-notes"
                className="text-xs font-semibold text-stone-700"
              >
                Catatan Pribadi
              </label>
              {notesSaved && (
                <span className="text-xs font-medium text-emerald-700">
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
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 resize-y"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3.5 py-1.5 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Simpan Catatan
              </button>
            </div>
          </div>
        </div>

        {/* Drawer Footer: Delete Action */}
        <div className="px-6 py-3.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between gap-4 shrink-0">
          {!confirmingDelete ? (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-800 py-1.5 px-2 rounded hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus Koleksi</span>
            </button>
          ) : (
            <div className="flex items-center gap-2.5 w-full justify-between">
              <span className="text-xs font-medium text-red-700">
                Yakin ingin menghapus item ini?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-300 rounded-md hover:bg-stone-50"
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
