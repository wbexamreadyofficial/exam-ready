'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Eye,
  Heart,
  Loader2,
  MessageSquare,
  MoreVertical,
  ShieldAlert,
  Trash2,
  XCircle,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import { Skeleton } from '@/components/ui/skeleton';

import { blogsApi } from '@/lib/api/blogs';
import { blogCommentsApi } from '@/lib/api/blogComments';
import { getErrorMessage } from '@/lib/api/errors';
import { generateInitials, cn } from '@/lib/utils';
import type { BlogComment, BlogCommentStatus } from '@/types/blogComment';
import { formatDistanceToNow } from 'date-fns';

const STATUS_META: Record<BlogCommentStatus, { label: string; variant: 'success' | 'warning' | 'destructive' | 'secondary' }> = {
  APPROVED: { label: 'Approved', variant: 'success' },
  PENDING: { label: 'Pending', variant: 'warning' },
  REJECTED: { label: 'Rejected', variant: 'destructive' },
  SPAM: { label: 'Spam', variant: 'secondary' },
};

function CommentStatusBadge({ status }: { status: BlogCommentStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge variant={meta.variant} className="text-[10px]">
      {meta.label}
    </Badge>
  );
}

function timeAgo(value: string) {
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true });
  } catch {
    return value;
  }
}

