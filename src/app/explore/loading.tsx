import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="mt-2 h-4 w-64" />
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-11 flex-1" />
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-32" />
          <Skeleton className="h-11 w-24" />
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border">
              <Skeleton className="aspect-[16/10] rounded-none" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
