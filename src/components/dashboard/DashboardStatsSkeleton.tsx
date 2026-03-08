import { Skeleton } from '@/components/ui/skeleton';

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-7 w-20 mb-1.5" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
};
