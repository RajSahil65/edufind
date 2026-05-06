import Link from 'next/link';
import { Search, BarChart3, GitCompare, TrendingUp, GraduationCap, ArrowRight } from 'lucide-react';

export default function Home() {
  const stats = [
    { value: '30+', label: 'Top Colleges' },
    { value: '6', label: 'Entrance Exams' },
    { value: '3', label: 'College Compare' },
    { value: '100%', label: 'Free Platform' },
  ];

  const features = [
    {
      icon: Search,
      title: 'Smart College Search',
      desc: 'Filter by location, fees, course type, and more to find your perfect college match.',
      href: '/colleges',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: GitCompare,
      title: 'Side-by-Side Compare',
      desc: 'Compare up to 3 colleges on fees, placements, rating, and other key factors.',
      href: '/compare',
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: BarChart3,
      title: 'Rank Predictor',
      desc: 'Enter your JEE/CAT rank and discover which colleges you can get into.',
      href: '/predictor',
      color: 'bg-amber-50 text-amber-600',
    },
  ];

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-brand-950 text-white">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 30% 50%, #c344f6 0%, transparent 60%), radial-gradient(circle at 70% 30%, #8b5cf6 0%, transparent 50%)'
        }} />
        
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-white/80 mb-8">
            <GraduationCap size={14} />
            India&apos;s College Discovery Platform
          </div>

          <h1 className="font-display text-5xl sm:text-6xl leading-tight mb-6">
            Find Your Perfect
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 to-purple-300">
              College in India
            </span>
          </h1>

          <p className="text-ink-300 text-lg max-w-2xl mx-auto mb-10">
            Search, compare, and discover top engineering and management colleges. 
            Use our rank predictor to know your admission chances instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/colleges"
              className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all hover:scale-105"
            >
              <Search size={18} />
              Explore Colleges
            </Link>
            <Link
              href="/predictor"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-8 py-3.5 rounded-xl transition-all"
            >
              <TrendingUp size={18} />
              Check My Rank
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-12 border-t border-white/10">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <div className="font-display text-4xl text-white mb-1">{s.value}</div>
                <div className="text-ink-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl text-ink-950 mb-3">Everything You Need</h2>
          <p className="text-ink-500 text-lg">Make your college decision with confidence</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map(f => (
            <Link
              key={f.title}
              href={f.href}
              className="group bg-white rounded-2xl p-7 shadow-card hover:shadow-card-hover transition-all hover:-translate-y-1 flex flex-col"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
                <f.icon size={22} />
              </div>
              <h3 className="font-display text-xl text-ink-950 mb-2">{f.title}</h3>
              <p className="text-ink-500 text-sm leading-relaxed flex-1">{f.desc}</p>
              <div className="flex items-center gap-1.5 mt-4 text-brand-600 text-sm font-semibold group-hover:gap-2.5 transition-all">
                Get Started <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-brand-600 to-purple-600 rounded-2xl p-10 text-white text-center">
          <h2 className="font-display text-3xl mb-3">Ready to find your college?</h2>
          <p className="text-white/80 mb-6">Start by entering your rank to see your options</p>
          <Link
            href="/predictor"
            className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-7 py-3 rounded-xl hover:bg-brand-50 transition-all"
          >
            <BarChart3 size={17} />
            Use Rank Predictor
          </Link>
        </div>
      </section>
    </div>
  );
}
