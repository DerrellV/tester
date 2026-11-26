import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  BookOpen,
  Calendar,
  Eye,
  Filter,
  LayoutGrid,
  List,
  Plus,
  RotateCcw,
  Search,
  Sun,
  Type,
  X,
} from 'lucide-react';
import {
  CollectionType,
  LibraryItem,
  NavFilter,
  ReadingStatus,
  SortOption,
  TextScale,
  ThemeMode,
  ViewMode,
  YearFilter,
} from './types/library';
import {
  COLLECTION_META,
  loadLibraryItems,
  saveLibraryItems,
} from './data/seedItems';
import { Navbar } from './components/Navbar';
import { LibraryCard } from './components/LibraryCard';
import { LibraryTable } from './components/LibraryTable';
import { AddEditModal } from './components/AddEditModal';
import { DetailDrawer } from './components/DetailDrawer';
import { ItemCover } from './components/ItemCover';

const HERO_IMAGE_URL = '/src/assets/images/hero_library_archive_1795676924240.jpg';
const PREF_THEME_KEY = 'pustaka_karya_theme_v1';
const PREF_TEXT_SCALE_KEY = 'pustaka_karya_text_scale_v1';
const RECENT_IDS_KEY = 'pustaka_karya_recent_ids_v1';

const NAV_TITLE: Record<NavFilter, string> = {
  semua: 'Semua Koleksi',
  skripsi: 'Koleksi Skripsi',
  tugas_akhir: 'Koleksi Tugas Akhir',
  buku_bacaan: 'Koleksi Buku Bacaan',
  favorit: 'Rak Tersimpan Anda',
};

