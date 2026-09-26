import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Check, Clock3, GraduationCap, Sparkles, User } from 'lucide-react';
import { CoursesExperience } from '@/components/courses/CoursesExperience';
import { HomeAmbient } from '@/components/home/HomeAmbient';
import { blogPosts, getBlogPost } from '@/data/blog-posts';
import styles from '@/components/blog/blog.module.css';

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Blog — Exam Ready' };
  return { title: `${post.title} — Exam Ready Blog`, description: post.excerpt };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <CoursesExperience className={styles.page}>
      <section className={styles.articleHero} aria-labelledby="post-title">
        <div className={`${styles.shell} ${styles.articleHeroInner}`}>
          <Link href="/blog" className={styles.articleBack} data-course-reveal><ArrowLeft size={15} /> Back to blog</Link>
          <span className={styles.postCategory} data-course-reveal data-delay="60">{post.category}</span>
          <h1 id="post-title" data-course-reveal data-delay="100">{post.title}</h1>
          <div className={styles.articleMeta} data-course-reveal data-delay="150">
            <span><User size={13} /> {post.author}</span>
            <span><Calendar size={13} /> {formatDate(post.date)}</span>
            <span><Clock3 size={13} /> {post.readTime}</span>
          </div>
        </div>
      </section>

      <section className={`${styles.shell} ${styles.articleBody}`} aria-label="Article content">
        <div className={styles.articleContent} data-course-reveal data-delay="80">
          {post.content.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </section>

      <section className={`${styles.shell} ${styles.relatedSection}`} aria-labelledby="related-title">
        <div className={styles.relatedHeader} data-course-reveal>
          <span className={styles.eyebrow}>KEEP READING</span>
          <h2 id="related-title">More from the blog.</h2>
        </div>
        <div className={styles.postGrid}>
          {related.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.slug} data-course-reveal data-reveal-variant="card" data-delay={String(index * 100)}>
                <article className={styles.postCard} data-tone={item.tone}>
                  <div className={styles.postCover}>
                    <Icon className={styles.postCoverMark} strokeWidth={0.65} aria-hidden="true" />
                    <span className={styles.postCoverIcon}><Icon size={24} /></span>
                  </div>
                  <div className={styles.postBody}>
                    <span className={styles.postCategory}>{item.category}</span>
                    <h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3>
                    <p className={styles.postExcerpt}>{item.excerpt}</p>
                    <div className={styles.postMeta}>
                      <span><Clock3 size={12} /> {item.readTime}</span>
                    </div>
                    <Link href={`/blog/${item.slug}`} className={styles.postReadMore}>Read article <ArrowUpRight size={15} /></Link>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </section>

      <section className={`${styles.shell} ${styles.ctaWrap}`} aria-labelledby="post-cta-title">
        <div className={styles.cta} data-course-reveal data-reveal-variant="card">
          <div className={styles.ctaOrbit} aria-hidden="true" />
          <HomeAmbient />
          <div className={styles.ctaCopy}>
            <span className={styles.eyebrow}><Sparkles size={15} /> READY TO PUT IT INTO PRACTICE?</span>
            <h2 id="post-cta-title">Reading is a start.<br /><em>Practice makes it stick.</em></h2>
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
