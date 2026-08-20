import { Skeleton } from "@/components/ui/skeleton";

export default function VendorProfileLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="overflow-hidden rounded-3xl border border-border">
          <Skeleton className="aspect-[21/9] rounded-none" />
          <div className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-40" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-32 w-full rounded-2xl lg:w-80" />
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
