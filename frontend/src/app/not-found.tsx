import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-8xl mb-6">🎓</div>
      <h1 className="font-display text-5xl text-ink-950 mb-3">Page Not Found</h1>
      <p className="text-ink-500 text-lg mb-8 max-w-md">
        Looks like this page took a gap year. Let&apos;s get you back on track.
      </p>
      <div className="flex gap-4">
        <Link
          href="/"
          className="px-6 py-3 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/colleges"
          className="px-6 py-3 bg-ink-100 text-ink-800 rounded-xl font-semibold hover:bg-ink-200 transition-colors"
        >
          Browse Colleges
        </Link>
      </div>
    </div>
  );
}
