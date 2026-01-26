import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, hasPermission } from '@/lib/dal'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export async function generateMetadata({ params }) {
  const { id } = await params
  const post = await db.post.findUnique({
    where: { id },
    select: { title: true },
  })

  return {
    title: post ? `${post.title} | NextBlog` : 'Post Not Found',
    description: 'View post details',
  }
}

export default async function PostDetailPage({ params }) {
  const { id } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const post = await db.post.findUnique({
    where: { id },
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
  })

  if (!post) {
    notFound()
  }

  const canReadAll = await hasPermission('posts', 'read')
  const isOwner = post.authorId === user.id
  const canView = canReadAll || isOwner

  if (!canView) {
    redirect('/dashboard/posts')
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PUBLISHED':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Published</Badge>
      case 'DRAFT':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100">Draft</Badge>
      case 'ARCHIVED':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">Archived</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/posts">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Posts
          </Button>
        </Link>
        
        {(canReadAll || isOwner) && (
          <Link href={`/dashboard/posts/${id}/edit`}>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Post
            </Button>
          </Link>
        )}
      </div>

      <Card className="border-border/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl text-primary">{post.title}</CardTitle>
            {getStatusBadge(post.status)}
          </div>
          {post.excerpt && (
            <p className="text-muted-foreground mt-2">{post.excerpt}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="bg-primary/20 text-primary">
                {getInitials(post.author.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-foreground">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.email}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium">Created:</span>{' '}
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            {post.publishedAt && (
              <div>
                <span className="font-medium">Published:</span>{' '}
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            )}
            <div>
              <span className="font-medium">Last Updated:</span>{' '}
              {new Date(post.updatedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>

          <Separator className="bg-border/30" />

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-foreground leading-relaxed">
              {post.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
