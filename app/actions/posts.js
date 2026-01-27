'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { db } from '@/lib/db'
import { verifySession, hasPermission, getCurrentUser } from '@/lib/dal'

const PostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  excerpt: z.string().max(500, 'Excerpt must be less than 500 characters').optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

// Get all posts (with permission check)
export async function getPosts() {
  const session = await verifySession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const canRead = await hasPermission('posts', 'read')
  if (!canRead) {
    return { error: 'Permission denied' }
  }

  try {
    const posts = await db.post.findMany({
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
    return { posts }
  } catch (error) {
    console.error('Failed to get posts:', error)
    return { error: 'Failed to get posts' }
  }
}

// Get posts for the current user
export async function getMyPosts() {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  try {
    const posts = await db.post.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: 'desc' },
    })
    return { posts }
  } catch (error) {
    console.error('Failed to get posts:', error)
    return { error: 'Failed to get posts' }
  }
}

// Get published posts (public) with pagination
export async function getPublishedPosts(page = 1, limit = 12) {
  try {
    const skip = (page - 1) * limit

    const [posts, totalCount] = await Promise.all([
      db.post.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      db.post.count({
        where: { status: 'PUBLISHED' },
      }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return { 
      posts, 
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    }
  } catch (error) {
    console.error('Failed to get published posts:', error)
    return { error: 'Failed to get posts' }
  }
}

// Get all posts with pagination (for dashboard)
export async function getPostsPaginated(page = 1, limit = 10, showAll = false, userId = null) {
  try {
    const skip = (page - 1) * limit
    const where = showAll ? {} : { authorId: userId }

    const [posts, totalCount] = await Promise.all([
      db.post.findMany({
        where,
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
        skip,
        take: limit,
      }),
      db.post.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return { 
      posts, 
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    }
  } catch (error) {
    console.error('Failed to get posts:', error)
    return { error: 'Failed to get posts' }
  }
}

// Get a single post by ID
export async function getPost(id) {
  const session = await verifySession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  try {
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
      return { error: 'Post not found' }
    }

    return { post }
  } catch (error) {
    console.error('Failed to get post:', error)
    return { error: 'Failed to get post' }
  }
}

// Create a new post
export async function createPost(prevState, formData) {
  const session = await verifySession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const canCreate = await hasPermission('posts', 'create')
  if (!canCreate) {
    return { error: 'Permission denied' }
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt') || null,
    status: formData.get('status') || 'DRAFT',
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed',
    }
  }

  const { title, content, excerpt, status } = validatedFields.data
  const user = await getCurrentUser()

  try {
    const post = await db.post.create({
      data: {
        title,
        content,
        excerpt,
        status,
        authorId: user.id,
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    })

    revalidatePath('/dashboard/posts')
    return { success: true, post }
  } catch (error) {
    console.error('Failed to create post:', error)
    return { error: 'Failed to create post' }
  }
}

// Update a post
export async function updatePost(id, prevState, formData) {
  const session = await verifySession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const user = await getCurrentUser()
  const post = await db.post.findUnique({ where: { id } })

  if (!post) {
    return { error: 'Post not found' }
  }

  // Check if user can update (own post or has permission)
  const canUpdateAll = await hasPermission('posts', 'update')
  const isOwner = post.authorId === user.id

  if (!canUpdateAll && !isOwner) {
    return { error: 'Permission denied' }
  }

  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    excerpt: formData.get('excerpt') || null,
    status: formData.get('status') || post.status,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed',
    }
  }

  const { title, content, excerpt, status } = validatedFields.data

  try {
    const updatedPost = await db.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        status,
        publishedAt: status === 'PUBLISHED' && !post.publishedAt ? new Date() : post.publishedAt,
      },
    })

    revalidatePath('/dashboard/posts')
    revalidatePath(`/dashboard/posts/${id}`)
    return { success: true, post: updatedPost }
  } catch (error) {
    console.error('Failed to update post:', error)
    return { error: 'Failed to update post' }
  }
}

// Delete a post
export async function deletePost(id) {
  const session = await verifySession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const user = await getCurrentUser()
  const post = await db.post.findUnique({ where: { id } })

  if (!post) {
    return { error: 'Post not found' }
  }

  // Check if user can delete (own post or has permission)
  const canDeleteAll = await hasPermission('posts', 'delete')
  const isOwner = post.authorId === user.id

  if (!canDeleteAll && !isOwner) {
    return { error: 'Permission denied' }
  }

  try {
    await db.post.delete({ where: { id } })
    revalidatePath('/dashboard/posts')
    return { success: true }
  } catch (error) {
    console.error('Failed to delete post:', error)
    return { error: 'Failed to delete post' }
  }
}

// Update post status
export async function updatePostStatus(id, status) {
  const session = await verifySession()
  if (!session) {
    return { error: 'Unauthorized' }
  }

  const user = await getCurrentUser()
  const post = await db.post.findUnique({ where: { id } })

  if (!post) {
    return { error: 'Post not found' }
  }

  // Check if user can update (own post or has permission)
  const canUpdateAll = await hasPermission('posts', 'update')
  const isOwner = post.authorId === user.id

  if (!canUpdateAll && !isOwner) {
    return { error: 'Permission denied' }
  }

  try {
    const updatedPost = await db.post.update({
      where: { id },
      data: {
        status,
        publishedAt: status === 'PUBLISHED' && !post.publishedAt ? new Date() : post.publishedAt,
      },
    })

    revalidatePath('/dashboard/posts')
    return { success: true, post: updatedPost }
  } catch (error) {
    console.error('Failed to update post status:', error)
    return { error: 'Failed to update post status' }
  }
}
