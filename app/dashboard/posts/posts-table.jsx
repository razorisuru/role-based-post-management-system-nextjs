'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { deletePost, updatePostStatus } from '@/app/actions/posts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export function PostsTable({ posts, currentUserId, canReadAll }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (postId, status) => {
    setIsLoading(true)
    const result = await updatePostStatus(postId, status)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post status updated successfully')
    }
  }

  const handleDelete = async (postId) => {
    setIsLoading(true)
    const result = await deletePost(postId)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Post deleted successfully')
    }
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

  const canModifyPost = (post) => {
    return post.authorId === currentUserId || canReadAll
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/30">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
            {canReadAll && (
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Author</th>
            )}
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Created</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-border/10 hover:bg-accent/10">
              <td className="py-3 px-4">
                <div>
                  <Link 
                    href={`/dashboard/posts/${post.id}`}
                    className="font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                  {post.excerpt && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </td>
              {canReadAll && (
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={post.author.avatar} alt={post.author.name} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs">
                        {getInitials(post.author.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{post.author.name}</span>
                  </div>
                </td>
              )}
              <td className="py-3 px-4">
                {canModifyPost(post) ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" disabled={isLoading} className="p-0 h-auto">
                        {getStatusBadge(post.status)}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(post.id, 'DRAFT')}
                        className="cursor-pointer"
                      >
                        Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(post.id, 'PUBLISHED')}
                        className="cursor-pointer"
                      >
                        Published
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleStatusChange(post.id, 'ARCHIVED')}
                        className="cursor-pointer"
                      >
                        Archived
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  getStatusBadge(post.status)
                )}
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </td>
              <td className="py-3 px-4 text-right">
                {canModifyPost(post) && (
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/dashboard/posts/${post.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Edit
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Post</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{post.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(post.id)}
                            className="bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {posts.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No posts found. Create your first post!
        </div>
      )}
    </div>
  )
}
