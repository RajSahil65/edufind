'use client';

import Link from 'next/link';
import { MapPin, Star, GitCompare, TrendingUp, IndianRupee, Users, Bookmark, BookmarkCheck } from 'lucide-react';
import { College, formatFees, formatPackage, typeColors, authApi } from '@/lib/api';
import { useCompare } from '@/context/CompareContext';
import { useAuth } from '@/context/AuthContext';
import clsx from 'clsx';
import { useState } from 'react';

interface CollegeCardProps {
  college: College;
  index?: number;
}

export default function CollegeCard({ college, index = 0 }: CollegeCardProps) {
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();
  const { isAuthenticated } = useAuth();
  const inCompare = isInCompare(college.id);
  const [saved, setSaved] = useState(false);
  const [savingToggle, setSavingToggle] = useState(false);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated || savingToggle) return;
    setSavingToggle(true);
    try {
      if (saved) {
        await authApi.unsaveCollege(college.id);
        setSaved(false);
      } else {
        await authApi.saveCollege(college.id);
        setSaved(true);
      }
    } finally {
      setSavingToggle(false);
    }
  };

  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div
      className="college-card bg-white rounded-2xl shadow-card hover:shadow-card-hover overflow-hidden flex flex-col"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-ink-100">
        <img
          src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=800'}
          alt={college.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        {college.nirf_rank && (
          <div className="absolute top-3 left-3 bg-ink-950/90 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            NIRF #{college.nirf_rank}
          </div>
        )}
        <div className={clsx('chip absolute top-3 right-3', typeColors[college.type])}>
          {college.type}
        </div>
        {/* Save button */}
        {isAuthenticated && (
          <button
            onClick={toggleSave}
            className={clsx(
              'absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all',
              saved ? 'bg-brand-600 text-white' : 'bg-white/90 text-ink-600 hover:bg-white'
            )}
            title={saved ? 'Unsave college' : 'Save college'}
          >
            {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <Link href={`/colleges/${college.id}`} className="group">
          <h3 className="font-display text-lg leading-snug text-ink-950 group-hover:text-brand-700 transition-colors line-clamp-2">
            {college.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1.5 mt-1.5 text-ink-500 text-sm">
          <MapPin size={13} />
          <span className="truncate">{college.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-0.5">
            {stars.map(s => (
              <Star
                key={s}
                size={12}
                className={s <= Math.round(college.rating) ? 'star-filled' : 'star-empty'}
              />
            ))}
          </div>
          <span className="text-sm font-semibold text-ink-800">{college.rating}</span>
          <span className="text-xs text-ink-400">({college.total_reviews?.toLocaleString()})</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-ink-100">
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-ink-400 mb-0.5">
              <IndianRupee size={10} />
              <span className="text-[10px] uppercase tracking-wider font-medium">Fees/yr</span>
            </div>
            <div className="text-sm font-semibold text-ink-800">
              {formatFees(college.annual_fees_min)}
            </div>
          </div>
          <div className="text-center border-x border-ink-100">
            <div className="flex items-center justify-center gap-0.5 text-ink-400 mb-0.5">
              <TrendingUp size={10} />
              <span className="text-[10px] uppercase tracking-wider font-medium">Avg Pkg</span>
            </div>
            <div className="text-sm font-semibold text-ink-800">
              {college.placement_avg_package ? formatPackage(college.placement_avg_package) : 'N/A'}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-0.5 text-ink-400 mb-0.5">
              <Users size={10} />
              <span className="text-[10px] uppercase tracking-wider font-medium">Placed</span>
            </div>
            <div className="text-sm font-semibold text-ink-800">
              {college.placement_percentage ? `${college.placement_percentage}%` : 'N/A'}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <Link
            href={`/colleges/${college.id}`}
            className="flex-1 py-2 text-center text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            View Details
          </Link>
          <button
            onClick={() => inCompare ? removeFromCompare(college.id) : addToCompare(college)}
            className={clsx(
              'px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              inCompare
                ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
            )}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            <GitCompare size={14} />
            {inCompare ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </div>
  );
}
