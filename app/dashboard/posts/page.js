import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import { getCurrentUser, hasPermission } from '@/lib/dal'
import { getPostsPaginated } from '@/app/actions/posts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { PostsTable } from './posts-table'
import { PostsTableSkeleton } from './posts-skeleton'

export const metadata = {
  title: 'Posts | NextBlog',
  description: 'Manage posts',
}

export default async function PostsPage({ searchParams }) {
  const params = await searchParams
  const page = Number(params?.page) || 1
  const user = await getCurrentUser()
  const canReadPosts = await hasPermission('posts', 'read')
  const canCreatePosts = await hasPermission('posts', 'create')
  
  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary">Posts</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {canReadPosts ? 'Manage all posts in the system' : 'Manage your posts'}
          </p>
        </div>
        {canCreatePosts && (
          <Link href="/dashboard/posts/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Button>
          </Link>
        )}
      </div>

      <Suspense fallback={<PostsCardSkeleton canReadPosts={canReadPosts} />}>
        <PostsContent 
          page={page} 
          userId={user.id} 
          canReadPosts={canReadPosts} 
        />
      </Suspense>
    </div>
  )
}

async function PostsContent({ page, userId, canReadPosts }) {
  const { posts = [], pagination } = await getPostsPaginated(page, 10, canReadPosts, userId)

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="text-primary">
          {canReadPosts ? 'All Posts' : 'My Posts'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {pagination?.totalCount 
            ? `${canReadPosts ? 'All posts' : 'Your posts'} (${pagination.totalCount} total)`
            : canReadPosts ? 'A list of all posts in the system' : 'Your posts'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PostsTable posts={posts} currentUserId={userId} canReadAll={canReadPosts} />
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="mt-6 pt-6 border-t border-border/30">
            <DashboardPagination 
              currentPage={page} 
              totalPages={pagination.totalPages}
              basePath="/dashboard/posts"
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PostsCardSkeleton({ canReadPosts }) {
  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="text-primary">
          {canReadPosts ? 'All Posts' : 'My Posts'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Loading posts...
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PostsTableSkeleton rows={10} showAuthor={canReadPosts} />
      </CardContent>
    </Card>
  )
}

function DashboardPagination({ currentPage, totalPages, basePath }) {
  const getPageNumbers = () => {
    const pages = []
    const showEllipsisStart = currentPage > 3
    const showEllipsisEnd = currentPage < totalPages - 2

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (showEllipsisStart) {
        pages.push('ellipsis-start')
      }

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (showEllipsisEnd) {
        pages.push('ellipsis-end')
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const getPageUrl = (page) => {
    if (page === 1) return basePath
    return `${basePath}?page=${page}`
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageUrl(currentPage - 1)}
            disabled={currentPage <= 1}
          />
        </PaginationItem>

        {getPageNumbers().map((pageNum, index) => (
          <PaginationItem key={index}>
            {pageNum === 'ellipsis-start' || pageNum === 'ellipsis-end' ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={getPageUrl(pageNum)}
                isActive={pageNum === currentPage}
              >
                {pageNum}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={getPageUrl(currentPage + 1)}
            disabled={currentPage >= totalPages}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
