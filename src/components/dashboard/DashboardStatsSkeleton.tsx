import { Skeleton } from '@/components/ui/skeleton';

export const DashboardStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {[1, 2, 3, 4].map((i) => (
        <div 
          key={i} 
          className="bg-card border border-border rounded-2xl p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-5 w-12 rounded-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};
