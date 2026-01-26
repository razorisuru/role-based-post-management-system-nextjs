'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { updatePost } from '@/app/actions/posts'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

export function EditPostForm({ post }) {
  const router = useRouter()
  const updatePostWithId = updatePost.bind(null, post.id)
  const [state, action, pending] = useActionState(updatePostWithId, undefined)
  const [status, setStatus] = useState(post.status)

  useEffect(() => {
    if (state?.success) {
      toast.success('Post updated successfully!')
      router.push(`/dashboard/posts/${post.id}`)
    }
  }, [state?.success, router, post.id])

  return (
    <Card className="border-border/30">
      <CardHeader>
        <CardTitle className="text-primary">Edit Post</CardTitle>
        <CardDescription className="text-muted-foreground">
          Update your post content and settings
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-6">
          {state?.error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input
              id="title"
              name="title"
              type="text"
              defaultValue={post.title}
              placeholder="Enter post title"
              required
              className="border-border/50 focus:border-primary focus:ring-primary"
            />
            {state?.errors?.title && (
              <p className="text-sm text-red-500">{state.errors.title[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-foreground">Excerpt (Optional)</Label>
            <Input
              id="excerpt"
              name="excerpt"
              type="text"
              defaultValue={post.excerpt || ''}
              placeholder="Brief description of your post"
              className="border-border/50 focus:border-primary focus:ring-primary"
            />
            {state?.errors?.excerpt && (
              <p className="text-sm text-red-500">{state.errors.excerpt[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-foreground">Content</Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={post.content}
              placeholder="Write your post content here..."
              required
              rows={12}
              className="border-border/50 focus:border-primary focus:ring-primary resize-y"
            />
            {state?.errors?.content && (
              <p className="text-sm text-red-500">{state.errors.content[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground">Status</Label>
            <Select name="status" value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-border/50">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <Link href={`/dashboard/posts/${post.id}`}>
              <Button type="button" variant="outline" className="border-border/50">
                Cancel
              </Button>
            </Link>
            <Button 
              type="submit" 
              disabled={pending}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {pending ? 'Updating...' : 'Update Post'}
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
