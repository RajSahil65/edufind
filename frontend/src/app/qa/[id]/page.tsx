'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { qaApi, Question, Answer, typeColors } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import {
  ThumbsUp, MessageSquare, CheckCircle2, ArrowLeft,
  GraduationCap, Tag, Send, Loader2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { formatDistanceToNow } from '@/lib/timeago';

export default function QuestionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);
  const [answerBody, setAnswerBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [answerError, setAnswerError] = useState('');

  useEffect(() => {
    qaApi.getById(id)
      .then(res => {
        setQuestion(res.data.question);
        setAnswers(res.data.answers);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const upvoteQuestion = async () => {
    if (!isAuthenticated || !question) return;
    const res = await qaApi.upvoteQuestion(question.id);
    setQuestion(q => q ? { ...q, upvotes: q.upvotes + (res.data.upvoted ? 1 : -1) } : q);
  };

  const upvoteAnswer = async (answerId: string) => {
    if (!isAuthenticated) return;
    const res = await qaApi.upvoteAnswer(answerId);
    setAnswers(prev => prev.map(a =>
      a.id === answerId ? { ...a, upvotes: a.upvotes + (res.data.upvoted ? 1 : -1), userUpvoted: res.data.upvoted } : a
    ));
  };

  const acceptAnswer = async (answerId: string) => {
    if (!isAuthenticated || !question || question.user_id !== user?.id) return;
    await qaApi.acceptAnswer(answerId);
    setAnswers(prev => prev.map(a => ({ ...a, is_accepted: a.id === answerId })));
  };

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answerBody.trim().length < 10) {
      setAnswerError('Answer must be at least 10 characters');
      return;
    }
    setSubmitting(true);
    setAnswerError('');
    try {
      const res = await qaApi.answer(id, answerBody.trim());
      setAnswers(prev => [...prev, { ...res.data.answer, userUpvoted: false }]);
      setQuestion(q => q ? { ...q, answer_count: q.answer_count + 1 } : q);
      setAnswerBody('');
    } catch (err: any) {
      setAnswerError(err?.response?.data?.error || 'Failed to post answer');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="h-8 w-48 skeleton rounded mb-6" />
        <div className="h-48 skeleton rounded-2xl mb-4" />
        <div className="h-32 skeleton rounded-2xl" />
      </div>
    );
  }

  if (!question) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center text-ink-400">
        <MessageSquare size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">Question not found</p>
        <Link href="/qa" className="mt-4 inline-flex items-center gap-1 text-brand-600 text-sm">
          <ArrowLeft size={14} /> Back to Q&amp;A
        </Link>
      </div>
    );
  }

  const qInitials = question.author_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';
  const isQuestionAuthor = user?.id === question.user_id;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 page-enter">
      {/* Back */}
      <Link href="/qa" className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-ink-800 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Q&amp;A
      </Link>

      {/* Question */}
      <div className="bg-white rounded-2xl shadow-card p-6 mb-6">
        <div className="flex gap-5">
          {/* Vote column */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <button
              onClick={upvoteQuestion}
              disabled={!isAuthenticated}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl transition-all',
                isAuthenticated ? 'hover:bg-brand-50 cursor-pointer' : 'cursor-default opacity-60'
              )}
            >
              <ThumbsUp size={18} className="text-ink-500" />
              <span className="text-lg font-bold text-ink-800">{question.upvotes}</span>
              <span className="text-[10px] text-ink-400">votes</span>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-2xl text-ink-950 leading-snug mb-3">{question.title}</h1>
            {question.body && (
              <p className="text-ink-600 leading-relaxed whitespace-pre-wrap mb-4">{question.body}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {question.college_name && (
                <Link href={`/colleges/${question.college_id}`} className={clsx('chip flex items-center gap-1 hover:opacity-80 transition-opacity', typeColors[question.college_type || 'Private'])}>
                  <GraduationCap size={10} /> {question.college_name}
                </Link>
              )}
              {question.tags?.map((tag: string) => (
                <span key={tag} className="chip bg-ink-100 text-ink-600 border-ink-200 flex items-center gap-1">
                  <Tag size={9} /> {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-ink-100">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                style={{ backgroundColor: question.avatar_color || '#6c47ff' }}
              >
                {qInitials}
              </div>
              <span className="text-sm text-ink-500">
                <span className="font-medium text-ink-700">{question.author_name || 'Anonymous'}</span>
                {' · '}{formatDistanceToNow(question.created_at)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink-950">
          {answers.length} Answer{answers.length !== 1 ? 's' : ''}
        </h2>
      </div>

      {answers.length === 0 && (
        <div className="bg-white rounded-2xl shadow-card p-8 text-center text-ink-400 mb-6">
          <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No answers yet. Be the first to answer!</p>
        </div>
      )}

      <div className="space-y-4 mb-8">
        {answers.map(answer => (
          <AnswerCard
            key={answer.id}
            answer={answer}
            isQuestionAuthor={isQuestionAuthor}
            isAuthenticated={isAuthenticated}
            onUpvote={() => upvoteAnswer(answer.id)}
            onAccept={() => acceptAnswer(answer.id)}
          />
        ))}
      </div>

      {/* Post answer */}
      {isAuthenticated ? (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h3 className="font-display text-lg text-ink-950 mb-4">Your Answer</h3>
          {answerError && (
            <div className="mb-4 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{answerError}</div>
          )}
          <form onSubmit={submitAnswer}>
            <textarea
              value={answerBody}
              onChange={e => setAnswerBody(e.target.value)}
              placeholder="Write a detailed answer. Share your experience, knowledge, or insights..."
              rows={5}
              className="w-full px-4 py-3 border border-ink-200 rounded-xl text-sm text-ink-900 placeholder:text-ink-400 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none mb-4"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || answerBody.trim().length < 10}
                className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors"
              >
                {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                Post Answer
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-ink-50 rounded-2xl p-6 text-center border border-ink-200">
          <p className="text-ink-600 mb-3">Sign in to post an answer</p>
          <Link href="/auth" className="inline-flex items-center gap-1.5 bg-brand-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
            Sign In <ChevronRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}

interface AnswerCardProps {
  answer: Answer;
  isQuestionAuthor: boolean;
  isAuthenticated: boolean;
  onUpvote: () => void;
  onAccept: () => void;
}

function AnswerCard({ answer, isQuestionAuthor, isAuthenticated, onUpvote, onAccept }: AnswerCardProps) {
  const initials = answer.author_name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div className={clsx(
      'bg-white rounded-2xl shadow-card p-6 transition-all',
      answer.is_accepted && 'border-2 border-green-400 shadow-green-100'
    )}>
      <div className="flex gap-5">
        {/* Vote column */}
        <div className="flex flex-col items-center gap-2 shrink-0">
          <button
            onClick={onUpvote}
            disabled={!isAuthenticated}
            className={clsx(
              'flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all',
              answer.userUpvoted ? 'bg-brand-50 text-brand-600' : 'text-ink-500',
              isAuthenticated ? 'hover:bg-brand-50 cursor-pointer' : 'cursor-default opacity-60'
            )}
          >
            <ThumbsUp size={16} className={answer.userUpvoted ? 'fill-brand-500' : ''} />
            <span className="text-sm font-bold">{answer.upvotes}</span>
          </button>

          {isQuestionAuthor && (
            <button
              onClick={onAccept}
              className={clsx(
                'p-1.5 rounded-xl transition-all',
                answer.is_accepted
                  ? 'text-green-600 bg-green-50'
                  : 'text-ink-300 hover:text-green-500 hover:bg-green-50'
              )}
              title={answer.is_accepted ? 'Accepted answer' : 'Accept this answer'}
            >
              <CheckCircle2 size={18} />
            </button>
          )}
          {!isQuestionAuthor && answer.is_accepted && (
            <div className="text-green-500" title="Accepted answer">
              <CheckCircle2 size={18} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {answer.is_accepted && (
            <div className="flex items-center gap-1.5 text-green-600 text-xs font-semibold mb-2">
              <CheckCircle2 size={13} /> Accepted Answer
            </div>
          )}
          <p className="text-ink-700 leading-relaxed whitespace-pre-wrap">{answer.body}</p>

          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-ink-100">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
              style={{ backgroundColor: answer.avatar_color || '#6c47ff' }}
            >
              {initials}
            </div>
            <span className="text-xs text-ink-500">
              <span className="font-medium text-ink-700">{answer.author_name || 'Anonymous'}</span>
              {' · '}{formatDistanceToNow(answer.created_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
