import { Skeleton } from '@/components/ui/skeleton';

export const InvoiceListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div 
          key={i} 
          className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-background border border-border"
        >
          {/* Icon & Info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <Skeleton className="w-11 h-11 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>

          {/* Amount */}
          <div className="flex items-center gap-2 sm:min-w-[140px]">
            <Skeleton className="h-4 w-4 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>

          {/* Status */}
          <Skeleton className="h-6 w-16 rounded-full" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};
