import { Skeleton } from "@/components/ui/skeleton";

export default function VendorDashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-5xl items-center px-4">
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-36" />
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mt-12 h-6 w-32" />
        <Skeleton className="mt-4 h-40 w-full rounded-2xl" />
      </main>
    </div>
  );
}
