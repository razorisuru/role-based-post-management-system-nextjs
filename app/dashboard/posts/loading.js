import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { PostsTableSkeleton } from './posts-skeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-4 w-48 mt-2" />
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="text-primary">
            <Skeleton className="h-6 w-24" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-48" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostsTableSkeleton rows={10} showAuthor={true} />
        </CardContent>
      </Card>
    </div>
  )
}
