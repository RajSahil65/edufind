'use client';

import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';
import { GitCompare, X } from 'lucide-react';
import clsx from 'clsx';

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-ink-950 text-white rounded-2xl shadow-elevated px-5 py-3 flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <GitCompare size={16} className="text-brand-400" />
          <span className="text-ink-300">Comparing</span>
          {compareList.map(c => (
            <div key={c.id} className="flex items-center gap-1.5 bg-ink-800 rounded-lg px-2.5 py-1">
              <span className="text-xs text-white max-w-[100px] truncate">{c.name.split(' ').slice(0, 2).join(' ')}</span>
              <button
                onClick={() => removeFromCompare(c.id)}
                className="text-ink-400 hover:text-white transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))}
          {compareList.length < 3 && (
            <span className="text-xs text-ink-500 italic">
              +{3 - compareList.length} more
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={clearCompare}
            className="text-xs text-ink-400 hover:text-white transition-colors px-2 py-1"
          >
            Clear
          </button>
          <Link
            href="/compare"
            className={clsx(
              'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
              compareList.length >= 2
                ? 'bg-brand-600 hover:bg-brand-500 text-white'
                : 'bg-ink-700 text-ink-400 cursor-not-allowed'
            )}
          >
            <GitCompare size={14} />
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
