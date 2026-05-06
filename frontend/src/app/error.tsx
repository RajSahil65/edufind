'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-7xl mb-6">⚠️</div>
      <h1 className="font-display text-4xl text-ink-950 mb-3">Something went wrong</h1>
      <p className="text-ink-500 mb-8 max-w-md">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
