'use client';

import { useState, useEffect, useCallback } from 'react';
import { qaApi, Question, typeColors } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { MessageSquare, ThumbsUp, CheckCircle2, Plus, Search, ChevronLeft, ChevronRight, Tag, GraduationCap, X } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDistanceToNow } from '@/lib/timeago';

export default function QAPage() {
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('latest');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAskForm, setShowAskForm] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { sort, page: String(page), limit: '15' };
      if (search) params.search = search;
      const res = await qaApi.list(params);
      setQuestions(res.data.questions);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [sort, page, search]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 page-enter">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl text-ink-950 mb-1">Q&amp;A Discussion</h1>
          <p className="text-ink-500">Ask questions, share insights about colleges</p>
        </div>
        {isAuthenticated ? (
          <button
            onClick={() => setShowAskForm(!showAskForm)}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            {showAskForm ? <X size={16} /> : <Plus size={16} />}
            {showAskForm ? 'Cancel' : 'Ask Question'}
          </button>
        ) : (
          <Link
            href="/auth"
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Sign in to Ask
          </Link>
        )}
      </div>

      {/* Ask form */}
      {showAskForm && isAuthenticated && (
        <AskQuestionForm onSuccess={(q) => {
          setShowAskForm(false);
          setQuestions(prev => [q, ...prev]);
          setTotal(t => t + 1);
        }} />
      )}

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-ink-200 rounded-xl text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors">
            Search
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput(''); setPage(1); }} className="px-3 py-2.5 bg-ink-100 text-ink-600 rounded-xl text-sm hover:bg-ink-200 transition-colors">
              <X size={14} />
            </button>
          )}
        </form>
        <div className="flex gap-1.5">
          {['latest', 'popular', 'unanswered'].map(s => (
            <button
              key={s}
              onClick={() => { setSort(s); setPage(1); }}
              className={clsx(
                'px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all',
                sort === s ? 'bg-brand-600 text-white' : 'bg-white border border-ink-200 text-ink-600 hover:border-brand-300'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="text-xs text-ink-400 mb-4">
        {total} question{total !== 1 ? 's' : ''}{search ? ` for "${search}"` : ''}
      </div>

      {/* Questions list */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="h-24 skeleton rounded-2xl" />)}
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20 text-ink-400">
          <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium mb-2">No questions found</p>
          {search && <p className="text-sm">Try different keywords or <button onClick={() => { setSearch(''); setSearchInput(''); }} className="text-brand-600 underline">clear search</button></p>}
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-ink-600 px-4">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg border border-ink-200 text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ question: q }: { question: Question }) {
  const initials = q.author_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <Link
      href={`/qa/${q.id}`}
      className="block bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all hover:-translate-y-0.5 p-5"
    >
      <div className="flex gap-4">
        {/* Votes + answers */}
        <div className="flex flex-col items-center gap-3 shrink-0 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-ink-700 font-semibold text-sm">
              <ThumbsUp size={12} /> {q.upvotes}
            </div>
            <div className="text-[10px] text-ink-400">votes</div>
          </div>
          <div className={clsx('flex flex-col items-center', q.answer_count > 0 ? 'text-green-600' : 'text-ink-400')}>
            <div className="flex items-center gap-1 font-semibold text-sm">
              <MessageSquare size={12} /> {q.answer_count}
            </div>
            <div className="text-[10px]">answers</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-ink-900 leading-snug line-clamp-2 group-hover:text-brand-700">
            {q.title}
          </h3>
          {q.body && <p className="text-sm text-ink-500 mt-1 line-clamp-1">{q.body}</p>}

          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {q.college_name && (
              <span className={clsx('chip flex items-center gap-1', typeColors[q.college_type || 'Private'])}>
                <GraduationCap size={10} />
                {q.college_name}
              </span>
            )}
            {q.tags?.slice(0, 3).map((tag: string) => (
              <span key={tag} className="chip bg-ink-100 text-ink-600 border-ink-200 flex items-center gap-1">
                <Tag size={9} /> {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ backgroundColor: q.avatar_color || '#6c47ff' }}
            >
              {initials}
            </div>
            <span className="text-xs text-ink-500">
              {q.author_name || 'Anonymous'} · {formatDistanceToNow(q.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface AskFormProps {
  onSuccess: (question: Question) => void;
}

function AskQuestionForm({ onSuccess }: AskFormProps) {
  const [form, setForm] = useState({ title: '', body: '', college_id: '', tagsInput: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.title.trim().length < 10) {
      setError('Title must be at least 10 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const tags = form.tagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const res = await qaApi.create({
        title: form.title.trim(),
        body: form.body.trim() || undefined,
        college_id: form.college_id || undefined,
        tags,
      });
      onSuccess(res.data.question);
      setForm({ title: '', body: '', college_id: '', tagsInput: '' });
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-card p-6 mb-6 border border-brand-100">
      <h3 className="font-display text-lg text-ink-950 mb-4">Ask a Question</h3>
      {error && <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Question Title *</label>
          <input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="What is the admission cutoff for IIT Bombay CSE 2024?"
            required
            className="w-full px-4 py-2.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Additional Details (optional)</label>
          <textarea
            value={form.body}
            onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
            placeholder="Add more context about your question..."
            rows={3}
            className="w-full px-4 py-2.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 mb-1">Tags (comma-separated)</label>
          <input
            value={form.tagsInput}
            onChange={e => setForm(f => ({ ...f, tagsInput: e.target.value }))}
            placeholder="JEE, placement, hostel, fees"
            className="w-full px-4 py-2.5 border border-ink-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            {loading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Plus size={15} />}
            Post Question
          </button>
        </div>
      </form>
    </div>
  );
}
