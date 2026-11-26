import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpDown,
  LayoutGrid,
  List,
  Menu,
  Plus,
  Search,
  X,
} from 'lucide-react';
import {
  CollectionType,
  LibraryItem,
  NavFilter,
  ReadingStatus,
  SortOption,
  ViewMode,
} from './types/library';
import {
  COLLECTION_META,
  loadLibraryItems,
  saveLibraryItems,
} from './data/seedItems';
import { Sidebar } from './components/Sidebar';
import { LibraryCard } from './components/LibraryCard';
import { LibraryTable } from './components/LibraryTable';
import { AddEditModal } from './components/AddEditModal';
import { DetailDrawer } from './components/DetailDrawer';

const NAV_TITLE: Record<NavFilter, string> = {
  semua: 'Semua Koleksi',
  skripsi: 'Skripsi',
  tugas_akhir: 'Tugas Akhir',
  buku_bacaan: 'Buku Bacaan',
  favorit: 'Koleksi Favorit',
};

export default function App() {
  const [items, setItems] = useState<LibraryItem[]>(() => loadLibraryItems());
  const [activeNav, setActiveNav] = useState<NavFilter>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('terbaru');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Modal & Drawer states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInitialType, setModalInitialType] =
    useState<CollectionType>('skripsi');
  const [editingItem, setEditingItem] = useState<LibraryItem | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Feedback toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveLibraryItems(items);
  }, [items]);

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

      if (!q) return true;

      const haystack = [
        item.title,
        item.author,
        String(item.year),
        item.programStudy,
        item.faculty,
        item.advisor,
        item.studentId,
        item.publisher,
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
  }, [items, activeNav, searchQuery, sortBy]);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedItemId) || null,
    [items, selectedItemId]
  );

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
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, personalNotes: notes || undefined, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const handleUpdateReadingStatus = (id: string, status: ReadingStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, readingStatus: status, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  return (
    <div id="top" className="min-h-screen flex bg-[#F8F8F6] text-stone-900">
      <Sidebar
        activeNav={activeNav}
        onSelectNav={setActiveNav}
        onQuickAdd={(type) => openAddModal(type)}
        counts={counts}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-stone-200 px-4 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Buka menu navigasi"
              className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0">
              <span className="text-stone-500 hidden sm:inline whitespace-nowrap">
                Repositori
              </span>
              <span className="text-stone-300 hidden sm:inline" aria-hidden="true">
                /
              </span>
              <h1 className="font-semibold text-stone-900 truncate">
                {NAV_TITLE[activeNav]}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={() => openAddModal()}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Tambah Koleksi</span>
          </button>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-8 space-y-6">
          {/* Welcome & Overview Strip */}
          <section className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Arsip Skripsi, Tugas Akhir & Buku Bacaan
                </h2>
                <p className="text-sm text-stone-600 mt-1.5 leading-relaxed">
                  Simpan referensi akademik dan daftar bacaan Anda di satu tempat.
                  Gunakan tombol <strong className="font-semibold text-stone-800">Tambah Koleksi</strong> di atas atau pilih kategori di bawah untuk mulai mencatat.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-4 sm:gap-8 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-stone-200 md:pl-8 shrink-0">
                <div>
                  <span className="block text-xs text-stone-500">Skripsi</span>
                  <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                    {counts.skripsi}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">Tugas Akhir</span>
                  <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                    {counts.tugas_akhir}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-stone-500">Buku</span>
                  <span className="text-2xl font-bold font-mono tabular-nums text-stone-900">
                    {counts.buku_bacaan}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Search, Segmented Tabs & Sort Controls */}
          <section aria-label="Pencarian dan filter" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search Box */}
              <div className="relative flex-1 max-w-xl">
                <Search
                  className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, nama penulis, NIM, pembimbing, atau topik..."
                  aria-label="Cari koleksi"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    aria-label="Hapus kata pencarian"
                    className="p-1 text-stone-400 hover:text-stone-700 absolute right-2.5 top-1/2 -translate-y-1/2 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort & View Toggle */}
              <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
                <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-3 py-2">
                  <ArrowUpDown
                    className="w-3.5 h-3.5 text-stone-500 shrink-0"
                    aria-hidden="true"
                  />
                  <label htmlFor="sort-select" className="sr-only">
                    Urutkan berdasarkan
                  </label>
                  <select
                    id="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    className="text-xs font-medium text-stone-700 bg-transparent focus:outline-none cursor-pointer"
                  >
                    <option value="terbaru">Ditambahkan Terbaru</option>
                    <option value="tahun_terbaru">Tahun Terbit Terbaru</option>
                    <option value="judul_az">Judul (A–Z)</option>
                  </select>
                </div>

                <div
                  className="flex items-center p-1 bg-stone-200/70 rounded-lg"
                  role="group"
                  aria-label="Mode tampilan"
                >
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    aria-label="Tampilan kartu"
                    aria-pressed={viewMode === 'grid'}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    aria-label="Tampilan tabel"
                    aria-pressed={viewMode === 'table'}
                    className={`p-1.5 rounded-md transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white text-stone-900 shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Segmented Filter Tabs */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="inline-flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg overflow-x-auto max-w-full">
                {(
                  [
                    { id: 'semua', label: 'Semua' },
                    { id: 'skripsi', label: 'Skripsi' },
                    { id: 'tugas_akhir', label: 'Tugas Akhir' },
                    { id: 'buku_bacaan', label: 'Buku Bacaan' },
                    { id: 'favorit', label: 'Favorit' },
                  ] as { id: NavFilter; label: string }[]
                ).map((tab) => {
                  const active = activeNav === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveNav(tab.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-indigo-600 ${
                        active
                          ? 'bg-white text-stone-900 shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-stone-500 tabular-nums whitespace-nowrap">
                Menampilkan {filteredItems.length} dari {items.length} koleksi
              </p>
            </div>
          </section>

          {/* Catalog Content */}
          {filteredItems.length === 0 ? (
            <section className="bg-white border border-stone-200 rounded-xl p-10 text-center space-y-4">
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-base font-semibold text-stone-900">
                  {searchQuery
                    ? 'Koleksi tidak ditemukan'
                    : 'Belum ada item di kategori ini'}
                </h3>
                <p className="text-sm text-stone-600">
                  {searchQuery
                    ? `Tidak ada data yang cocok dengan kata kunci "${searchQuery}". Coba kata kunci lain atau hapus filter.`
                    : 'Anda dapat langsung menambahkan skripsi, tugas akhir, atau buku bacaan baru sekarang.'}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-4 py-2 text-sm font-medium text-stone-700 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    Reset Pencarian
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openAddModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Koleksi</span>
                </button>
              </div>
            </section>
          ) : viewMode === 'grid' ? (
            <section
              aria-label="Daftar koleksi"
              className="grid grid-cols-1 xl:grid-cols-2 gap-4"
            >
              {filteredItems.map((item) => (
                <LibraryCard
                  key={item.id}
                  item={item}
                  onSelect={(clicked) => setSelectedItemId(clicked.id)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </section>
          ) : (
            <section aria-label="Tabel koleksi">
              <LibraryTable
                items={filteredItems}
                onSelect={(clicked) => setSelectedItemId(clicked.id)}
                onToggleFavorite={handleToggleFavorite}
              />
            </section>
          )}
        </main>
      </div>

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

      {/* Detail Slide-Over Drawer */}
      <DetailDrawer
        item={selectedItem}
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
          className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white text-sm font-medium px-4 py-3 rounded-lg shadow-lg border border-stone-800 flex items-center gap-3"
        >
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            aria-label="Tutup pemberitahuan"
            className="text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
