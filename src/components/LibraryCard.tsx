import { Bookmark, Paperclip } from 'lucide-react';
import { LibraryItem } from '../types/library';
import { COLLECTION_META, READING_STATUS_LABEL } from '../data/seedItems';
import { ItemCover } from './ItemCover';

interface LibraryCardProps {
  item: LibraryItem;
  onSelect: (item: LibraryItem) => void;
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
    <article className="group bg-white border border-stone-200 rounded-xl p-4 sm:p-5 hover:border-stone-300 transition-colors duration-150 flex gap-4 sm:gap-5">
      <button
        type="button"
        onClick={() => onSelect(item)}
        className="w-24 sm:w-28 aspect-[3/4] shrink-0 rounded-lg overflow-hidden focus-visible:outline-2 focus-visible:outline-indigo-600 text-left"
        aria-label={`Buka detail ${item.title}`}
      >
        <ItemCover
          type={item.type}
          title={item.title}
          author={item.author}
          year={item.year}
          coverUrl={item.coverUrl}
          className="w-full h-full rounded-lg"
        />
      </button>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-xs text-stone-500">
              <span className={`font-semibold ${meta.accentText}`}>
                {meta.label}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums">{item.year}</span>
              {item.studentId && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tabular-nums">NIM {item.studentId}</span>
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
                item.isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'
              }
              title={item.isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'}
              className={`p-1.5 -mt-1 -mr-1 rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                item.isFavorite
                  ? 'text-amber-600 hover:bg-amber-50'
                  : 'text-stone-400 hover:text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Bookmark
                className="w-4 h-4"
                fill={item.isFavorite ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          <h3 className="text-base font-semibold text-stone-900 leading-snug line-clamp-2 mb-1">
            <button
              type="button"
              onClick={() => onSelect(item)}
              className="text-left hover:text-indigo-700 transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 rounded"
            >
              {item.title}
            </button>
          </h3>

          <p className="text-xs text-stone-600 truncate mb-2.5">
            {subtitleParts.join(' · ')}
          </p>

          {item.abstractOrSummary && (
            <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
              {item.abstractOrSummary}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 pt-3 mt-3 border-t border-stone-100">
          <div className="flex items-center gap-3 min-w-0 text-xs text-stone-500">
            {item.attachment && (
              <span className="inline-flex items-center gap-1 text-stone-700 font-medium truncate">
                <Paperclip className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.attachment.name}</span>
              </span>
            )}
            {!item.attachment && item.keywords.length > 0 && (
              <span className="truncate">
                {item.keywords.slice(0, 3).join(' · ')}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSelect(item)}
            className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600 rounded px-1 py-0.5"
          >
            Lihat Detail
          </button>
        </div>
      </div>
    </article>
  );
}
