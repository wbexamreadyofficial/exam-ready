'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

const posts = [
  {
    img: '/images/blog-study-books.jpg',
    category: 'Preparation',
    categoryColor: '#3b82f6',
    categoryBg: '#eff6ff',
    date: '20 May 2024',
    title: 'How to Create an Effective Study Plan for Government Exams',
  },
  {
    img: '/images/blog-writing-notes.jpg',
    category: 'Exam Tips',
    categoryColor: '#16a34a',
    categoryBg: '#f0fdf4',
    date: '18 May 2024',
    title: 'Time Management Tips to Crack Any Exam',
  },
  {
    img: '/images/blog-target.jpg',
    category: 'Motivation',
    categoryColor: '#7c3aed',
    categoryBg: '#faf5ff',
    date: '15 May 2024',
    title: 'Stay Motivated During Long Exam Preparation',
  },
  {
    img: '/images/blog-calendar.jpg',
    category: 'Exam Updates',
    categoryColor: '#d97706',
    categoryBg: '#fffbeb',
    date: '12 May 2024',
    title: 'Upcoming Government Exams in 2024 – Complete List',
  },
];

export function BlogSection() {
  return (
    <section className="py-14 md:py-20 bg-white dark:bg-slate-950">
      <div className="container">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">
              Latest from Our Blog
            </p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
              Tips, Strategies &amp; Exam Updates
            </h2>
          </div>
          <Link
            href="/blog"
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 whitespace-nowrap"
          >
            View All Posts <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map((post) => (
            <article
              key={post.title}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Photo */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <Image
                  src={post.img}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Badge + date */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-bold"
                    style={{ background: post.categoryBg, color: post.categoryColor }}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400">{post.date}</span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-snug mb-4 line-clamp-3">
                  {post.title}
                </h3>

                {/* Read More */}
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 group/link"
                >
                  Read More
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
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
