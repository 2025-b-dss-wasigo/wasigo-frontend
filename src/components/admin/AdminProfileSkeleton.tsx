import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export const ProfileHeaderSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-(--primary) to-(--primary)/70" />
      <CardContent className="relative pt-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-12">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="flex-1 text-center sm:text-left pb-4 space-y-2">
            <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
            <Skeleton className="h-4 w-24 mx-auto sm:mx-0" />
          </div>
          <Skeleton className="h-10 w-32 mt-7" />
        </div>
      </CardContent>
    </Card>
  );
};

export const ProfileAlertSkeleton = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
};

export const ProfileTabsSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-10 w-40" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
};
