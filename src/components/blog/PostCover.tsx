import { BookOpen } from 'lucide-react';
import type { Blog } from '@/types/blog';
import styles from './blog.module.css';

/** The card/hero cover art — the real uploaded image when a post has one,
 *  otherwise the same decorative icon tile the rest of the site uses. */
export function PostCover({ post }: { post: Pick<Blog, 'coverImage'> }) {
  if (post.coverImage?.url) {
    // eslint-disable-next-line @next/next/no-img-element -- cover images come from arbitrary admin-configured S3 URLs.
    return <img src={post.coverImage.url} alt="" className={styles.postCoverImage} />;
  }
  return (
    <div className={styles.postCover}>
      <BookOpen className={styles.postCoverMark} strokeWidth={0.65} aria-hidden="true" />
      <span className={styles.postCoverIcon}><BookOpen size={24} /></span>
    </div>
  );
}
