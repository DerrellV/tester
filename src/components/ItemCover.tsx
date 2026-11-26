import { useState } from 'react';
import { BookOpen, FileText, GraduationCap } from 'lucide-react';
import { CollectionType } from '../types/library';
import { COLLECTION_META } from '../data/seedItems';

interface ItemCoverProps {
  type: CollectionType;
  title: string;
  author: string;
  year: number;
  callNumber?: string;
  coverUrl?: string;
  className?: string;
}

export function ItemCover({
  type,
  title,
  author,
  year,
  callNumber,
  coverUrl,
  className = '',
}: ItemCoverProps) {
  const [imgError, setImgError] = useState(false);

  if (coverUrl && !imgError) {
    return (
      <div
        className={`relative overflow-hidden bg-[var(--bg-subtle)] border border-[var(--border-hairline)] ${className}`}
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
      ? 'bg-[#1E293B] text-slate-100 border-slate-700/80'
      : type === 'tugas_akhir'
        ? 'bg-[#14452F] text-emerald-50 border-emerald-800/80'
        : 'bg-[#292524] text-stone-100 border-stone-700/80';

  const ruleColor =
    type === 'skripsi'
      ? 'border-slate-600/60'
      : type === 'tugas_akhir'
        ? 'border-emerald-700/60'
        : 'border-stone-700/60';

  return (
    <div
      className={`relative flex flex-col justify-between p-3 border select-none overflow-hidden ${paletteClass} ${className}`}
    >
      <div className={`flex items-center justify-between pb-1.5 border-b ${ruleColor}`}>
        <Icon className="w-3.5 h-3.5 opacity-85 shrink-0" aria-hidden="true" />
        <span className="font-mono text-[10px] tracking-tight opacity-80 tabular-nums">
          {year}
        </span>
      </div>

      <div className="my-auto py-1.5">
        <p className="text-[10px] opacity-70 mb-1 truncate">
          {callNumber || meta.label}
        </p>
        <p className="font-serif text-xs font-semibold leading-snug line-clamp-4">
          {title}
        </p>
      </div>

      <div className={`pt-1.5 border-t ${ruleColor}`}>
        <p className="text-[10px] opacity-80 truncate">{author}</p>
      </div>
    </div>
  );
}
