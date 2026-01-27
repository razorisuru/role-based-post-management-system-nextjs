import { Skeleton } from '@/components/ui/skeleton'
import { HomePageSkeleton } from '@/app/posts-skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Skeleton */}
      <header className="border-b border-border/30 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Skeleton className="h-8 w-28" />
          <div className="hidden md:flex items-center gap-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <HomePageSkeleton />
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-border/30 py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </footer>
    </div>
  )
}
