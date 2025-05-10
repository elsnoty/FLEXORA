import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
    return (
    <div className="w-full px-4 mt-10">
        <div className="border rounded-lg p-6">
        <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-6 space-y-6">
            <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
            </div>
            </div>
            <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            </div>
            <Skeleton className="h-10 w-32" />
        </div>
        </div>
    </div>
    );
    }