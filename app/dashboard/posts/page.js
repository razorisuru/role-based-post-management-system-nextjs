import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, hasPermission } from '@/lib/dal'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PostsTable } from './posts-table'

export const metadata = {
  title: 'Posts | NextBlog',
  description: 'Manage posts',
}

export default async function PostsPage() {
  const user = await getCurrentUser()
  const canReadPosts = await hasPermission('posts', 'read')
  const canCreatePosts = await hasPermission('posts', 'create')
  
  if (!user) {
    redirect('/login')
  }

  // Get posts based on permission - if can read all, show all, otherwise show own posts
  let posts = []
  
  if (canReadPosts) {
    posts = await db.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  } else {
    // Show only user's own posts
    posts = await db.post.findMany({
      where: { authorId: user.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Posts</h1>
          <p className="text-muted-foreground mt-1">
            {canReadPosts ? 'Manage all posts in the system' : 'Manage your posts'}
          </p>
        </div>
        {canCreatePosts && (
          <Link href="/dashboard/posts/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Post
            </Button>
          </Link>
        )}
      </div>

      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="text-primary">
            {canReadPosts ? 'All Posts' : 'My Posts'}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {canReadPosts 
              ? `A list of all posts in the system (${posts.length} total)`
              : `Your posts (${posts.length} total)`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PostsTable posts={posts} currentUserId={user.id} canReadAll={canReadPosts} />
        </CardContent>
      </Card>
    </div>
  )
}
