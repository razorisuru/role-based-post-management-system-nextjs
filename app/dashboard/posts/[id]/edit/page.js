import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser, hasPermission } from '@/lib/dal'
import { db } from '@/lib/db'
import { Button } from '@/components/ui/button'
import { EditPostForm } from '../edit-post-form'

export async function generateMetadata({ params }) {
  const { id } = await params
  const post = await db.post.findUnique({
    where: { id },
    select: { title: true },
  })

  return {
    title: post ? `Edit: ${post.title} | NextBlog` : 'Post Not Found',
    description: 'Edit post',
  }
}

export default async function EditPostPage({ params }) {
  const { id } = await params
  const user = await getCurrentUser()
  
  if (!user) {
    redirect('/login')
  }

  const post = await db.post.findUnique({
    where: { id },
  })

  if (!post) {
    notFound()
  }

  const canUpdateAll = await hasPermission('posts', 'update')
  const isOwner = post.authorId === user.id
  const canEdit = canUpdateAll || isOwner

  if (!canEdit) {
    redirect(`/dashboard/posts/${id}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/posts/${id}`}>
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Post
          </Button>
        </Link>
      </div>
      
      <EditPostForm post={post} />
    </div>
  )
}
