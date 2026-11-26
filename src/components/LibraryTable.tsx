import { Bookmark, Paperclip } from 'lucide-react';
import { LibraryItem } from '../types/library';
import { COLLECTION_META, READING_STATUS_LABEL } from '../data/seedItems';

interface LibraryTableProps {
  items: LibraryItem[];
  onSelect: (item: LibraryItem) => void;
  onToggleFavorite: (id: string) => void;
}

export function LibraryTable({
  items,
  onSelect,
  onToggleFavorite,
}: LibraryTableProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50/70 text-xs font-semibold text-stone-600">
              <th className="py-3 px-4 whitespace-nowrap">Jenis</th>
              <th className="py-3 px-4 min-w-[260px]">Judul Koleksi</th>
              <th className="py-3 px-4 whitespace-nowrap">Penulis</th>
              <th className="py-3 px-4 whitespace-nowrap">Prodi / Penerbit</th>
              <th className="py-3 px-4 whitespace-nowrap text-right">Tahun</th>
              <th className="py-3 px-4 whitespace-nowrap text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-sm">
            {items.map((item) => {
              const meta = COLLECTION_META[item.type];
              const subInfo =
                item.type === 'buku_bacaan'
                  ? item.publisher || (item.readingStatus ? READING_STATUS_LABEL[item.readingStatus] : '—')
                  : item.programStudy || item.faculty || '—';

              return (
                <tr
                  key={item.id}
                  onClick={() => onSelect(item)}
                  className="hover:bg-stone-50 cursor-pointer transition-colors duration-100"
                >
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`text-xs font-semibold ${meta.accentText}`}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-900 line-clamp-1">
                      {item.title}
                    </div>
                    {item.attachment && (
                      <div className="inline-flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                        <Paperclip className="w-3 h-3" aria-hidden="true" />
                        <span className="truncate max-w-[220px]">
                          {item.attachment.name}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-stone-700 whitespace-nowrap">
                    {item.author}
                  </td>
                  <td className="py-3 px-4 text-stone-600 whitespace-nowrap">
                    {subInfo}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-xs text-stone-600 tabular-nums whitespace-nowrap">
                    {item.year}
                  </td>
                  <td
                    className="py-3 px-4 text-right whitespace-nowrap"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(item.id)}
                        aria-label={
                          item.isFavorite ? 'Hapus dari favorit' : 'Simpan ke favorit'
                        }
                        className={`p-1.5 rounded-lg transition-colors ${
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
                      <button
                        type="button"
                        onClick={() => onSelect(item)}
                        className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 px-2 py-1 rounded hover:bg-indigo-50 transition-colors"
                      >
                        Detail
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
