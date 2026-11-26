import { useState } from 'react';
import { BookOpen, FileText, GraduationCap } from 'lucide-react';
import { CollectionType } from '../types/library';
import { COLLECTION_META } from '../data/seedItems';

interface ItemCoverProps {
  type: CollectionType;
  title: string;
  author: string;
  year: number;
  coverUrl?: string;
  className?: string;
}

export function ItemCover({
  type,
  title,
  author,
  year,
  coverUrl,
  className = '',
}: ItemCoverProps) {
  const [imgError, setImgError] = useState(false);

  if (coverUrl && !imgError) {
    return (
      <div
        className={`relative overflow-hidden bg-stone-100 border border-stone-200 ${className}`}
      >
        <img
          src={coverUrl}
          alt={`Sampul ${title}`}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  const meta = COLLECTION_META[type];
  const Icon =
    type === 'skripsi'
      ? GraduationCap
      : type === 'tugas_akhir'
        ? FileText
        : BookOpen;

  const paletteClass =
    type === 'skripsi'
      ? 'bg-[#1E293B] text-slate-100 border-slate-800'
      : type === 'tugas_akhir'
        ? 'bg-[#134E4A] text-teal-50 border-teal-900'
        : 'bg-[#292524] text-stone-100 border-stone-800';

  const ruleColor =
    type === 'skripsi'
      ? 'border-slate-600/60'
      : type === 'tugas_akhir'
        ? 'border-teal-700/60'
        : 'border-stone-700/60';

  return (
    <div
      className={`relative flex flex-col justify-between p-3 border select-none overflow-hidden ${paletteClass} ${className}`}
    >
      <div className={`flex items-center justify-between pb-2 border-b ${ruleColor}`}>
        <Icon className="w-3.5 h-3.5 opacity-80 shrink-0" aria-hidden="true" />
        <span className="font-mono text-[10px] tracking-tight opacity-75 tabular-nums">
          {year}
        </span>
      </div>

      <div className="my-auto py-2">
        <p className="text-[10px] opacity-65 mb-1 truncate">{meta.label}</p>
        <p className="font-serif text-xs font-semibold leading-snug line-clamp-4">
          {title}
        </p>
      </div>

      <div className={`pt-2 border-t ${ruleColor}`}>
        <p className="text-[10px] opacity-80 truncate">{author}</p>
      </div>
    </div>
  );
}
