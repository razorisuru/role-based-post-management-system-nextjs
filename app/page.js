import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getPublishedPosts } from '@/app/actions/posts'
import { getCurrentUser } from '@/lib/dal'

export default async function Home() {
  const { posts = [] } = await getPublishedPosts()
  const user = await getCurrentUser()

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

  // Get featured post (first post)
  const featuredPost = posts[0]
  const remainingPosts = posts.slice(1)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30 sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-primary">NextBlog</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="#posts" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Posts
            </Link>
          </nav>
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
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Featured Post / Hero Section */}
        {featuredPost ? (
          <section className="border-b border-border/30">
            <div className="container mx-auto px-4 py-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      Featured
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(featuredPost.publishedAt || featuredPost.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={featuredPost.author?.avatar} alt={featuredPost.author?.name} />
                      <AvatarFallback className="bg-primary/20 text-primary">
                        {getInitials(featuredPost.author?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{featuredPost.author?.name}</p>
                      <p className="text-sm text-muted-foreground">Author</p>
                    </div>
                  </div>
                  <Link href={`/posts/${featuredPost.id}`}>
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground mt-2">
                      Read Article
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Button>
                  </Link>
                </div>
                <div className="hidden lg:block">
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/20 via-accent/30 to-primary/10 rounded-2xl flex items-center justify-center">
                    <svg className="w-32 h-32 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="border-b border-border/30">
            <div className="container mx-auto px-4 py-20 text-center">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="w-20 h-20 bg-accent/30 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold text-foreground">Welcome to NextBlog</h2>
                <p className="text-xl text-muted-foreground">
                  A place to share ideas, stories, and knowledge with the community.
                </p>
                <Link href="/login">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
                    Start Writing
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section id="posts" className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Latest Posts</h2>
                <p className="text-muted-foreground mt-1">Fresh insights from our writers</p>
              </div>
              <Link href={user ? "/dashboard/posts/new" : "/login"}>
                <Button variant="outline" className="border-border hover:bg-accent/20">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Write Post
                </Button>
              </Link>
            </div>

            {remainingPosts.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {remainingPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`} className="group">
                    <Card className="h-full border-border/30 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
                      <div className="aspect-[16/9] bg-gradient-to-br from-accent/40 via-primary/10 to-accent/20 rounded-t-lg flex items-center justify-center">
                        <svg className="w-12 h-12 text-primary/30 group-hover:text-primary/50 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={post.author?.avatar} alt={post.author?.name} />
                            <AvatarFallback className="bg-primary/20 text-primary text-xs">
                              {getInitials(post.author?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{post.author?.name}</span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{formatDate(post.publishedAt || post.createdAt)}</span>
                        </div>
                        <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
                          {post.title}
                        </CardTitle>
                        {post.excerpt && (
                          <CardDescription className="line-clamp-2 mt-2">
                            {post.excerpt}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <span className="text-sm text-primary font-medium group-hover:underline">
                          Read more →
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : !featuredPost ? (
              <Card className="border-border/30 border-dashed">
                <CardContent className="py-20 text-center">
                  <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No posts yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Be the first to share your thoughts with the community. Start writing today!
                  </p>
                  <Link href="/login">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Create Your First Post
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">More posts coming soon...</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <section className="py-16 px-4 bg-accent/10 border-t border-border/30">
            <div className="container mx-auto max-w-2xl text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">Ready to share your story?</h3>
              <p className="text-muted-foreground mb-6">
                Join our community of writers and readers. Create an account to start publishing your posts.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                    Create Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="border-border">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-primary">NextBlog</span>
              <span className="text-muted-foreground text-sm">© 2026</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Built with Next.js, Prisma, and Shadcn UI
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
