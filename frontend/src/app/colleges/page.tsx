'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { collegesApi, College, CollegesResponse } from '@/lib/api';
import CollegeCard from '@/components/CollegeCard';
import clsx from 'clsx';

const SORT_OPTIONS = [
  { value: 'nirf_rank', label: 'NIRF Rank' },
  { value: 'rating', label: 'Rating' },
  { value: 'fees_low', label: 'Fees: Low to High' },
  { value: 'fees_high', label: 'Fees: High to Low' },
  { value: 'placement', label: 'Placement %' },
];

const FEE_RANGES = [
  { label: 'Any', min: 0, max: 99999999 },
  { label: 'Under ₹1L', min: 0, max: 100000 },
  { label: '₹1L–₹3L', min: 100000, max: 300000 },
  { label: '₹3L–₹6L', min: 300000, max: 600000 },
  { label: 'Above ₹6L', min: 600000, max: 99999999 },
];

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedFeeRange, setSelectedFeeRange] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [sort, setSort] = useState('nirf_rank');
  const [showFilters, setShowFilters] = useState(false);

  const [filterOptions, setFilterOptions] = useState<{ states: string[], types: string[], courses: string[] }>({
    states: [], types: [], courses: []
  });

  const searchDebounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Load filter options
  useEffect(() => {
    collegesApi.getFilters().then(r => setFilterOptions(r.data));
  }, []);

  // Debounce search
  useEffect(() => {
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 350);
  }, [search]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: '12',
        sort,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (selectedState) params.state = selectedState;
      if (selectedType) params.type = selectedType;
      if (selectedFeeRange > 0) {
        params.fees_min = FEE_RANGES[selectedFeeRange].min.toString();
        params.fees_max = FEE_RANGES[selectedFeeRange].max.toString();
      }
      if (selectedCourse) params.course = selectedCourse;

      const res = await collegesApi.list(params);
      const data: CollegesResponse = res.data;
      setColleges(data.colleges);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedState, selectedType, selectedFeeRange, selectedCourse, sort, page]);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const resetFilters = () => {
    setSelectedState('');
    setSelectedType('');
    setSelectedFeeRange(0);
    setSelectedCourse('');
    setPage(1);
  };

  const activeFilterCount = [selectedState, selectedType, selectedFeeRange > 0, selectedCourse].filter(Boolean).length;

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl shadow-card overflow-hidden">
      <div className="skeleton h-44" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-6 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="skeleton h-4 w-1/3" />
        <div className="skeleton h-10 mt-4" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink-950 mb-2">Explore Colleges</h1>
        <p className="text-ink-500">
          {total > 0 ? `Showing ${total} colleges` : 'Search and filter to find your ideal college'}
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 sticky top-16 z-10 bg-[#fafaf8] py-3">
        {/* Search */}
        <div className="flex-1 relative">
          <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by college name or city..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:search-focused transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
              <X size={15} />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => { setSort(e.target.value); setPage(1); }}
          className="px-4 py-3 bg-white border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-400 cursor-pointer"
        >
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={clsx(
            'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all',
            showFilters || activeFilterCount > 0
              ? 'bg-brand-50 border-brand-300 text-brand-700'
              : 'bg-white border-ink-200 text-ink-600 hover:bg-ink-50'
          )}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white border border-ink-200 rounded-2xl p-5 mb-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* State */}
            <div>
              <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">State</label>
              <select
                value={selectedState}
                onChange={e => { setSelectedState(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 bg-ink-50 border border-ink-200 rounded-lg text-sm outline-none focus:border-brand-400"
              >
                <option value="">All States</option>
                {filterOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">College Type</label>
              <select
                value={selectedType}
                onChange={e => { setSelectedType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 bg-ink-50 border border-ink-200 rounded-lg text-sm outline-none focus:border-brand-400"
              >
                <option value="">All Types</option>
                {filterOptions.types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Fees */}
            <div>
              <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Annual Fees</label>
              <div className="flex flex-wrap gap-1.5">
                {FEE_RANGES.map((range, i) => (
                  <button
                    key={i}
                    onClick={() => { setSelectedFeeRange(i); setPage(1); }}
                    className={clsx(
                      'px-2.5 py-1 rounded-lg text-xs font-medium border transition-all',
                      selectedFeeRange === i
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white text-ink-600 border-ink-200 hover:border-brand-300'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Course */}
            <div>
              <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Course</label>
              <select
                value={selectedCourse}
                onChange={e => { setSelectedCourse(e.target.value); setPage(1); }}
                className="w-full px-3 py-2.5 bg-ink-50 border border-ink-200 rounded-lg text-sm outline-none focus:border-brand-400"
              >
                <option value="">All Courses</option>
                {filterOptions.courses.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <div className="mt-4 pt-4 border-t border-ink-100">
              <button
                onClick={resetFilters}
                className="text-sm text-brand-600 hover:text-brand-800 font-medium flex items-center gap-1.5"
              >
                <X size={13} /> Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Results grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎓</div>
          <h3 className="font-display text-2xl text-ink-800 mb-2">No colleges found</h3>
          <p className="text-ink-500">Try adjusting your search or filters</p>
          <button onClick={resetFilters} className="mt-4 text-brand-600 font-medium hover:underline">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {colleges.map((college, i) => (
              <CollegeCard key={college.id} college={college} index={i} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center gap-2">
                    {i > 0 && arr[i - 1] !== p - 1 && <span className="text-ink-300">…</span>}
                    <button
                      onClick={() => setPage(p)}
                      className={clsx(
                        'w-9 h-9 rounded-lg text-sm font-medium transition-all',
                        p === page
                          ? 'bg-brand-600 text-white'
                          : 'border border-ink-200 text-ink-600 hover:bg-ink-50'
                      )}
                    >
                      {p}
                    </button>
                  </span>
                ))}

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
