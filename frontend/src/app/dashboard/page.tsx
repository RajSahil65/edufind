'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { authApi, SavedCollege, SavedComparison, formatFees, formatPackage, typeColors } from '@/lib/api';
import { Bookmark, GitCompare, Trash2, ExternalLink, MapPin, Star, TrendingUp, IndianRupee, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';

type Tab = 'colleges' | 'comparisons';

export default function DashboardPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('colleges');
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push('/auth');
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      authApi.getSaved()
        .then(res => {
          setSavedColleges(res.data.savedColleges);
          setSavedComparisons(res.data.savedComparisons);
        })
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const unsaveCollege = async (id: string) => {
    await authApi.unsaveCollege(id);
    setSavedColleges(prev => prev.filter(c => c.id !== id));
  };

  const deleteComparison = async (id: string) => {
    await authApi.deleteComparison(id);
    setSavedComparisons(prev => prev.filter(c => c.id !== id));
  };

  if (authLoading || loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="h-8 w-48 skeleton rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 skeleton rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 page-enter">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold"
          style={{ backgroundColor: user?.avatar_color || '#6c47ff' }}
        >
          {initials}
        </div>
        <div>
          <h1 className="font-display text-3xl text-ink-950">My Dashboard</h1>
          <p className="text-ink-500 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-ink-100 p-1 rounded-xl w-fit mb-8">
        {[
          { key: 'colleges', label: 'Saved Colleges', icon: Bookmark, count: savedColleges.length },
          { key: 'comparisons', label: 'Saved Comparisons', icon: GitCompare, count: savedComparisons.length },
        ].map(({ key, label, icon: Icon, count }) => (
          <button
            key={key}
            onClick={() => setTab(key as Tab)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all',
              tab === key ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'
            )}
          >
            <Icon size={15} />
            {label}
            {count > 0 && (
              <span className={clsx('px-1.5 py-0.5 rounded-full text-xs font-bold', tab === key ? 'bg-brand-100 text-brand-700' : 'bg-ink-200 text-ink-600')}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Saved Colleges */}
      {tab === 'colleges' && (
        <>
          {savedColleges.length === 0 ? (
            <div className="text-center py-20 text-ink-400">
              <Bookmark size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No saved colleges yet</p>
              <p className="text-sm mb-6">Start browsing colleges and save your favourites here</p>
              <Link href="/colleges" className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
                <BookOpen size={15} /> Browse Colleges
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedColleges.map(college => (
                <div key={college.id} className="bg-white rounded-2xl shadow-card overflow-hidden flex flex-col">
                  <div className="relative h-36 bg-ink-100">
                    <img
                      src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'}
                      alt={college.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={clsx('chip absolute top-2 right-2', typeColors[college.type])}>{college.type}</div>
                    {college.nirf_rank && (
                      <div className="absolute top-2 left-2 bg-ink-950/90 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        NIRF #{college.nirf_rank}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <Link href={`/colleges/${college.id}`} className="font-display text-base text-ink-950 hover:text-brand-700 transition-colors line-clamp-2">
                      {college.name}
                    </Link>
                    <div className="flex items-center gap-1 text-ink-500 text-xs mt-1">
                      <MapPin size={11} /> {college.location}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-ink-600">
                      <span className="flex items-center gap-0.5"><IndianRupee size={10} />{formatFees(college.annual_fees_min)}/yr</span>
                      {college.placement_percentage && <span className="flex items-center gap-0.5"><Users size={10} />{college.placement_percentage}%</span>}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/colleges/${college.id}`}
                        className="flex-1 text-center py-1.5 text-xs font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                      >
                        View Details
                      </Link>
                      <button
                        onClick={() => unsaveCollege(college.id)}
                        className="px-2.5 py-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove from saved"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Saved Comparisons */}
      {tab === 'comparisons' && (
        <>
          {savedComparisons.length === 0 ? (
            <div className="text-center py-20 text-ink-400">
              <GitCompare size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No saved comparisons yet</p>
              <p className="text-sm mb-6">Compare colleges and save the comparison for later</p>
              <Link href="/compare" className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
                <GitCompare size={15} /> Compare Colleges
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedComparisons.map(comp => (
                <div key={comp.id} className="bg-white rounded-2xl shadow-card p-5 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-ink-900 mb-1">{comp.label || `Comparison — ${new Date(comp.created_at).toLocaleDateString('en-IN')}`}</div>
                    <div className="flex flex-wrap gap-2">
                      {(comp.colleges || []).map((c: any) => (
                        <span key={c.id} className={clsx('chip', typeColors[c.type])}>{c.name}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/compare?ids=${comp.college_ids.join(',')}`}
                      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      <ExternalLink size={13} /> View
                    </Link>
                    <button
                      onClick={() => deleteComparison(comp.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
