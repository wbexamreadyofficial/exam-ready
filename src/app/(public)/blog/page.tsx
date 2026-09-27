import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BookOpen, Calendar, Check, Clock3, GraduationCap, Heart, MessageCircle, Sparkles, User } from 'lucide-react';
import { CoursesExperience } from '@/components/courses/CoursesExperience';
import { HomeAmbient } from '@/components/home/HomeAmbient';
import { PostCover } from '@/components/blog/PostCover';
import { formatBlogDate, formatReadingTime, getBlogCategoryLabel, getBlogExcerpt, getPublishedBlogs } from '@/lib/blog/publicBlogs';
import styles from '@/components/blog/blog.module.css';

export const metadata: Metadata = {
  title: 'Blog — Exam Ready',
  description: 'Study tips, exam strategy, and preparation habits for WBPSC, WBCS, SSC, and other West Bengal competitive exams.',
};
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedBlogs();

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
        {posts.length ? (
          <div className={styles.postGrid}>
            {posts.map((post, index) => {
              const tone: 'orange' | 'blue' = index % 2 ? 'blue' : 'orange';
              return (
                <div key={post._id} data-course-reveal data-reveal-variant="card" data-delay={String((index % 3) * 100)}>
                  <article className={styles.postCard} data-tone={tone}>
                    <PostCover post={post} />
                    <div className={styles.postBody}>
                      <span className={styles.postCategory}>{getBlogCategoryLabel(post.category)}</span>
                      <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                      <p className={styles.postExcerpt}>{getBlogExcerpt(post)}</p>
                      <div className={styles.postMeta}>
                        <span><User size={12} /> {post.authorLabel}</span>
                        <span><Calendar size={12} /> {formatBlogDate(post)}</span>
                        <span><Clock3 size={12} /> {formatReadingTime(post.readingTime)}</span>
                      </div>
                      <div className={styles.postStats}>
                        <span><Heart size={12} /> {post.likeCount}</span>
                        <span><MessageCircle size={12} /> {post.commentCount}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} className={styles.postReadMore}>Read article <ArrowUpRight size={15} /></Link>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.empty} data-course-reveal>
            <BookOpen size={32} />
            <h3>Your next read is on its way.</h3>
            <p>We&apos;re working on new study strategy posts — check back soon.</p>
          </div>
        )}
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
