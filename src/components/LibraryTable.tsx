import { Bookmark, Paperclip } from 'lucide-react';
import { LibraryItem } from '../types/library';
import { COLLECTION_META, READING_STATUS_LABEL } from '../data/seedItems';

interface LibraryTableProps {
  items: LibraryItem[];
  onSelect: (item: LibraryItem, initialTab?: 'info' | 'reader') => void;
  onToggleFavorite: (id: string) => void;
}

export function LibraryTable({
  items,
  onSelect,
  onToggleFavorite,
}: LibraryTableProps) {
  return (
    <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)]/70 text-xs font-semibold text-[var(--text-secondary)]">
              <th className="py-3.5 px-4 whitespace-nowrap">Jenis</th>
              <th className="py-3.5 px-4 min-w-[260px]">Judul Koleksi</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Penulis</th>
              <th className="py-3.5 px-4 whitespace-nowrap">Prodi / Penerbit</th>
              <th className="py-3.5 px-4 whitespace-nowrap text-right">Tahun</th>
              <th className="py-3.5 px-4 whitespace-nowrap text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-hairline)] text-sm">
            {items.map((item) => {
              const meta = COLLECTION_META[item.type];
              const subInfo =
                item.type === 'buku_bacaan'
                  ? item.publisher ||
                    (item.readingStatus ? READING_STATUS_LABEL[item.readingStatus] : '—')
                  : item.programStudy || item.faculty || '—';

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelect(item, 'info')}
                  className="hover:bg-[var(--bg-subtle)]/50 cursor-pointer transition-colors duration-100"
                >
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className={`text-xs font-semibold ${meta.accentClass}`}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[var(--text-primary)] line-clamp-1">
                      {item.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
                      {item.callNumber && (
                        <span className="font-mono tabular-nums">{item.callNumber}</span>
                      )}
                      {item.attachment && (
                        <span className="inline-flex items-center gap-1 truncate max-w-[220px]">
                          <Paperclip className="w-3 h-3 shrink-0" aria-hidden="true" />
                          <span className="truncate">{item.attachment.name}</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                    {item.author}
                  </td>
                  <td className="py-3.5 px-4 text-[var(--text-secondary)] whitespace-nowrap">
                    {subInfo}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-[var(--text-secondary)] tabular-nums whitespace-nowrap">
                    {item.year}
                  </td>
                  <td
                    className="py-3.5 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(item.id)}
                        aria-label={
                          item.isFavorite
                            ? 'Hapus dari rak tersimpan'
                            : 'Simpan ke rak tersimpan'
                        }
                        className={`min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg transition-colors ${
                          item.isFavorite
                            ? 'text-amber-600 dark:text-amber-400 hover:bg-[var(--bg-subtle)]'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)]'
                        }`}
                      >
                        <Bookmark
                          className="w-4 h-4"
                          fill={item.isFavorite ? 'currentColor' : 'none'}
                        />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelect(item, 'info')}
                        className="text-xs font-semibold text-[var(--accent-text)] hover:underline px-2.5 py-1.5 rounded hover:bg-[var(--bg-subtle)] transition-colors whitespace-nowrap"
                      >
                        Buka
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
