import { redirect } from 'next/navigation'
import Link from 'next/link'
import { hasPermission } from '@/lib/dal'
import { Button } from '@/components/ui/button'
import { PostForm } from '../post-form'

export const metadata = {
  title: 'New Post | NextBlog',
  description: 'Create a new post',
}

export default async function NewPostPage() {
  const canCreate = await hasPermission('posts', 'create')
  
  if (!canCreate) {
    redirect('/dashboard/posts')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/posts">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Posts
          </Button>
        </Link>
      </div>
      
      <PostForm />
    </div>
  )
}
