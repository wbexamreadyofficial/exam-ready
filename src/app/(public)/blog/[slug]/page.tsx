import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, ArrowUpRight, Calendar, Check, Clock3, GraduationCap, Heart, MessageCircle, Sparkles, User } from 'lucide-react';
import { CoursesExperience } from '@/components/courses/CoursesExperience';
import { HomeAmbient } from '@/components/home/HomeAmbient';
import { PostCover } from '@/components/blog/PostCover';
import { BlogEngagement } from '@/components/blog/BlogEngagement';
import { formatBlogDate, formatReadingTime, getBlogCategoryLabel, getBlogExcerpt, getPublishedBlogs } from '@/lib/blog/publicBlogs';
import styles from '@/components/blog/blog.module.css';

export const revalidate = 300;

async function findPost(slug: string) {
  const posts = await getPublishedBlogs();
  return { posts, post: posts.find((item) => item.slug === slug) };
}

export async function generateStaticParams() {
  const posts = await getPublishedBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await findPost(slug);
  if (!post) return { title: 'Blog — Exam Ready' };
  return { title: `${post.title} — Exam Ready Blog`, description: post.seo?.metaDescription ?? getBlogExcerpt(post) };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { posts, post } = await findPost(slug);
  if (!post) notFound();

  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <CoursesExperience className={styles.page}>
      <section className={styles.articleHero} aria-labelledby="post-title">
        <div className={`${styles.shell} ${styles.articleHeroInner}`}>
          <div className={styles.articleTopRow}>
            <Link href="/blog" className={styles.articleBack} data-course-reveal><ArrowLeft size={15} /> Back to blog</Link>
            <span className={styles.postCategory} data-course-reveal data-delay="60">{getBlogCategoryLabel(post.category)}</span>
          </div>
          <h1 id="post-title" data-course-reveal data-delay="100">{post.title}</h1>
          <div className={styles.articleMeta} data-course-reveal data-delay="150">
            <span><User size={13} /> {post.authorLabel}</span>
            <span><Calendar size={13} /> {formatBlogDate(post)}</span>
            <span><Clock3 size={13} /> {formatReadingTime(post.readingTime)}</span>
          </div>
        </div>
      </section>

      {post.coverImage?.url && (
        <section className={styles.articleCoverSection} aria-hidden="true">
          <div className={styles.articleCoverWrap} data-course-reveal data-reveal-variant="card">
            {/* eslint-disable-next-line @next/next/no-img-element -- cover images come from arbitrary admin-configured S3 URLs. */}
            <img src={post.coverImage.url} alt="" className={styles.articleCover} />
          </div>
        </section>
      )}

      <section className={`${styles.shell} ${styles.articleBody}`} aria-label="Article content">
        <div className={styles.articleContent} data-course-reveal data-delay="80" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className={styles.engagementWrap}>
          <BlogEngagement blogId={post._id} initialLikeCount={post.likeCount} initialCommentCount={post.commentCount} />
        </div>
      </section>

      {related.length > 0 && (
        <section className={`${styles.shell} ${styles.relatedSection}`} aria-labelledby="related-title">
          <div className={styles.relatedHeader} data-course-reveal>
            <span className={styles.eyebrow}>KEEP READING</span>
            <h2 id="related-title">More from the blog.</h2>
          </div>
          <div className={styles.postGrid}>
            {related.map((item, index) => (
              <div key={item._id} data-course-reveal data-reveal-variant="card" data-delay={String(index * 100)}>
                <article className={styles.postCard} data-tone={index % 2 ? 'blue' : 'orange'}>
                  <PostCover post={item} />
                  <div className={styles.postBody}>
                    <span className={styles.postCategory}>{getBlogCategoryLabel(item.category)}</span>
                    <h3><Link href={`/blog/${item.slug}`}>{item.title}</Link></h3>
                    <p className={styles.postExcerpt}>{getBlogExcerpt(item)}</p>
                    <div className={styles.postMeta}>
                      <span><Clock3 size={12} /> {formatReadingTime(item.readingTime)}</span>
                    </div>
                    <div className={styles.postStats}>
                      <span><Heart size={12} /> {item.likeCount}</span>
                      <span><MessageCircle size={12} /> {item.commentCount}</span>
                    </div>
                    <Link href={`/blog/${item.slug}`} className={styles.postReadMore}>Read article <ArrowUpRight size={15} /></Link>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </section>
      )}

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
