'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

/*
  Badge text uses the 700/800 step of each hue rather than the 500/600.
  The lighter steps measured 3.1–3.4:1 against these pastel plates, which
  fails AA at this 10–11px size — in light mode as well as dark.
  These pairings all clear 4.5:1.
*/
const posts = [
  {
    img: '/images/blog-study-books.jpg',
    category: 'Preparation',
    categoryColor: '#1d4ed8',
    categoryBg: '#eff6ff',
    date: '20 May 2024',
    title: 'How to Create an Effective Study Plan for Government Exams',
  },
  {
    img: '/images/blog-writing-notes.jpg',
    category: 'Exam Tips',
    categoryColor: '#166534',
    categoryBg: '#f0fdf4',
    date: '18 May 2024',
    title: 'Time Management Tips to Crack Any Exam',
  },
  {
    img: '/images/blog-target.jpg',
    category: 'Motivation',
    categoryColor: '#b91c1c',
    categoryBg: '#fef2f2',
    date: '15 May 2024',
    title: 'Stay Motivated During Long Exam Preparation',
  },
  {
    img: '/images/blog-calendar.jpg',
    category: 'Exam Updates',
    categoryColor: '#c2410c',
    categoryBg: '#fff7ed',
    date: '12 May 2024',
    title: 'Upcoming Government Exams in 2024 – Complete List',
  },
];

/* First post leads the section; the remainder become compact list rows. */
const [featured, ...rest] = posts;

export function BlogSection() {
  return (
    <section className="section-y bg-[#FAFBFD] dark:bg-slate-900/40 border-t hairline dark:border-slate-800">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12 md:mb-16">
          <div className="max-w-xl">
            <span className="eyebrow-line text-green-700 dark:text-green-400 mb-4">
              Latest from Our Blog
            </span>
            <h2 className="display-section text-balance text-[1.875rem] md:text-[2.5rem] dark:text-white">
              Tips, Strategies &amp; Exam Updates
            </h2>
          </div>
          <Link
            href="/blog"
            className="link-underline self-start sm:self-auto shrink-0 flex items-center gap-1.5 text-[14px] font-semibold text-blue-700 dark:text-blue-400 whitespace-nowrap group"
          >
            View All Posts
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>

        {/*
          Editorial layout — one featured story carries the visual weight,
          the rest read as a compact list. Deliberately not four identical cards.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* ═══ FEATURED ARTICLE ═══ */}
          <article className="group flex flex-col">
            <Link href="/blog" className="img-zoom relative block h-64 sm:h-80 lg:h-[22rem] rounded-[--radius-xl] overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={featured.img}
                alt={featured.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/*
                Legibility scrim — literal black, NOT an ink token. The ink
                scale inverts in dark mode, so a token here would turn the
                scrim white and destroy contrast on the overlaid text.
              */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <span
                className="absolute top-4 left-4 px-2.5 py-1 rounded-md text-[10.5px] font-bold tracking-wide shadow-sm"
                style={{ background: featured.categoryBg, color: featured.categoryColor }}
              >
                {featured.category}
              </span>
              <span className="absolute bottom-4 left-4 text-[11.5px] font-medium text-white/80">
                {featured.date}
              </span>
            </Link>

            <h3 className="display-section text-[1.25rem] sm:text-[1.5rem] dark:text-white mt-6 mb-4 text-balance transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400">
              <Link href="/blog">{featured.title}</Link>
            </h3>
            <p className="lede text-[14.5px] dark:text-slate-400 mb-5 max-w-lg">
              A practical framework for structuring your daily study hours, balancing
              subjects and staying consistent through a long preparation cycle.
            </p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-700 dark:text-blue-400 group/link"
            >
              Read Article
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-300" />
            </Link>
          </article>

          {/* ═══ SUPPORTING ARTICLES — horizontal list rows ═══ */}
          <div className="flex flex-col divide-y hairline dark:divide-slate-800 border-t lg:border-t-0 hairline dark:border-slate-800 lg:-mt-2">
            {rest.map((post) => (
              <article key={post.title} className="group flex gap-4 sm:gap-5 py-5 first:pt-0 lg:first:pt-2">
                {/* Thumbnail */}
                <Link
                  href="/blog"
                  className="img-zoom relative shrink-0 w-24 h-24 sm:w-32 sm:h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800"
                >
                  <Image
                    src={post.img}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </Link>

                {/* Copy */}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wide"
                      style={{ background: post.categoryBg, color: post.categoryColor }}
                    >
                      {post.category}
                    </span>
                    <span className="text-[11.5px] text-ink-400 dark:text-slate-500 font-medium">
                      {post.date}
                    </span>
                  </div>

                  <h3 className="display-card text-[14.5px] dark:text-white mb-2.5 line-clamp-2 transition-colors group-hover:text-blue-700 dark:group-hover:text-blue-400">
                    <Link href="/blog">{post.title}</Link>
                  </h3>

                  <Link
                    href="/blog"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-blue-700 dark:text-blue-400 group/link mt-auto"
                  >
                    Read Article
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Mobile "View All" */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
