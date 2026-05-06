'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BarChart3, TrendingUp, MapPin, Star, IndianRupee, ChevronRight, Loader2 } from 'lucide-react';
import { predictorApi, collegesApi, College, PredictorResult, formatFees, formatPackage, typeColors } from '@/lib/api';
import clsx from 'clsx';

const EXAM_INFO: Record<string, { desc: string; example: string }> = {
  'JEE Main': { desc: 'For B.Tech at NITs, GFTIs, IIITs', example: 'e.g. 15000' },
  'JEE Advanced': { desc: 'For B.Tech at IITs', example: 'e.g. 1500' },
  'CAT': { desc: 'For MBA at IIMs and top B-schools', example: 'e.g. 2500' },
  'GATE': { desc: 'For M.Tech at IITs and NITs', example: 'e.g. 500' },
  'State CET': { desc: 'For state-level engineering admissions', example: 'e.g. 50000' },
};

type AdmissionChance = 'safe' | 'moderate' | 'ambitious';

const chanceConfig: Record<AdmissionChance, { label: string; color: string; bg: string; desc: string }> = {
  safe: { label: 'Safe Choices', color: 'text-green-700', bg: 'bg-green-50 border-green-200', desc: 'High chance of admission' },
  moderate: { label: 'Good Matches', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', desc: 'Reasonable chance of admission' },
  ambitious: { label: 'Ambitious Picks', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', desc: 'Stretch targets, apply alongside safe choices' },
};

function CollegeResultCard({ college, chance }: { college: College & { rank_min: number; rank_max: number }, chance: AdmissionChance }) {
  const config = chanceConfig[chance];
  return (
    <Link
      href={`/colleges/${college.id}`}
      className="flex items-center gap-4 bg-white rounded-xl p-4 border border-ink-200 hover:border-brand-300 hover:shadow-card transition-all group"
    >
      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-ink-100">
        <img src={college.image_url} alt={college.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="font-semibold text-ink-900 text-sm line-clamp-1 group-hover:text-brand-700 transition-colors">
              {college.name}
            </div>
            <div className="flex items-center gap-1 text-xs text-ink-400 mt-0.5">
              <MapPin size={10} /> {college.city}, {college.state}
            </div>
          </div>
          {college.nirf_rank && (
            <span className="chip bg-ink-100 text-ink-600 border-ink-200 shrink-0">#{college.nirf_rank}</span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-2">
          <span className={clsx('chip', typeColors[college.type])}>{college.type}</span>
          <span className="text-xs text-ink-500 flex items-center gap-0.5">
            <IndianRupee size={9} /> {formatFees(college.annual_fees_min)}/yr
          </span>
          {college.placement_avg_package && (
            <span className="text-xs text-ink-500 flex items-center gap-0.5">
              <TrendingUp size={9} /> {formatPackage(college.placement_avg_package)}
            </span>
          )}
          <div className="flex items-center gap-0.5 ml-auto">
            <Star size={10} className="star-filled" />
            <span className="text-xs font-medium text-ink-700">{college.rating}</span>
          </div>
        </div>
      </div>
      <ChevronRight size={16} className="text-ink-300 group-hover:text-brand-500 transition-colors shrink-0" />
    </Link>
  );
}

export default function PredictorPage() {
  const [exam, setExam] = useState('JEE Main');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState('General');
  const [result, setResult] = useState<PredictorResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [exams, setExams] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeChance, setActiveChance] = useState<AdmissionChance>('safe');

  useEffect(() => {
    predictorApi.getExams().then(res => {
      setExams(res.data.exams);
      setCategories(res.data.categories);
    });
  }, []);

  const handlePredict = async () => {
    if (!rank || isNaN(parseInt(rank))) {
      setError('Please enter a valid rank');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await predictorApi.predict({ exam, rank: parseInt(rank), category });
      setResult(res.data);
      setActiveChance(
        res.data.results.safe.length > 0 ? 'safe' :
        res.data.results.moderate.length > 0 ? 'moderate' : 'ambitious'
      );
    } catch (err) {
      setError('Failed to get predictions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalResults = result
    ? result.results.safe.length + result.results.moderate.length + result.results.ambitious.length
    : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 page-enter">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BarChart3 size={28} className="text-white" />
        </div>
        <h1 className="font-display text-4xl text-ink-950 mb-2">College Rank Predictor</h1>
        <p className="text-ink-500 text-lg">Enter your exam and rank to discover colleges you can get into</p>
      </div>

      {/* Input form */}
      <div className="bg-white rounded-2xl p-6 shadow-card mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Exam */}
          <div>
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Exam</label>
            <select
              value={exam}
              onChange={e => setExam(e.target.value)}
              className="w-full px-3 py-3 bg-ink-50 border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:bg-white transition-all cursor-pointer"
            >
              {(exams.length ? exams : Object.keys(EXAM_INFO)).map(e => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            {EXAM_INFO[exam] && (
              <p className="text-xs text-ink-400 mt-1.5">{EXAM_INFO[exam].desc}</p>
            )}
          </div>

          {/* Rank */}
          <div>
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Your Rank</label>
            <input
              type="number"
              value={rank}
              onChange={e => setRank(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePredict()}
              placeholder={EXAM_INFO[exam]?.example || 'e.g. 10000'}
              min="1"
              className="w-full px-3 py-3 bg-ink-50 border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:bg-white transition-all"
            />
            {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-2">Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-3 bg-ink-50 border border-ink-200 rounded-xl text-sm outline-none focus:border-brand-400 focus:bg-white transition-all cursor-pointer"
            >
              {(categories.length ? categories : ['General', 'OBC', 'SC', 'ST', 'EWS']).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handlePredict}
          disabled={loading || !rank}
          className="mt-5 w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-ink-300 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing your chances...
            </>
          ) : (
            <>
              <BarChart3 size={18} />
              Predict My Colleges
            </>
          )}
        </button>
      </div>

      {/* Results */}
      {result && !loading && (
        <div className="animate-slide-up">
          {/* Summary */}
          <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-display text-xl text-brand-900">
                  Found <span className="text-brand-700">{totalResults} colleges</span> matching your profile
                </div>
                <div className="text-sm text-brand-600 mt-1">
                  {exam} Rank: <strong>{result.rank.toLocaleString()}</strong> • Category: {result.category}
                </div>
              </div>
              <div className="flex gap-2">
                {(['safe', 'moderate', 'ambitious'] as AdmissionChance[]).map(chance => {
                  const count = result.results[chance].length;
                  if (count === 0) return null;
                  return (
                    <div key={chance} className={clsx('px-3 py-2 rounded-lg border text-center', chanceConfig[chance].bg)}>
                      <div className={clsx('text-lg font-bold', chanceConfig[chance].color)}>{count}</div>
                      <div className={clsx('text-xs', chanceConfig[chance].color)}>{chanceConfig[chance].label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            {(['safe', 'moderate', 'ambitious'] as AdmissionChance[]).map(chance => {
              const count = result.results[chance].length;
              if (count === 0) return null;
              return (
                <button
                  key={chance}
                  onClick={() => setActiveChance(chance)}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all',
                    activeChance === chance
                      ? chanceConfig[chance].bg + ' ' + chanceConfig[chance].color
                      : 'bg-white border-ink-200 text-ink-600 hover:bg-ink-50'
                  )}
                >
                  {chanceConfig[chance].label}
                  <span className="bg-current/20 px-2 py-0.5 rounded-full text-xs font-bold">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Description */}
          <p className="text-sm text-ink-500 mb-4">{chanceConfig[activeChance].desc}</p>

          {/* College list */}
          <div className="space-y-3">
            {result.results[activeChance].map(college => (
              <CollegeResultCard key={college.id} college={college} chance={activeChance} />
            ))}
            {result.results[activeChance].length === 0 && (
              <div className="text-center py-8 text-ink-400">
                No colleges in this category for your rank
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="mt-6 p-4 bg-ink-50 rounded-xl text-xs text-ink-400 border border-ink-200">
            ⚠️ This is an estimate based on historical data. Actual cutoffs vary by year, seat availability, and other factors. Always check official sources for accurate information.
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-12 text-ink-400">
          <div className="text-5xl mb-4">🎯</div>
          <p className="text-lg text-ink-600">Enter your rank above to see your college options</p>
          <p className="text-sm mt-2">We'll show you safe, moderate, and ambitious choices</p>
        </div>
      )}
    </div>
  );
}
