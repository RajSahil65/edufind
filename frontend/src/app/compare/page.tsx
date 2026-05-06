'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, GitCompare, Search, Plus, TrendingUp, IndianRupee, Star, Users, MapPin, Award, Trophy, Bookmark, Check } from 'lucide-react';
import { collegesApi, authApi, College, formatFees, formatPackage, typeColors } from '@/lib/api';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';

export default function ComparePage() {
  const { compareList, addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const [compareData, setCompareData] = useState<College[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<College[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);
  const [comparisonSaved, setComparisonSaved] = useState(false);

  // Fetch full compare data when compareList changes
  useEffect(() => {
    if (compareList.length === 0) {
      setCompareData([]);
      return;
    }
    setLoading(true);
    const ids = compareList.map(c => c.id);
    collegesApi.compare(ids)
      .then(res => setCompareData(res.data.colleges))
      .finally(() => setLoading(false));
  }, [compareList]);

  // Search for colleges to add
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await collegesApi.list({ search: searchQuery, limit: '6' });
        setSearchResults(res.data.colleges.filter(c => !isInCompare(c.id)));
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, isInCompare]);

  const saveComparison = async () => {
    if (!isAuthenticated || compareList.length < 2) return;
    setSavingComparison(true);
    try {
      const label = compareData.map(c => c.name.split(' ').slice(0, 2).join(' ')).join(' vs ');
      await authApi.saveComparison(compareList.map(c => c.id), label);
      setComparisonSaved(true);
      setTimeout(() => setComparisonSaved(false), 3000);
    } finally {
      setSavingComparison(false);
    }
  };

  const metrics = [
    {
      key: 'type',
      label: 'Type',
      render: (c: College) => <span className={clsx('chip', typeColors[c.type])}>{c.type}</span>,
    },
    {
      key: 'location',
      label: 'Location',
      icon: MapPin,
      render: (c: College) => c.location,
    },
    {
      key: 'nirf_rank',
      label: 'NIRF Rank',
      icon: Trophy,
      render: (c: College) => c.nirf_rank ? `#${c.nirf_rank}` : 'N/A',
      best: (vals: (College)[]) => vals.reduce((best, c) => (!best || (c.nirf_rank && c.nirf_rank < best.nirf_rank!)) ? c : best, vals[0])?.id,
    },
    {
      key: 'rating',
      label: 'Rating',
      icon: Star,
      render: (c: College) => (
        <div className="flex items-center gap-1.5">
          <span className="font-semibold">{c.rating}</span>
          <div className="flex">
            {Array.from({length: 5}, (_, i) => (
              <Star key={i} size={11} className={i < Math.round(c.rating) ? 'star-filled' : 'star-empty'} />
            ))}
          </div>
        </div>
      ),
      best: (vals: College[]) => vals.reduce((best, c) => c.rating > (best?.rating || 0) ? c : best, vals[0])?.id,
    },
    {
      key: 'annual_fees_min',
      label: 'Annual Fees',
      icon: IndianRupee,
      render: (c: College) => `${formatFees(c.annual_fees_min)} – ${formatFees(c.annual_fees_max)}`,
      best: (vals: College[]) => vals.reduce((best, c) => c.annual_fees_min < (best?.annual_fees_min || Infinity) ? c : best, vals[0])?.id,
      bestLabel: 'Lowest',
    },
    {
      key: 'placement_percentage',
      label: 'Placement Rate',
      icon: Users,
      render: (c: College) => c.placement_percentage ? `${c.placement_percentage}%` : 'N/A',
      best: (vals: College[]) => vals.reduce((best, c) => (c.placement_percentage || 0) > (best?.placement_percentage || 0) ? c : best, vals[0])?.id,
      bestLabel: 'Highest',
    },
    {
      key: 'placement_avg_package',
      label: 'Avg Package',
      icon: TrendingUp,
      render: (c: College) => c.placement_avg_package ? formatPackage(c.placement_avg_package) : 'N/A',
      best: (vals: College[]) => vals.reduce((best, c) => (c.placement_avg_package || 0) > (best?.placement_avg_package || 0) ? c : best, vals[0])?.id,
      bestLabel: 'Highest',
    },
    {
      key: 'placement_highest_package',
      label: 'Highest Package',
      icon: Award,
      render: (c: College) => c.placement_highest_package ? formatPackage(c.placement_highest_package) : 'N/A',
      best: (vals: College[]) => vals.reduce((best, c) => (c.placement_highest_package || 0) > (best?.placement_highest_package || 0) ? c : best, vals[0])?.id,
    },
    {
      key: 'total_seats',
      label: 'Total Seats',
      render: (c: College) => c.total_seats?.toLocaleString() || 'N/A',
    },
    {
      key: 'established',
      label: 'Established',
      render: (c: College) => c.established || 'N/A',
    },
    {
      key: 'accreditation',
      label: 'Accreditation',
      render: (c: College) => (
        <span className="chip bg-green-50 text-green-700 border-green-200">{c.accreditation}</span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink-950 mb-2">Compare Colleges</h1>
        <p className="text-ink-500">Select up to 3 colleges to compare side by side</p>
      </div>

      {/* Selected colleges + Add slot */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {compareList.map(college => (
          <div
            key={college.id}
            className="flex-shrink-0 w-52 bg-white rounded-2xl border border-ink-200 overflow-hidden shadow-card"
          >
            <div className="relative h-28">
              <img
                src={college.image_url}
                alt={college.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
              <button
                onClick={() => removeFromCompare(college.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full flex items-center justify-center text-white transition-all"
              >
                <X size={12} />
              </button>
            </div>
            <div className="p-3">
              <div className={clsx('chip text-[9px] mb-1.5', typeColors[college.type])}>{college.type}</div>
              <div className="text-sm font-semibold text-ink-900 leading-tight line-clamp-2">{college.name}</div>
              <div className="text-xs text-ink-400 mt-1 flex items-center gap-1">
                <MapPin size={10} /> {college.city}
              </div>
            </div>
          </div>
        ))}

        {/* Add slot */}
        {compareList.length < 3 && (
          <div className="flex-shrink-0 w-52">
            {showSearch ? (
              <div className="bg-white rounded-2xl border border-brand-300 overflow-hidden shadow-card">
                <div className="p-3 border-b border-ink-100">
                  <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-400" />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search college..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-ink-50 rounded-lg outline-none focus:bg-white border border-ink-200 focus:border-brand-400 transition-all"
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {searching ? (
                    <div className="p-3 text-xs text-ink-400 text-center">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { addToCompare(c); setShowSearch(false); setSearchQuery(''); }}
                        className="w-full text-left px-3 py-2.5 hover:bg-brand-50 transition-colors border-b border-ink-50 last:border-0"
                      >
                        <div className="text-xs font-medium text-ink-800 line-clamp-1">{c.name}</div>
                        <div className="text-[10px] text-ink-400">{c.city}</div>
                      </button>
                    ))
                  ) : searchQuery.length >= 2 ? (
                    <div className="p-3 text-xs text-ink-400 text-center">No results found</div>
                  ) : (
                    <div className="p-3 text-xs text-ink-400 text-center">Type to search...</div>
                  )}
                </div>
                <div className="p-2 border-t border-ink-100">
                  <button onClick={() => setShowSearch(false)} className="w-full text-xs text-ink-500 py-1">Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-full h-full min-h-40 border-2 border-dashed border-ink-200 hover:border-brand-400 rounded-2xl flex flex-col items-center justify-center gap-2 text-ink-400 hover:text-brand-600 transition-all group"
              >
                <Plus size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Add College</span>
              </button>
            )}
          </div>
        )}

        {compareList.length === 0 && !showSearch && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
            <GitCompare size={48} className="text-ink-200 mb-4" />
            <h3 className="font-display text-xl text-ink-600 mb-2">No colleges selected</h3>
            <p className="text-ink-400 text-sm mb-4">Add colleges from search or browse listings</p>
            <Link href="/colleges" className="text-sm text-brand-600 font-medium hover:underline">
              Browse Colleges →
            </Link>
          </div>
        )}
      </div>

      {/* Comparison table */}
      {compareData.length >= 2 && !loading && (
        <div className="bg-white rounded-2xl shadow-elevated overflow-hidden animate-fade-in">
          {/* Save comparison bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-ink-100 bg-ink-50">
            <span className="text-sm text-ink-500">Comparing {compareData.length} colleges</span>
            {isAuthenticated ? (
              <button
                onClick={saveComparison}
                disabled={savingComparison || comparisonSaved}
                className={clsx(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                  comparisonSaved
                    ? 'bg-green-100 text-green-700'
                    : 'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60'
                )}
              >
                {comparisonSaved ? <><Check size={13} /> Saved!</> : <><Bookmark size={13} /> Save Comparison</>}
              </button>
            ) : (
              <Link href="/auth" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-ink-200 text-ink-600 hover:bg-ink-300 transition-colors">
                <Bookmark size={13} /> Sign in to Save
              </Link>
            )}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="compare-table">
                  <th className="text-left p-5 w-44 border-b border-r border-ink-100">Metric</th>
                  {compareData.map(c => (
                    <th key={c.id} className="p-5 border-b border-r border-ink-100 last:border-r-0">
                      <div className="text-sm font-display font-normal text-ink-900 text-left">{c.name}</div>
                      <div className="text-xs text-ink-400 font-normal mt-0.5 text-left">{c.city}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, mi) => {
                  const bestId = metric.best ? metric.best(compareData) : null;
                  return (
                    <tr key={metric.key} className={mi % 2 === 0 ? 'bg-white' : 'bg-ink-50/50'}>
                      <td className="p-5 border-r border-ink-100">
                        <div className="flex items-center gap-2 text-ink-600">
                          {metric.icon && <metric.icon size={14} className="shrink-0" />}
                          <span className="text-sm font-medium">{metric.label}</span>
                        </div>
                        {bestId && metric.bestLabel && (
                          <div className="text-[9px] text-green-600 font-semibold uppercase tracking-wider mt-0.5 pl-5">
                            ↑ {metric.bestLabel}
                          </div>
                        )}
                      </td>
                      {compareData.map(c => (
                        <td
                          key={c.id}
                          className={clsx(
                            'p-5 border-r border-ink-100 last:border-r-0 text-sm',
                            bestId === c.id && 'bg-green-50'
                          )}
                        >
                          <div className="flex items-center gap-1.5">
                            {bestId === c.id && (
                              <span className="text-green-500 text-xs">★</span>
                            )}
                            <span className={clsx('text-ink-800', bestId === c.id && 'font-semibold text-green-800')}>
                              {metric.render(c)}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="p-4 bg-ink-50 border-t border-ink-100 flex items-center gap-3 text-xs text-ink-500">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-4 bg-green-50 border border-green-200 rounded inline-block" />
              <span>Best value in category</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-green-500">★</span>
              <span>Winner for this metric</span>
            </div>
          </div>
        </div>
      )}

      {compareData.length === 1 && (
        <div className="text-center py-10 text-ink-400">
          <p>Add at least one more college to start comparing</p>
        </div>
      )}
    </div>
  );
}
