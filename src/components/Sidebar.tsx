import {
  Bookmark,
  BookOpen,
  FileText,
  GraduationCap,
  Layers,
  Plus,
  X,
} from 'lucide-react';
import { CollectionType, NavFilter } from '../types/library';

interface SidebarProps {
  activeNav: NavFilter;
  onSelectNav: (nav: NavFilter) => void;
  onQuickAdd: (type: CollectionType) => void;
  counts: {
    semua: number;
    skripsi: number;
    tugas_akhir: number;
    buku_bacaan: number;
    favorit: number;
  };
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  activeNav,
  onSelectNav,
  onQuickAdd,
  counts,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const navItems: {
    id: NavFilter;
    label: string;
    count: number;
    icon: typeof Layers;
  }[] = [
    { id: 'semua', label: 'Semua Koleksi', count: counts.semua, icon: Layers },
    { id: 'skripsi', label: 'Skripsi', count: counts.skripsi, icon: GraduationCap },
    { id: 'tugas_akhir', label: 'Tugas Akhir', count: counts.tugas_akhir, icon: FileText },
    { id: 'buku_bacaan', label: 'Buku Bacaan', count: counts.buku_bacaan, icon: BookOpen },
    { id: 'favorit', label: 'Favorit', count: counts.favorit, icon: Bookmark },
  ];

  const handleNavClick = (id: NavFilter) => {
    onSelectNav(id);
    onCloseMobile();
  };

  const handleQuickAddClick = (type: CollectionType) => {
    onQuickAdd(type);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-stone-200 w-64 shrink-0">
      <div className="flex items-center justify-between px-5 h-16 border-b border-stone-200">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('semua');
          }}
          className="text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
        >
          Pustaka Karya
        </a>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Tutup menu navigasi"
          className="lg:hidden p-2 -mr-2 text-stone-500 hover:text-stone-900 rounded-lg focus-visible:outline-2 focus-visible:outline-indigo-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5 space-y-7">
        <nav aria-label="Kategori koleksi">
          <p className="px-3 mb-2 text-xs font-semibold text-stone-500">
            Jelajahi Koleksi
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeNav === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                      isActive
                        ? 'bg-stone-900 text-white font-medium'
                        : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 whitespace-nowrap">
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{item.label}</span>
                    </span>
                    <span
                      className={`font-mono text-xs tabular-nums ${
                        isActive ? 'text-stone-300' : 'text-stone-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div>
          <p className="px-3 mb-2 text-xs font-semibold text-stone-500">
            Tambah Cepat
          </p>
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => handleQuickAddClick('skripsi')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900 rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <Plus className="w-4 h-4 text-indigo-700 shrink-0" aria-hidden="true" />
              <span>Tambah Skripsi</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddClick('tugas_akhir')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900 rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <Plus className="w-4 h-4 text-teal-700 shrink-0" aria-hidden="true" />
              <span>Tambah Tugas Akhir</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickAddClick('buku_bacaan')}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 hover:text-stone-900 rounded-lg transition-colors duration-150 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <Plus className="w-4 h-4 text-amber-800 shrink-0" aria-hidden="true" />
              <span>Tambah Buku Bacaan</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-stone-200 bg-stone-50/70">
        <p className="text-xs font-semibold text-stone-800 mb-1.5">
          Cara Mudah Mengelola
        </p>
        <ol className="text-xs text-stone-600 space-y-1 leading-relaxed">
          <li>1. Pilih jenis karya saat menambah data.</li>
          <li>2. Lampirkan PDF atau tautan dokumen.</li>
          <li>3. Klik kartu untuk lihat detail & catatan.</li>
        </ol>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block shrink-0">{sidebarContent}</aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden flex">
          <div
            className="fixed inset-0 bg-stone-950/40 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-50 h-full">{sidebarContent}</div>
        </div>
      )}
    </>
  );
}