export function CommentRow({ comment, showBlogLink }: { comment: BlogComment; showBlogLink?: boolean }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);

  const blogRef = typeof comment.blog === 'string' ? null : comment.blog;
  const blogId = typeof comment.blog === 'string' ? comment.blog : comment.blog._id;

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['blog-comments'] });
    queryClient.invalidateQueries({ queryKey: ['blog', blogId] });
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
  };

  const statusMutation = useMutation({
    mutationFn: ({ commentId, status }: { commentId: string; status: BlogCommentStatus }) =>
      blogCommentsApi.updateStatus(commentId, status),
    onSuccess: invalidate,
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not update the comment')),
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: string) => blogCommentsApi.deleteComment(commentId),
    onSuccess: () => {
      invalidate();
      toast.success('Comment deleted');
    },
    onError: (error: unknown) => toast.error(getErrorMessage(error, 'Could not delete the comment')),
  });

  const repliesQuery = useQuery({
    queryKey: ['blog-comment-replies', comment._id],
    queryFn: () => blogCommentsApi.getReplies(comment._id),
    enabled: expanded,
  });

  const authorName = comment.userSnapshot?.fullName || 'Unnamed user';

  return (
    <div className="rounded-lg border border-[var(--color-border)] p-3">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 shrink-0">
          {comment.userSnapshot?.profilePhoto && <AvatarImage src={comment.userSnapshot.profilePhoto} alt="" />}
          <AvatarFallback className="text-[10px]">{generateInitials(authorName)}</AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold">{authorName}</p>
            <CommentStatusBadge status={comment.status} />
            {comment.isEdited && <span className="text-[10px] text-[var(--color-muted-foreground)]">(edited)</span>}
            {comment.reportCount > 0 && (
              <Badge variant="destructive" className="gap-1 text-[10px]">
                <ShieldAlert className="h-3 w-3" /> {comment.reportCount} reports
              </Badge>
            )}
            <span className="text-[11px] text-[var(--color-muted-foreground)]">{timeAgo(comment.createdAt)}</span>
          </div>
          <p className="whitespace-pre-wrap break-words text-sm text-[var(--color-foreground)]">{comment.content}</p>

          {showBlogLink && blogRef && (
            <Link
              href={`/admin/blogs/${blogRef._id}/edit`}
              className="inline-flex items-center gap-1 text-xs font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:underline"
            >
              on &ldquo;{blogRef.title}&rdquo;
            </Link>
          )}

          {!!comment.replyCount && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
            >
              {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              {comment.replyCount} {comment.replyCount === 1 ? 'reply' : 'replies'}
            </button>
          )}

          {expanded && (
            <div className="ml-2 space-y-2 border-l-2 border-[var(--color-border)] pl-3 pt-1">
              {repliesQuery.isLoading ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                repliesQuery.data?.map((reply) => (
                  <div key={reply._id} className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-semibold">{reply.userSnapshot?.fullName || 'Unnamed user'}</p>
                      <CommentStatusBadge status={reply.status} />
                      <span className="text-[10px] text-[var(--color-muted-foreground)]">{timeAgo(reply.createdAt)}</span>
                    </div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{reply.content}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" aria-label="Comment actions">
              {statusMutation.isPending || deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              disabled={comment.status === 'APPROVED'}
              onClick={() => statusMutation.mutate({ commentId: comment._id, status: 'APPROVED' })}
            >
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={comment.status === 'REJECTED'}
              onClick={() => statusMutation.mutate({ commentId: comment._id, status: 'REJECTED' })}
            >
              <XCircle className="mr-2 h-4 w-4 text-amber-600" /> Reject
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={comment.status === 'SPAM'}
              onClick={() => statusMutation.mutate({ commentId: comment._id, status: 'SPAM' })}
            >
              <ShieldAlert className="mr-2 h-4 w-4 text-slate-500" /> Mark as spam
            </DropdownMenuItem>
            <DropdownMenuItem className="text-red-500" onClick={() => deleteMutation.mutate(comment._id)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function CommentsTab({ blogId }: { blogId: string }) {
  const query = useQuery({
    queryKey: ['blog-comments', { blog: blogId }],
    queryFn: () => blogCommentsApi.getComments({ blog: blogId, limit: 50 }),
  });

  if (query.isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState message="Could not load comments." onRetry={() => query.refetch()} className="py-10" />;
  }

  const comments = query.data?.comments ?? [];

  if (comments.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No comments yet"
        description="Comments posted on this blog will show up here for moderation."
        className="py-10"
      />
    );
  }

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <CommentRow key={comment._id} comment={comment} />
      ))}
    </div>
  );
}

function LikesTab({ blogId }: { blogId: string }) {
  const query = useQuery({
    queryKey: ['blog-likes', blogId],
    queryFn: () => blogsApi.getLikes(blogId, { limit: 50 }),
  });

  if (query.isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState message="Could not load likes." onRetry={() => query.refetch()} className="py-10" />;
  }

  const likes = query.data?.likes ?? [];

  if (likes.length === 0) {
    return (
      <EmptyState icon={Heart} title="No likes yet" description="People who like this blog will show up here." className="py-10" />
    );
  }

  return (
    <div className="space-y-1.5">
      {likes.map((like) => {
        const user = typeof like.user === 'string' ? null : like.user;
        const name = user?.fullName || 'Unnamed user';
        return (
          <div key={like._id} className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] px-3 py-2">
            <Avatar className="h-7 w-7 shrink-0">
              {user?.profilePhoto && <AvatarImage src={user.profilePhoto} alt="" />}
              <AvatarFallback className="text-[9px]">{generateInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="flex-1 truncate text-sm font-medium">{name}</span>
            <span className="text-xs text-[var(--color-muted-foreground)]">{timeAgo(like.createdAt)}</span>
          </div>
        );
      })}
    </div>
  );
}

interface BlogEngagementDialogProps {
  blogId: string | null;
  onClose: () => void;
}

/** "Comments & likes" for one blog — moderation actions live right where the admin is looking at them. */
export function BlogEngagementDialog({ blogId, onClose }: BlogEngagementDialogProps) {
  const blogQuery = useQuery({
    queryKey: ['blog', blogId],
    queryFn: () => blogsApi.getBlog(blogId as string),
    enabled: !!blogId,
  });

  const blog = blogQuery.data;

  return (
    <Dialog open={!!blogId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="space-y-1.5 border-b border-[var(--color-border)] px-6 pb-4 pt-6 pr-12">
          <DialogTitle className="text-lg leading-tight">{blog?.title ?? (blogQuery.isLoading ? 'Loading…' : 'Blog')}</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {(blog?.viewCount ?? 0).toLocaleString()} views</span>
              <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {(blog?.likeCount ?? 0).toLocaleString()} likes</span>
              <span className="flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {(blog?.commentCount ?? 0).toLocaleString()} comments</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className={cn('min-h-0 flex-1 overflow-y-auto px-6 py-4')} data-lenis-prevent>
          {blogId && (
            <Tabs defaultValue="comments">
              <TabsList>
                <TabsTrigger value="comments" className="gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> Comments
                </TabsTrigger>
                <TabsTrigger value="likes" className="gap-1.5">
                  <Heart className="h-3.5 w-3.5" /> Likes
                </TabsTrigger>
              </TabsList>
              <TabsContent value="comments">
                <CommentsTab blogId={blogId} />
              </TabsContent>
              <TabsContent value="likes">
                <LikesTab blogId={blogId} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