export default function App() {
  const [items, setItems] = useState<LibraryItem[]>(() => loadLibraryItems());
  const [activeNav, setActiveNav] = useState<NavFilter>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState<YearFilter>('semua');
  const [topicFilter, setTopicFilter] = useState<string>('semua');
  const [sortBy, setSortBy] = useState<SortOption>('terbaru');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [heroImgError, setHeroImgError] = useState(false);

  // Visitor accessibility preferences
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(PREF_THEME_KEY);
      if (saved === 'light' || saved === 'sepia' || saved === 'dark') return saved;
    } catch {
      // ignore
    }
    return 'light';
  });

  const [textScale, setTextScale] = useState<TextScale>(() => {
    try {
      const saved = localStorage.getItem(PREF_TEXT_SCALE_KEY);
      if (saved === 'normal' || saved === 'large' || saved === 'xlarge') return saved;
    } catch {
      // ignore
    }
    return 'normal';
  });

  const [recentIds, setRecentIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_IDS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    return [];
  });

  // Modal & Drawer states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] =
    useState<CollectionType>('skripsi');
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [drawerInitialTab, setDrawerInitialTab] = useState<'info' | 'reader'>('info');

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveLibraryItems(items);
  }, [items]);

  // Apply visitor theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-sepia');
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else if (themeMode === 'sepia') {
      root.classList.add('theme-sepia');
    }
    try {
      localStorage.setItem(PREF_THEME_KEY, themeMode);
    } catch {
      // ignore
    }
  }, [themeMode]);

  // Apply visitor text scale class on <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-scale-normal', 'text-scale-large', 'text-scale-xlarge');
    root.classList.add(`text-scale-${textScale}`);
    try {
      localStorage.setItem(PREF_TEXT_SCALE_KEY, textScale);
    } catch {
      // ignore
    }
  }, [textScale]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_IDS_KEY, JSON.stringify(recentIds));
    } catch {
      // ignore
    }
  }, [recentIds]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3200);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const counts = useMemo(() => {
    return {
      semua: items.length,
      skripsi: items.filter((i) => i.type === 'skripsi').length,
      tugas_akhir: items.filter((i) => i.type === 'tugas_akhir').length,
      buku_bacaan: items.filter((i) => i.type === 'buku_bacaan').length,
      favorit: items.filter((i) => i.isFavorite).length,
    };
  }, [items]);

  // Unique fields/topics for dropdown filter
  const availableTopics = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.programStudy) set.add(item.programStudy);
      if (item.categoryTopic) set.add(item.categoryTopic);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id'));
  }, [items]);

  const featuredItems = useMemo(() => {
    const flagged = items.filter((i) => i.isFeatured);
    if (flagged.length >= 3) return flagged.slice(0, 3);
    return items.slice(0, 3);
  }, [items]);

  const recentItems = useMemo(() => {
    return recentIds
      .map((id) => items.find((i) => i.id === id))
      .filter((i): i is LibraryItem => Boolean(i))
      .slice(0, 4);
  }, [recentIds, items]);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matched = items.filter((item) => {
      if (activeNav === 'favorit' && !item.isFavorite) return false;
      if (
        activeNav !== 'semua' &&
        activeNav !== 'favorit' &&
        item.type !== activeNav
      ) {
        return false;
      }

      if (yearFilter === '2025_plus' && item.year < 2025) return false;
      if (yearFilter === '2024' && item.year !== 2024) return false;
      if (yearFilter === '2022_2023' && (item.year < 2022 || item.year > 2023)) {
        return false;
      }
      if (yearFilter === 'sebelum_2022' && item.year >= 2022) return false;

      if (topicFilter !== 'semua') {
        const matchesTopic =
          item.programStudy === topicFilter || item.categoryTopic === topicFilter;
        if (!matchesTopic) return false;
      }

      if (!q) return true;

      const haystack = [
        item.title,
        item.author,
        String(item.year),
        item.callNumber,
        item.programStudy,
        item.faculty,
        item.advisor,
        item.studentId,
        item.publisher,
        item.categoryTopic,
        item.isbn,
        item.abstractOrSummary,
        ...item.keywords,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(q);
    });

    return [...matched].sort((a, b) => {
      if (sortBy === 'judul_az') {
        return a.title.localeCompare(b.title, 'id');
      }
      if (sortBy === 'tahun_terbaru') {
        return b.year - a.year || b.createdAt.localeCompare(a.createdAt);
      }
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [items, activeNav, searchQuery, yearFilter, topicFilter, sortBy]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    yearFilter !== 'semua' ||
    topicFilter !== 'semua' ||
    activeNav !== 'semua';

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedItemId) || null,
    [items, selectedItemId]
  );

  const handleSelectItem = (
    item: LibraryItem,
    initialTab: 'info' | 'reader' = 'info'
  ) => {
    setDrawerInitialTab(initialTab);
    setSelectedItemId(item.id);
    setRecentIds((prev) => [item.id, ...prev.filter((id) => id !== item.id)].slice(0, 6));
  };

  const openAddModal = (preferredType?: CollectionType) => {
    const fallbackType: CollectionType =
      preferredType ||
      (activeNav === 'skripsi' ||
      activeNav === 'tugas_akhir' ||
      activeNav === 'buku_bacaan'
        ? activeNav
        : 'skripsi');

    setEditingItem(null);
    setModalInitialType(fallbackType);
    setModalOpen(true);
  };

  const openEditModal = (item: LibraryItem) => {
    setSelectedItemId(null);
    setEditingItem(item);
    setModalInitialType(item.type);
    setModalOpen(true);
  };

  const handleSaveItem = (
    itemData: Omit<LibraryItem, 'id' | 'createdAt' | 'updatedAt'>,
    editingId?: string
  ) => {
    const now = new Date().toISOString();

    if (editingId) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...item, ...itemData, updatedAt: now }
            : item
        )
      );
      setModalOpen(false);
      setEditingItem(null);
      setSelectedItemId(editingId);
      showToast('Perubahan data koleksi berhasil disimpan.');
      return;
    }

    const newItem: LibraryItem = {
      ...itemData,
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      createdAt: now,
      updatedAt: now,
    };

    setItems((prev) => [newItem, ...prev]);
    setModalOpen(false);
    showToast(`${COLLECTION_META[newItem.type].label} baru berhasil ditambahkan.`);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedItemId(null);
    showToast('Koleksi telah dihapus dari daftar.');
  };

  const handleToggleFavorite = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextFav = !item.isFavorite;
        showToast(
          nextFav
            ? 'Disimpan ke Rak Tersimpan Anda.'
            : 'Dihapus dari Rak Tersimpan.'
        );
        return { ...item, isFavorite: nextFav };
      })
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              personalNotes: notes || undefined,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleUpdateReadingStatus = (id: string, status: ReadingStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              readingStatus: status,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const resetAllFilters = () => {
    setActiveNav('semua');
    setSearchQuery('');
    setYearFilter('semua');
    setTopicFilter('semua');
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('katalog-utama');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    scrollToCatalog();
  };

  const handleQuickTopicSearch = (keyword: string) => {
    setActiveNav('semua');
    setSearchQuery(keyword);
    scrollToCatalog();
  };

  return (
    <div id="top" className="min-h-screen flex flex-col">
      {/* Skip to content link for keyboard & screen-reader visitors */}
      <a
        href="#katalog-utama"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:bg-[#1E3A8A] focus:text-white focus:rounded-lg"
      >
        Langsung ke Katalog Koleksi
      </a>

      <Navbar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onOpenAddModal={() => openAddModal()}
        counts={counts}
      />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-8 sm:py-10 space-y-10">
        {/* 1. Hero & Search Gateway */}
        <section aria-label="Pengantar Perpustakaan" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left: Editorial Intro & Search */}
            <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl p-6 sm:p-8 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)]">
                  Perpustakaan Digital Terbuka
                </p>
                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--text-primary)] tracking-tight leading-[1.15]">
                  Ruang Baca Skripsi, Tugas Akhir, dan Buku Pilihan
                </h1>
                <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                  Dirancang untuk seluruh pengunjung—mulai dari mahasiswa, peneliti,
                  hingga pembaca umum. Telusuri katalog, baca cuplikan naskah
                  langsung di layar, salin sitasi instan, dan atur kenyamanan mata Anda.
                </p>
              </div>

              <div className="space-y-3">
                <form
                  onSubmit={handleHeroSearchSubmit}
                  className="flex flex-col sm:flex-row gap-2.5"
                >
                  <div className="relative flex-1">
                    <Search
                      className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari judul karya, penulis, topik, atau NIM..."
                      aria-label="Cari koleksi perpustakaan"
                      className="w-full pl-10 pr-9 py-2.5 min-h-[44px] text-sm bg-[var(--bg-canvas)] text-[var(--text-primary)] border border-[var(--border-strong)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/20 focus:border-[var(--accent-primary)]"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        aria-label="Hapus pencarian"
                        className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] absolute right-2 top-1/2 -translate-y-1/2 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 min-h-[44px] text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
                  >
                    Telusuri Katalog
                  </button>
                </form>

                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--text-muted)]">
                  <span>Topik populer:</span>
                  {['Desain UX', 'TF-IDF', 'Metodologi', 'IoT', 'Arsitektur'].map(
                    (topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => handleQuickTopicSearch(topic)}
                        className="text-[var(--text-secondary)] hover:text-[var(--accent-text)] underline underline-offset-4 decoration-[var(--border-strong)] transition-colors"
                      >
                        {topic}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Right: Architectural Library Reading Room Visual */}
            <div className="lg:col-span-5 relative min-h-[240px] rounded-xl overflow-hidden border border-[var(--border-hairline)] bg-[var(--bg-subtle)]">
              {!heroImgError ? (
                <img
                  src={HERO_IMAGE_URL}
                  alt="Suasana ruang baca perpustakaan Pustaka Karya yang tenang dengan rak kayu dan cahaya alami"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgError(true)}
                  className="w-full h-full lg:h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
                  <BookOpen
                    className="w-10 h-10 text-[var(--text-muted)] mb-2"
                    aria-hidden="true"
                  />
                  <p className="font-serif text-base font-semibold text-[var(--text-primary)]">
                    Ruang Baca Pustaka Karya
                  </p>
                </div>
              )}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
              />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="font-serif text-base font-semibold leading-snug">
                  Akses Pengetahuan Terbuka untuk Semua
                </p>
                <p className="text-xs text-stone-200 mt-1">
                  Baca abstrak & cuplikan naskah gratis tanpa perlu masuk akun
                </p>
              </div>
            </div>
          </div>

          {/* Operational Utility & Visitor Comfort Ribbon */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl px-5 py-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Collection Summary Metrics */}
            <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                {counts.semua} Koleksi Tersedia
              </span>
              <span aria-hidden="true" className="text-[var(--text-muted)]">
                ·
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveNav('skripsi');
                  scrollToCatalog();
                }}
                className="hover:text-[var(--accent-text)] transition-colors tabular-nums"
              >
                {counts.skripsi} Skripsi
              </button>
              <span aria-hidden="true" className="text-[var(--text-muted)]">
                ·
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveNav('tugas_akhir');
                  scrollToCatalog();
                }}
                className="hover:text-[var(--accent-text)] transition-colors tabular-nums"
              >
                {counts.tugas_akhir} Tugas Akhir
              </button>
              <span aria-hidden="true" className="text-[var(--text-muted)]">
                ·
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveNav('buku_bacaan');
                  scrollToCatalog();
                }}
                className="hover:text-[var(--accent-text)] transition-colors tabular-nums"
              >
                {counts.buku_bacaan} Buku Bacaan
              </button>
            </div>

            {/* Accessibility Controls: Font Scale & Reading Theme */}
            <div className="flex items-center flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                  <Type className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Ukuran Huruf:</span>
                </span>
                <div
                  className="inline-flex items-center p-0.5 bg-[var(--bg-subtle)] rounded-lg"
                  role="group"
                  aria-label="Pengaturan ukuran huruf"
                >
                  {(
                    [
                      { id: 'normal', label: 'Normal' },
                      { id: 'large', label: 'Besar' },
                      { id: 'xlarge', label: 'Ekstra' },
                    ] as { id: TextScale; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setTextScale(opt.id)}
                      aria-pressed={textScale === opt.id}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        textScale === opt.id
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] whitespace-nowrap">
                  <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Tema Baca:</span>
                </span>
                <div
                  className="inline-flex items-center p-0.5 bg-[var(--bg-subtle)] rounded-lg"
                  role="group"
                  aria-label="Pengaturan tema warna baca"
                >
                  {(
                    [
                      { id: 'light', label: 'Terang' },
                      { id: 'sepia', label: 'Sepia' },
                      { id: 'dark', label: 'Gelap' },
                    ] as { id: ThemeMode; label: string }[]
                  ).map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setThemeMode(opt.id)}
                      aria-pressed={themeMode === opt.id}
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                        themeMode === opt.id
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Curated Highlights (Shown on default overview without active filter) */}
        {!hasActiveFilters && featuredItems.length > 0 && (
          <section aria-label="Sorotan Koleksi Pilihan" className="space-y-4">
            <div className="flex items-baseline justify-between gap-4 border-b border-[var(--border-hairline)] pb-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  Pilihan Kurator Minggu Ini
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5">
                  Rekomendasi karya ilmiah dan buku bacaan yang paling sering diakses pengunjung
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              {featuredItems.map((item) => {
                const meta = COLLECTION_META[item.type];
                return (
                  <article
                    key={item.id}
                    className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-xl p-4 sm:p-5 flex gap-4 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleSelectItem(item, 'info')}
                      className="w-20 aspect-[3/4] shrink-0 rounded-lg overflow-hidden focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
                      aria-label={`Buka ${item.title}`}
                    >
                      <ItemCover
                        type={item.type}
                        title={item.title}
                        author={item.author}
                        year={item.year}
                        callNumber={item.callNumber}
                        coverUrl={item.coverUrl}
                        className="w-full h-full rounded-lg"
                      />
                    </button>

                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-xs text-[var(--text-muted)] mb-1">
                          <span className={`font-semibold ${meta.accentClass}`}>
                            {meta.label}
                          </span>
                          <span aria-hidden="true"> · </span>
                          <span className="font-mono tabular-nums">{item.year}</span>
                        </p>
                        <h3 className="font-serif text-base font-semibold text-[var(--text-primary)] leading-snug line-clamp-2">
                          <button
                            type="button"
                            onClick={() => handleSelectItem(item, 'info')}
                            className="text-left hover:text-[var(--accent-text)] transition-colors"
                          >
                            {item.title}
                          </button>
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] truncate mt-1">
                          {item.author}
                        </p>
                      </div>

                      <div className="pt-2.5 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleSelectItem(item, 'reader')}
                          className="text-xs font-semibold text-[var(--accent-text)] hover:underline whitespace-nowrap"
                        >
                          Baca Cuplikan
                        </button>
                        <span aria-hidden="true" className="text-[var(--border-strong)]">
                          ·
                        </span>
                        <button
                          type="button"
                          onClick={() => handleSelectItem(item, 'info')}
                          className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] whitespace-nowrap"
                        >
                          Detail
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* 3. Main Interactive Catalog */}
        <section
          id="katalog-utama"
          aria-label="Katalog Koleksi Perpustakaan"
          className="space-y-5 scroll-mt-20"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[var(--border-hairline)] pb-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-[var(--text-primary)]">
                {NAV_TITLE[activeNav]}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-0.5 tabular-nums">
                Menampilkan {filteredItems.length} dari {items.length} koleksi di perpustakaan
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent-text)] hover:underline self-start sm:self-auto whitespace-nowrap"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>

          {/* Segmented Category Tabs + Filter Controls */}
          <div className="space-y-3">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Category Tabs */}
              <div
                className="inline-flex items-center gap-1 p-1 bg-[var(--bg-subtle)] rounded-lg overflow-x-auto max-w-full"
                role="tablist"
                aria-label="Kategori koleksi"
              >
                {(
                  [
                    { id: 'semua', label: 'Semua', count: counts.semua },
                    { id: 'skripsi', label: 'Skripsi', count: counts.skripsi },
                    {
                      id: 'tugas_akhir',
                      label: 'Tugas Akhir',
                      count: counts.tugas_akhir,
                    },
                    {
                      id: 'buku_bacaan',
                      label: 'Buku Bacaan',
                      count: counts.buku_bacaan,
                    },
                    {
                      id: 'favorit',
                      label: 'Rak Tersimpan',
                      count: counts.favorit,
                    },
                  ] as { id: NavFilter; label: string; count: number }[]
                ).map((tab) => {
                  const active = activeNav === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setActiveNav(tab.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)] ${
                        active
                          ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs font-semibold'
                          : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <span>{tab.label}</span>{' '}
                      <span className="font-mono tabular-nums text-[var(--text-muted)] ml-0.5">
                        ({tab.count})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Filters: Year, Topic, Sort, View Toggle */}
              <div className="flex items-center flex-wrap gap-2">
                <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg px-2.5 py-2 min-h-[40px]">
                  <Calendar
                    className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0"
                    aria-hidden="true"
                  />
                  <label htmlFor="year-filter" className="sr-only">
                    Filter tahun terbit
                  </label>
                  <select
                    id="year-filter"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value as YearFilter)}
                    className="text-xs font-medium text-[var(--text-primary)] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="semua">Semua Tahun</option>
                    <option value="2025_plus">2025 ke atas</option>
                    <option value="2024">Tahun 2024</option>
                    <option value="2022_2023">2022 – 2023</option>
                    <option value="sebelum_2022">Sebelum 2022</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg px-2.5 py-2 min-h-[40px] max-w-[200px]">
                  <Filter
                    className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0"
                    aria-hidden="true"
                  />
                  <label htmlFor="topic-filter" className="sr-only">
                    Filter bidang atau prodi
                  </label>
                  <select
                    id="topic-filter"
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="text-xs font-medium text-[var(--text-primary)] bg-transparent focus:outline-none cursor-pointer truncate w-full"
                  >
                    <option value="semua">Semua Bidang / Prodi</option>
                    {availableTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-lg px-2.5 py-2 min-h-[40px]">
                  <ArrowUpDown
                    className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0"
                    aria-hidden="true"
                  />
                  <label htmlFor="sort-select" className="sr-only">
                    Urutkan berdasarkan
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="text-xs font-medium text-[var(--text-primary)] bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="terbaru">Ditambahkan Terbaru</option>
                    <option value="tahun_terbaru">Tahun Terbit Terbaru</option>
                    <option value="judul_az">Judul (A–Z)</option>
                  </select>
                </div>

                <div
                  className="flex items-center p-1 bg-[var(--bg-subtle)] rounded-lg"
                  role="group"
                  aria-label="Mode tampilan katalog"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Tampilan kartu"
                    aria-pressed={viewMode === 'grid'}
                    className={`p-1.5 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    aria-label="Tampilan tabel"
                    aria-pressed={viewMode === 'table'}
                    className={`p-1.5 min-w-[34px] min-h-[34px] flex items-center justify-center rounded-md transition-colors ${
                      viewMode === 'table'
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-xs'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Catalog Items or Empty State */}
          {filteredItems.length === 0 ? (
            <div className="bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded-xl p-10 text-center space-y-4">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="font-serif text-lg font-semibold text-[var(--text-primary)]">
                  {activeNav === 'favorit' && !searchQuery
                    ? 'Rak Tersimpan Anda masih kosong'
                    : 'Koleksi yang dicari belum ditemukan'}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {activeNav === 'favorit' && !searchQuery
                    ? 'Klik ikon penanda buku pada skripsi, tugas akhir, atau buku bacaan mana pun untuk menyimpannya di sini.'
                    : 'Tidak ada koleksi yang sesuai dengan kombinasi filter atau kata kunci saat ini. Anda dapat mengatur ulang filter atau menambahkan koleksi baru.'}
                </p>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-3 pt-1">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="px-4 py-2 text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-lg hover:bg-[var(--bg-subtle)] transition-colors"
                  >
                    Tampilkan Semua Koleksi
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openAddModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Tambah Koleksi</span>
                </button>
              </div>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <LibraryCard
                  key={item.id}
                  item={item}
                  onSelect={handleSelectItem}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <LibraryTable
              items={filteredItems}
              onSelect={handleSelectItem}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </section>

        {/* 4. Recently Viewed by Visitor */}
        {recentItems.length > 0 && (
          <section aria-label="Terakhir Dilihat Pengunjung" className="space-y-3 pt-2">
            <div className="flex items-center justify-between gap-4 border-b border-[var(--border-hairline)] pb-2.5">
              <h2 className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                <Eye className="w-4 h-4 text-[var(--text-muted)]" aria-hidden="true" />
                <span>Terakhir Anda Buka</span>
              </h2>
              <button
                type="button"
                onClick={() => setRecentIds([])}
                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                Bersihkan Riwayat
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectItem(item, 'info')}
                  className="text-left p-3.5 bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--border-strong)] rounded-lg transition-colors space-y-1"
                >
                  <p className="text-[11px] font-medium text-[var(--text-muted)]">
                    {COLLECTION_META[item.type].label} ·{' '}
                    <span className="font-mono tabular-nums">{item.year}</span>
                  </p>
                  <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">
                    {item.title}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {item.author}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Quiet Institutional Footer */}
      <footer className="border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-md space-y-1.5">
            <p className="font-serif text-base font-bold text-[var(--text-primary)]">
              Pustaka Karya
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Perpustakaan digital terbuka untuk semua pengunjung. Mendukung pembacaan
              nyaman dengan pilihan tema Terang, Sepia, Gelap serta penyesuaian ukuran
              huruf.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-[var(--text-secondary)]">
            <button
              type="button"
              onClick={() => {
                setActiveNav('skripsi');
                scrollToCatalog();
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Skripsi
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('tugas_akhir');
                scrollToCatalog();
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Tugas Akhir
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('buku_bacaan');
                scrollToCatalog();
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Buku Bacaan
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveNav('favorit');
                scrollToCatalog();
              }}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              Rak Tersimpan
            </button>
            <button
              type="button"
              onClick={() => openAddModal()}
              className="text-[var(--accent-text)] hover:underline"
            >
              Sumbang / Tambah Koleksi
            </button>
          </div>
        </div>
      </footer>

      {/* Add / Edit Modal */}
      <AddEditModal
        isOpen={modalOpen}
        initialType={modalInitialType}
        editingItem={editingItem}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSaveItem}
      />

      {/* Detail & Reader Drawer */}
      <DetailDrawer
        item={selectedItem}
        initialTab={drawerInitialTab}
        onClose={() => setSelectedItemId(null)}
        onEdit={openEditModal}
        onDelete={handleDeleteItem}
        onToggleFavorite={handleToggleFavorite}
        onUpdateNotes={handleUpdateNotes}
        onUpdateReadingStatus={handleUpdateReadingStatus}
      />

      {/* Non-Intrusive Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-medium px-4 py-3 rounded-lg shadow-lg border border-stone-800 dark:border-stone-300 flex items-center gap-3"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Tutup pemberitahuan"
            className="opacity-70 hover:opacity-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
