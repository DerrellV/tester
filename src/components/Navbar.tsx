import { useState } from 'react';
import { Menu, Plus, X } from 'lucide-react';
import { NavFilter } from '../types/library';

interface NavbarProps {
  activeNav: NavFilter;
  onSelectNav: (nav: NavFilter) => void;
  onOpenAddModal: () => void;
  counts: {
    semua: number;
    skripsi: number;
    tugas_akhir: number;
    buku_bacaan: number;
    favorit: number;
  };
}

export function Navbar({
  activeNav,
  onSelectNav,
  onOpenAddModal,
  counts,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: NavFilter; label: string; count: number }[] = [
    { id: 'semua', label: 'Semua Koleksi', count: counts.semua },
    { id: 'skripsi', label: 'Skripsi', count: counts.skripsi },
    { id: 'tugas_akhir', label: 'Tugas Akhir', count: counts.tugas_akhir },
    { id: 'buku_bacaan', label: 'Buku Bacaan', count: counts.buku_bacaan },
    { id: 'favorit', label: 'Tersimpan', count: counts.favorit },
  ];

  const handleLinkClick = (id: NavFilter) => {
    onSelectNav(id);
    setMobileMenuOpen(false);
    const el = document.getElementById('katalog-utama');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border-hairline)] bg-[var(--bg-surface)]/95 backdrop-blur-sm transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onSelectNav('semua');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-serif text-xl font-bold tracking-tight text-[var(--text-primary)] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)] rounded"
        >
          Pustaka Karya
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Navigasi utama perpustakaan"
          className="hidden md:flex items-center gap-6 text-sm font-medium"
        >
          {navLinks.map((link) => {
            const active = activeNav === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative py-1.5 whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)] rounded ${
                  active
                    ? 'text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span>{link.label}</span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-[var(--accent-primary)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action (+ mobile menu toggle on small screens) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#1E3A8A] hover:bg-[#172554] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent-primary)]"
          >
            <Plus className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Tambah Koleksi</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="md:hidden p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg border border-[var(--border-hairline)] focus-visible:outline-2 focus-visible:outline-[var(--accent-primary)]"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Menu navigasi seluler"
          className="md:hidden border-t border-[var(--border-hairline)] bg-[var(--bg-surface)] px-4 py-3 space-y-1"
        >
          {navLinks.map((link) => {
            const active = activeNav === link.id;
            return (
              <button
                key={link.id}
                type="button"
                onClick={() => handleLinkClick(link.id)}
                className={`w-full flex items-center justify-between px-3 py-3 text-sm rounded-lg transition-colors min-h-[44px] ${
                  active
                    ? 'bg-[var(--bg-subtle)] text-[var(--text-primary)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]'
                }`}
              >
                <span className="whitespace-nowrap">{link.label}</span>
                <span className="font-mono text-xs tabular-nums text-[var(--text-muted)]">
                  {link.count}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}
