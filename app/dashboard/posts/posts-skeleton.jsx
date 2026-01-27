import { Skeleton } from '@/components/ui/skeleton'

export function PostsTableSkeleton({ rows = 10, showAuthor = true }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/30">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
            {showAuthor && (
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Author</th>
            )}
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-border/10">
              <td className="py-3 px-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </td>
              {showAuthor && (
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </td>
              )}
              <td className="py-3 px-4">
                <Skeleton className="h-6 w-20 rounded-full" />
              </td>
              <td className="py-3 px-4">
                <Skeleton className="h-4 w-24" />
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center justify-end gap-2">
                  <Skeleton className="h-8 w-12" />
                  <Skeleton className="h-8 w-14" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
