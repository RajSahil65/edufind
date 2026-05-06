import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import CompareBar from '@/components/CompareBar'
import { CompareProvider } from '@/context/CompareContext'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'EduFind - College Discovery Platform',
  description: 'Discover, compare, and choose the best colleges in India.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#fafaf8]">
        <AuthProvider>
          <CompareProvider>
            <Navbar />
            <main className="pt-16">{children}</main>
            <CompareBar />
            <footer className="mt-24 border-t border-ink-200 bg-ink-950 text-ink-400 py-12">
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <div className="font-display text-2xl text-white mb-3">EduFind</div>
                    <p className="text-sm leading-relaxed">India&apos;s most comprehensive college discovery platform. Built for students, by students.</p>
                  </div>
                  <div>
                    <div className="font-semibold text-ink-200 mb-3 text-sm uppercase tracking-wider">Features</div>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/colleges" className="hover:text-white transition-colors">College Search</a></li>
                      <li><a href="/compare" className="hover:text-white transition-colors">Compare Colleges</a></li>
                      <li><a href="/predictor" className="hover:text-white transition-colors">Rank Predictor</a></li>
                      <li><a href="/qa" className="hover:text-white transition-colors">Q&amp;A Discussion</a></li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-semibold text-ink-200 mb-3 text-sm uppercase tracking-wider">Exams Covered</div>
                    <ul className="space-y-2 text-sm">
                      <li>JEE Main &amp; Advanced</li><li>CAT / MBA</li><li>GATE / M.Tech</li><li>State CET</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-10 pt-6 border-t border-ink-800 text-xs text-center">
                  © 2024 EduFind. Data is indicative — always verify with official sources.
                </div>
              </div>
            </footer>
          </CompareProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
