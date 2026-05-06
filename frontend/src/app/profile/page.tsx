'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Calendar, LogOut, Bookmark, MessageSquare, GitCompare } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/auth');
  }, [loading, isAuthenticated, router]);

  if (loading || !user) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="h-32 skeleton rounded-2xl mb-4" />
      </div>
    );
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const joinDate = new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 page-enter">
      <h1 className="font-display text-3xl text-ink-950 mb-8">Profile</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl shadow-card p-8 mb-6">
        <div className="flex items-center gap-5 mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: user.avatar_color }}
          >
            {initials}
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink-950">{user.name}</h2>
            <div className="flex items-center gap-1.5 text-ink-500 text-sm mt-1">
              <Mail size={13} /> {user.email}
            </div>
            <div className="flex items-center gap-1.5 text-ink-400 text-xs mt-1">
              <Calendar size={11} /> Member since {joinDate}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ink-100">
          <Link href="/dashboard?tab=colleges" className="text-center p-4 rounded-xl hover:bg-ink-50 transition-colors">
            <Bookmark size={20} className="mx-auto mb-1.5 text-brand-600" />
            <div className="text-sm font-semibold text-ink-800">Saved Colleges</div>
          </Link>
          <Link href="/dashboard?tab=comparisons" className="text-center p-4 rounded-xl hover:bg-ink-50 transition-colors">
            <GitCompare size={20} className="mx-auto mb-1.5 text-purple-600" />
            <div className="text-sm font-semibold text-ink-800">Comparisons</div>
          </Link>
          <Link href="/qa" className="text-center p-4 rounded-xl hover:bg-ink-50 transition-colors">
            <MessageSquare size={20} className="mx-auto mb-1.5 text-amber-600" />
            <div className="text-sm font-semibold text-ink-800">Q&A Activity</div>
          </Link>
        </div>
      </div>

      <button
        onClick={() => { logout(); router.push('/'); }}
        className="w-full flex items-center justify-center gap-2 py-3 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-colors font-medium text-sm"
      >
        <LogOut size={16} /> Sign Out
      </button>
    </div>
  );
}
