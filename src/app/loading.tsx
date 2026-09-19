import { ContentSkeleton } from '@/components/ui/page-skeletons';

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <ContentSkeleton />
    </div>
  );
}
