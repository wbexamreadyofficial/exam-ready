import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Calendar, Check, Clock3, GraduationCap, Sparkles, User } from 'lucide-react';
import { CoursesExperience } from '@/components/courses/CoursesExperience';
import { HomeAmbient } from '@/components/home/HomeAmbient';
import { blogPosts } from '@/data/blog-posts';
import styles from '@/components/blog/blog.module.css';

export const metadata: Metadata = {
  title: 'Blog — Exam Ready',
  description: 'Study tips, exam strategy, and preparation habits for WBPSC, WBCS, SSC, and other West Bengal competitive exams.',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function BlogPage() {
  return (
    <CoursesExperience className={styles.page}>
      <section className={styles.hero} aria-labelledby="blog-title">
        <div className={`${styles.shell} ${styles.heroInner}`}>
          <div className={styles.eyebrow} data-course-reveal><span className={styles.tinyDot} /> THE EXAM READY BLOG</div>
          <h1 id="blog-title" data-course-reveal data-delay="70">Study smarter.<br /><em>Not just harder.</em></h1>
          <p className={styles.heroDescription} data-course-reveal data-delay="130">Practical strategy, study habits, and platform tips to help you get more out of every mock test.</p>
        </div>
      </section>

      <section className={`${styles.shell} ${styles.postsSection}`} aria-label="Blog posts">
        <div className={styles.postGrid}>
          {blogPosts.map((post, index) => {
            const Icon = post.icon;
            return (
              <div key={post.slug} data-course-reveal data-reveal-variant="card" data-delay={String((index % 3) * 100)}>
                <article className={styles.postCard} data-tone={post.tone}>
                  <div className={styles.postCover}>
                    <Icon className={styles.postCoverMark} strokeWidth={0.65} aria-hidden="true" />
                    <span className={styles.postCoverIcon}><Icon size={24} /></span>
                  </div>
                  <div className={styles.postBody}>
                    <span className={styles.postCategory}>{post.category}</span>
                    <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                    <div className={styles.postMeta}>
                      <span><User size={12} /> {post.author}</span>
                      <span><Calendar size={12} /> {formatDate(post.date)}</span>
                      <span><Clock3 size={12} /> {post.readTime}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className={styles.postReadMore}>Read article <ArrowUpRight size={15} /></Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      <section className={`${styles.shell} ${styles.ctaWrap}`} aria-labelledby="blog-cta-title">
        <div className={styles.cta} data-course-reveal data-reveal-variant="card">
          <div className={styles.ctaOrbit} aria-hidden="true" />
          <HomeAmbient />
          <div className={styles.ctaCopy}>
            <span className={styles.eyebrow}><Sparkles size={15} /> READY TO PUT IT INTO PRACTICE?</span>
            <h2 id="blog-cta-title">Reading is a start.<br /><em>Practice makes it stick.</em></h2>
            <p>Take what you’ve just read and try it<br />on your next mock test attempt.</p>
            <div className={styles.actions}>
              <Link href="/student/mock-tests" className={styles.primaryButton}>Find your mock test <ArrowRight size={18} /></Link>
              <span className={styles.ctaNote}><Check size={15} /> Free tests to get started</span>
            </div>
          </div>
          <div className={styles.ctaArt} aria-hidden="true">
            <GraduationCap size={43} strokeWidth={1} />
            <span>YOUR NEXT<br /><em>CHAPTER.</em></span>
            <ArrowUpRight size={20} strokeWidth={1.4} />
          </div>
        </div>
      </section>
    </CoursesExperience>
  );
}
