import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function FeaturedPostSkeleton() {
  return (
    <section className="border-b border-border/30">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-2/3" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
            <Skeleton className="h-12 w-40 mt-2" />
          </div>
          <div className="hidden lg:block">
            <Skeleton className="aspect-[4/3] rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}

export function PostCardSkeleton() {
  return (
    <Card className="h-full border-border/30">
      <Skeleton className="aspect-[16/9] rounded-t-lg" />
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-3 rounded-full" />
          <Skeleton className="h-3 w-24" />
        </div>
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4 mt-1" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardHeader>
      <CardContent className="pt-0">
        <Skeleton className="h-4 w-24" />
      </CardContent>
    </Card>
  )
}

export function PostsGridSkeleton({ count = 6 }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function HomePageSkeleton() {
  return (
    <>
      <FeaturedPostSkeleton />
      <section id="posts" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-10">
            <div>
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48 mt-2" />
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
          <PostsGridSkeleton count={6} />
        </div>
      </section>
    </>
  )
}
