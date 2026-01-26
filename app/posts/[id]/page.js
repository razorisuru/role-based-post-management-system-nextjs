import { notFound } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/dal'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export async function generateMetadata({ params }) {
  const { id } = await params
  const post = await db.post.findUnique({
    where: { id, status: 'PUBLISHED' },
    select: { title: true, excerpt: true },
  })

  if (!post) {
    return {
      title: 'Post Not Found | NextBlog',
    }
  }

  return {
    title: `${post.title} | NextBlog`,
    description: post.excerpt || 'Read this post on NextBlog',
  }
}

export default async function PublicPostPage({ params }) {
  const { id } = await params
  const user = await getCurrentUser()

  const post = await db.post.findUnique({
    where: { id, status: 'PUBLISHED' },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary">NextBlog</h1>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard/posts/new">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Write
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Avatar className="h-5 w-5 mr-2">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-xs">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-muted-foreground mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Posts
            </Button>
          </Link>

          <article>
            <Card className="border-border/30">
              <CardHeader className="space-y-4">
                <CardTitle className="text-3xl text-foreground leading-tight">
                  {post.title}
                </CardTitle>
                
                {post.excerpt && (
                  <p className="text-lg text-muted-foreground">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-4 pt-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {getInitials(post.author?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{post.author?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Published on {formatDate(post.publishedAt || post.createdAt)}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <Separator className="bg-border/30" />

              <CardContent className="pt-8">
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-foreground leading-relaxed text-lg">
                    {post.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Call to Action */}
            {!user && (
              <Card className="border-border/30 mt-8">
                <CardContent className="py-8 text-center">
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Want to share your thoughts?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Join our community and start writing your own posts today.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Link href="/signup">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        Create Account
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button variant="outline" className="border-border">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </article>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Built with Next.js, Prisma, and Shadcn UI</p>
        </div>
      </footer>
    </div>
  )
}
