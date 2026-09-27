'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { blogsApi } from '@/lib/api/blogs';
import { blogCommentsApi } from '@/lib/api/blogComments';
import { getErrorMessage } from '@/lib/api/errors';
import styles from './blog.module.css';

function formatCommentDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Like + comment section for a public blog post. Reading comments works
 *  signed out; liking a post or posting a comment requires sign-in (the
 *  backend rejects both otherwise), so those actions redirect to `/login`
 *  with a `next` back to this same article. */
export function BlogEngagement({
  blogId,
  initialLikeCount,
  initialCommentCount,
}: {
  blogId: string;
  initialLikeCount: number;
  initialCommentCount: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [commentText, setCommentText] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const commentsQuery = useQuery({
    queryKey: ['blog-comments', blogId],
    queryFn: () => blogCommentsApi.getComments({ blog: blogId, status: 'APPROVED', sortOrder: 'desc', limit: 20 }),
  });

  // The article page itself is fetched anonymously (ISR-cached, shared across
  // every visitor), so it can never know THIS visitor's like status. Once
  // signed in, ask for it directly — this hits the authenticated blog read,
  // which now returns `likedByMe` alongside the live like count.
  const likeStatusQuery = useQuery({
    queryKey: ['blog-like-status', blogId],
    queryFn: () => blogsApi.getBlog(blogId),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });

  useEffect(() => {
    if (!likeStatusQuery.data) return;
    setLiked(likeStatusQuery.data.likedByMe);
    setLikeCount(likeStatusQuery.data.likeCount);
  }, [likeStatusQuery.data]);

  const likeMutation = useMutation({
    mutationFn: () => blogsApi.toggleLike(blogId),
    onSuccess: (result) => {
      setLiked(result.liked);
      setLikeCount(result.likeCount);
    },
  });

  const commentMutation = useMutation({
    mutationFn: (content: string) => blogCommentsApi.createComment({ blog: blogId, content }),
    onSuccess: () => {
      setCommentText('');
      setFormError(null);
      queryClient.invalidateQueries({ queryKey: ['blog-comments', blogId] });
    },
    onError: (error: unknown) => setFormError(getErrorMessage(error, 'Could not post your comment. Please try again.')),
  });

  const requireLogin = () => router.push(`/login?next=${encodeURIComponent(pathname)}`);

  const handleLike = () => {
    if (!isAuthenticated) { requireLogin(); return; }
    likeMutation.mutate();
  };

  const handleSubmitComment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated) { requireLogin(); return; }
    const trimmed = commentText.trim();
    if (!trimmed) { setFormError('Write something before posting.'); return; }
    commentMutation.mutate(trimmed);
  };

  const comments = commentsQuery.data?.comments ?? [];
  const commentCount = commentsQuery.data?.pagination.total ?? initialCommentCount;

  return (
    <div className={styles.engagement} data-course-reveal>
      <div className={styles.engagementBar}>
        <button
          type="button"
          className={styles.likeButton}
          data-liked={liked}
          onClick={handleLike}
          disabled={likeMutation.isPending}
          aria-pressed={liked}
        >
          <Heart size={16} /> {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
        </button>
        <span className={styles.commentCountBadge}><MessageCircle size={16} /> {commentCount} {commentCount === 1 ? 'Comment' : 'Comments'}</span>
      </div>

      <div className={styles.commentSection}>
        <h3>Join the conversation</h3>

        {isAuthenticated ? (
          <form className={styles.commentForm} onSubmit={handleSubmitComment}>
            <textarea
              value={commentText}
              onChange={(event) => { setCommentText(event.target.value); setFormError(null); }}
              placeholder="Share your thoughts..."
              maxLength={1000}
            />
            {formError && <p className={styles.commentError}>{formError}</p>}
            <button type="submit" className={styles.commentSubmit} disabled={commentMutation.isPending}>
              <Send size={14} /> {commentMutation.isPending ? 'Posting…' : 'Post comment'}
            </button>
          </form>
        ) : (
          <div className={styles.commentLoginPrompt}>
            <p>Sign in to like this post or join the conversation.</p>
            <button type="button" className={styles.commentSubmit} onClick={requireLogin}>Log in</button>
          </div>
        )}

        <div className={styles.commentList}>
          {commentsQuery.isLoading && <p className={styles.commentEmpty}>Loading comments…</p>}
          {!commentsQuery.isLoading && comments.length === 0 && (
            <p className={styles.commentEmpty}>Be the first to comment.</p>
          )}
          {comments.map((comment) => (
            <div key={comment._id} className={styles.commentItem}>
              <div className={styles.commentAvatar}>{(comment.userSnapshot?.fullName ?? '?').charAt(0).toUpperCase()}</div>
              <div>
                <div className={styles.commentMeta}>
                  <strong>{comment.userSnapshot?.fullName ?? 'Exam Ready member'}</strong>
                  <span>{formatCommentDate(comment.createdAt)}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
