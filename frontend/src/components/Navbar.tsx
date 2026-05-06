'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import { GitCompare, BookOpen, BarChart3, GraduationCap, MessageSquare, User, LogOut, Bookmark, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { useState, useRef, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { compareList } = useCompare();
  const { user, logout, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const links = [
    { href: '/colleges', label: 'Colleges', icon: GraduationCap },
    { href: '/compare', label: 'Compare', icon: GitCompare },
    { href: '/predictor', label: 'Predictor', icon: BarChart3 },
    { href: '/qa', label: 'Q&A', icon: MessageSquare },
  ];

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-blur bg-white/90 border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-display text-xl text-ink-950">EduFind</span>
        </Link>

        <nav className="flex items-center gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                pathname.startsWith(href)
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
              )}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{label}</span>
              {href === '/compare' && compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {compareList.length}
                </span>
              )}
            </Link>
          ))}

          {isAuthenticated ? (
            <div className="relative ml-2" ref={dropRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-ink-50 transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: user?.avatar_color || '#6c47ff' }}
                >
                  {initials}
                </div>
                <span className="text-sm font-medium text-ink-800 hidden sm:inline">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={13} className="text-ink-400" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-ink-100 py-1.5 z-50">
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <Bookmark size={15} /> Saved Items
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <User size={15} /> Profile
                  </Link>
                  <div className="border-t border-ink-100 my-1" />
                  <button
                    onClick={() => { logout(); setDropdownOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700 transition-colors"
            >
              <User size={14} /> Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
