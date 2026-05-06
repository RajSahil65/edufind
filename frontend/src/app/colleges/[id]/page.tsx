'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin, Star, TrendingUp, IndianRupee, Users, Building2, Award,
  ChevronLeft, GitCompare, ExternalLink, BookOpen, Briefcase, MessageSquare
} from 'lucide-react';
import { collegesApi, College, Course, Review, formatFees, formatPackage, typeColors } from '@/lib/api';
import { useCompare } from '@/context/CompareContext';
import clsx from 'clsx';

type Tab = 'overview' | 'courses' | 'placements' | 'reviews';

export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [college, setCollege] = useState<College | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const { addToCompare, removeFromCompare, isInCompare } = useCompare();

  useEffect(() => {
    if (!id) return;
    collegesApi.getById(id).then(res => {
      setCollege(res.data.college);
      setCourses(res.data.courses);
      setReviews(res.data.reviews);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="skeleton h-72 rounded-2xl mb-6" />
        <div className="grid grid-cols-3 gap-4">
          <div className="skeleton h-32 rounded-xl col-span-2" />
          <div className="skeleton h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!college) return (
    <div className="text-center py-20">
      <div className="text-5xl mb-4">😕</div>
      <h2 className="font-display text-2xl">College not found</h2>
      <Link href="/colleges" className="text-brand-600 mt-4 block">← Back to colleges</Link>
    </div>
  );

  const inCompare = isInCompare(college.id);
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: Building2 },
    { id: 'courses' as Tab, label: `Courses (${courses.length})`, icon: BookOpen },
    { id: 'placements' as Tab, label: 'Placements', icon: Briefcase },
    { id: 'reviews' as Tab, label: `Reviews (${reviews.length})`, icon: MessageSquare },
  ];

  return (
    <div className="page-enter">
      {/* Hero banner */}
      <div className="relative h-72 overflow-hidden bg-ink-900">
        <img
          src={college.image_url || 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200'}
          alt={college.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-900/40 to-transparent" />

        {/* Back button */}
        <Link
          href="/colleges"
          className="absolute top-6 left-6 flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-lg px-3 py-2 text-sm transition-all"
        >
          <ChevronLeft size={16} /> Back
        </Link>

        {/* College info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={clsx('chip', typeColors[college.type])}>{college.type}</span>
              {college.nirf_rank && (
                <span className="chip bg-amber-100 text-amber-800 border-amber-200">
                  NIRF Rank #{college.nirf_rank}
                </span>
              )}
              <span className="chip bg-ink-100 text-ink-700 border-ink-200">{college.accreditation}</span>
            </div>
            <h1 className="font-display text-4xl text-white mb-2">{college.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <div className="flex items-center gap-1.5">
                <MapPin size={14} /> {college.location}
              </div>
              <div className="flex items-center gap-1.5">
                <Building2 size={14} /> Est. {college.established}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {stars.map(s => (
                    <Star key={s} size={13} className={s <= Math.round(college.rating) ? 'star-filled' : 'star-empty'} />
                  ))}
                </div>
                <span className="font-semibold text-white">{college.rating}</span>
                <span className="text-white/60">({college.total_reviews?.toLocaleString()} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="sticky top-16 z-20 bg-white border-b border-ink-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-14">
          <nav className="flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  activeTab === tab.id
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-500 hover:text-ink-800 hover:bg-ink-50'
                )}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {college.website && (
              <a
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-900 transition-colors px-3 py-2"
              >
                <ExternalLink size={14} /> Website
              </a>
            )}
            <button
              onClick={() => inCompare ? removeFromCompare(college.id) : addToCompare(college)}
              className={clsx(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                inCompare
                  ? 'bg-brand-100 text-brand-700 hover:bg-brand-200'
                  : 'bg-ink-900 text-white hover:bg-ink-700'
              )}
            >
              <GitCompare size={14} />
              {inCompare ? 'In Compare' : 'Compare'}
            </button>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: IndianRupee, label: 'Annual Fees', value: `${formatFees(college.annual_fees_min)} – ${formatFees(college.annual_fees_max)}`, color: 'bg-green-50 text-green-700' },
                { icon: TrendingUp, label: 'Avg Package', value: college.placement_avg_package ? formatPackage(college.placement_avg_package) : 'N/A', color: 'bg-blue-50 text-blue-700' },
                { icon: Users, label: 'Placement %', value: college.placement_percentage ? `${college.placement_percentage}%` : 'N/A', color: 'bg-purple-50 text-purple-700' },
                { icon: Award, label: 'Total Seats', value: college.total_seats?.toLocaleString() || 'N/A', color: 'bg-amber-50 text-amber-700' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl p-5 shadow-card">
                  <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>
                    <stat.icon size={20} />
                  </div>
                  <div className="text-xs text-ink-500 uppercase tracking-wider font-semibold mb-1">{stat.label}</div>
                  <div className="font-display text-xl text-ink-950">{stat.value}</div>
                </div>
              ))}
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h2 className="font-display text-2xl text-ink-950 mb-4">About {college.name}</h2>
              <p className="text-ink-600 leading-relaxed">{college.description}</p>
            </div>

            {/* Facilities */}
            {college.facilities?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h2 className="font-display text-2xl text-ink-950 mb-4">Campus Facilities</h2>
                <div className="flex flex-wrap gap-2">
                  {college.facilities.map(f => (
                    <span key={f} className="px-4 py-2 bg-ink-50 text-ink-700 rounded-lg text-sm font-medium border border-ink-200">
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* COURSES */}
        {activeTab === 'courses' && (
          <div className="animate-fade-in space-y-3">
            {courses.map(course => (
              <div key={course.id} className="bg-white rounded-2xl p-5 shadow-card">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="chip bg-blue-50 text-blue-700 border-blue-200">{course.degree}</span>
                      <span className="text-xs text-ink-400">{course.duration} years</span>
                    </div>
                    <h3 className="font-semibold text-ink-900">{course.name}</h3>
                    <div className="text-xs text-ink-400 mt-1">
                      Exams: {course.exam_accepted?.join(', ')} • {course.total_seats} seats
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-ink-400 mb-0.5">Annual Fees</div>
                    <div className="font-display text-xl text-brand-700">{formatFees(course.annual_fees)}</div>
                  </div>
                </div>
                {course.cutoff_general && (
                  <div className="mt-3 pt-3 border-t border-ink-100 flex gap-4 text-xs text-ink-500">
                    <span>General cutoff: <strong className="text-ink-800">{course.cutoff_general?.toLocaleString()}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* PLACEMENTS */}
        {activeTab === 'placements' && (
          <div className="animate-fade-in space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-card text-center">
                <div className="font-display text-4xl text-green-600 mb-2">
                  {college.placement_percentage}%
                </div>
                <div className="text-sm text-ink-500 font-medium">Placement Rate</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-card text-center">
                <div className="font-display text-4xl text-blue-600 mb-2">
                  {college.placement_avg_package ? formatPackage(college.placement_avg_package) : 'N/A'}
                </div>
                <div className="text-sm text-ink-500 font-medium">Average Package</div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-card text-center">
                <div className="font-display text-4xl text-purple-600 mb-2">
                  {college.placement_highest_package ? formatPackage(college.placement_highest_package) : 'N/A'}
                </div>
                <div className="text-sm text-ink-500 font-medium">Highest Package</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-xl mb-4 text-ink-900">Placement Highlights</h3>
              <div className="space-y-3">
                {[
                  'Top recruiters visit every year for placements',
                  'Strong alumni network supports career growth',
                  'Dedicated placement cell operates year-round',
                  'International placements in select programs',
                ].map((pt, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs mt-0.5 shrink-0">✓</div>
                    <span className="text-sm text-ink-600">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* REVIEWS */}
        {activeTab === 'reviews' && (
          <div className="animate-fade-in space-y-4">
            {reviews.length === 0 ? (
              <div className="text-center py-12 text-ink-400">No reviews yet</div>
            ) : (
              reviews.map(review => (
                <div key={review.id} className="bg-white rounded-2xl p-5 shadow-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-ink-900">{review.reviewer_name}</div>
                      <div className="text-xs text-ink-400">Batch of {review.batch_year}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex">
                        {stars.map(s => (
                          <Star key={s} size={13} className={s <= review.rating ? 'star-filled' : 'star-empty'} />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-ink-800">{review.rating}/5</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-ink-800 mt-3 mb-2">{review.title}</h4>
                  <p className="text-sm text-ink-600 leading-relaxed">{review.content}</p>
                  <div className="flex gap-4 mt-3 pt-3 border-t border-ink-100 text-xs text-ink-400">
                    <span>Infrastructure: <strong className="text-ink-600">{review.infrastructure_rating}/5</strong></span>
                    <span>Faculty: <strong className="text-ink-600">{review.faculty_rating}/5</strong></span>
                    <span>Placement: <strong className="text-ink-600">{review.placement_rating}/5</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
