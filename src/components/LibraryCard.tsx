import { Bookmark, BookOpen, Paperclip } from 'lucide-react';
import { LibraryItem } from '../types/library';
import { COLLECTION_META, READING_STATUS_LABEL } from '../data/seedItems';
import { ItemCover } from './ItemCover';

interface LibraryCardProps {
  item: LibraryItem;
  onSelect: (item: LibraryItem, initialTab?: 'info' | 'reader') => void;
  onToggleFavorite: (id: string) => void;
}

export function LibraryCard({
  item,
  onSelect,
  onToggleFavorite,
}: LibraryCardProps) {
  const meta = COLLECTION_META[item.type];

  const subtitleParts: string[] = [item.author];
  if (item.type === 'buku_bacaan') {
    if (item.publisher) subtitleParts.push(item.publisher);
    if (item.readingStatus) subtitleParts.push(READING_STATUS_LABEL[item.readingStatus]);
  } else {
    if (item.programStudy) subtitleParts.push(item.programStudy);
    if (item.advisor) subtitleParts.push(`Pembimbing: ${item.advisor}`);
  }

  return (
    <article className="group bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-xl p-4 sm:p-5 transition-colors duration-150 flex gap-4 sm:gap-5">
      <button
        type="button"
        onClick={() => onSelect(item, 'info')}
        className="w-24 sm:w-28 aspect-[3/4] shrink-0 rounded-lg overflow-hidden focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] text-left"
        aria-label={`Buka detail ${item.title}`}
      >
        <ItemCover
          type={item.type}
          title={item.title}
          author={item.author}
          year={item.year}
          callNumber={item.callNumber}
          coverUrl={item.coverUrl}
          className="w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-[1.02]"
        />
      </button>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-[var(--text-muted)]">
              <span className={`font-semibold ${meta.accentClass}`}>
                {meta.label}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{item.year}</span>
              {item.callNumber && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">{item.callNumber}</span>
                </>
              )}
              {item.type === 'buku_bacaan' && item.pages ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{item.pages} hlm</span>
                </>
              ) : null}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(item.id);
              }}
              aria-label={
                item.isFavorite ? 'Hapus dari rak tersimpan' : 'Simpan ke rak tersimpan'
              }
              title={
                item.isFavorite ? 'Hapus dari rak tersimpan' : 'Simpan ke rak tersimpan'
              }
              className={`min-w-[40px] min-h-[40px] -mt-2 -mr-2 flex items-center justify-center rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] ${
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
          </div>

          <h3 className="font-serif text-base sm:text-lg font-semibold text-[var(--text-primary)] leading-snug line-clamp-2 mb-1">
            <button
              type="button"
              onClick={() => onSelect(item, 'info')}
              className="text-left hover:text-[var(--accent-text)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] rounded"
            >
              {item.title}
            </button>
          </h3>

          <p className="text-xs text-[var(--text-secondary)] truncate mb-2">
            {subtitleParts.join(' · ')}
          </p>

          {item.abstractOrSummary && (
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
              {item.abstractOrSummary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-[var(--border-hairline)]">
          <div className="flex items-center gap-3 min-w-0 text-xs text-[var(--text-muted)]">
            {item.attachment ? (
              <span className="inline-flex items-center gap-1 text-[var(--text-secondary)] font-medium truncate">
                <Paperclip className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.attachment.name}</span>
              </span>
            ) : item.keywords.length > 0 ? (
              <span className="truncate">
                {item.keywords.slice(0, 3).join(' · ')}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {item.readingExcerpt && (
              <button
                type="button"
                onClick={() => onSelect(item, 'reader')}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap shrink-0 py-1 px-2 rounded-md hover:bg-[var(--bg-subtle)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Baca Cuplikan</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => onSelect(item, 'info')}
              className="text-xs font-semibold text-[var(--accent-text)] hover:underline whitespace-nowrap shrink-0 py-1 px-1.5 rounded focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
            >
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
