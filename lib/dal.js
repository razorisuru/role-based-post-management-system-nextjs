import 'server-only'
import { cache } from 'react'
import { redirect } from 'next/navigation'
import { getSession } from './session'
import { db } from './db'

// Verify session and return user info - cached per request
export const verifySession = cache(async () => {
  const session = await getSession()

  if (!session?.userId) {
    redirect('/login')
  }

  return {
    isAuth: true,
    userId: session.userId,
    role: session.role,
  }
})

// Get current user with role and permissions - cached per request
export const getCurrentUser = cache(async () => {
  const session = await getSession()

  if (!session?.userId) {
    return null
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                    resource: true,
                    action: true,
                  },
                },
              },
            },
          },
        },
        createdAt: true,
      },
    })

    if (!user || user.status !== 'ACTIVE') {
      return null
    }

    // Flatten permissions for easier access
    const permissions = user.role.permissions.map((rp) => ({
      id: rp.permission.id,
      name: rp.permission.name,
      resource: rp.permission.resource,
      action: rp.permission.action,
    }))

    return {
      ...user,
      permissions,
    }
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return null
  }
})

// Check if user has a specific permission
export async function hasPermission(resource, action) {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  // Admin has all permissions
  if (user.role.name === 'admin') {
    return true
  }

  return user.permissions.some(
    (p) => p.resource === resource && p.action === action
  )
}

// Check if user has any of the specified permissions
export async function hasAnyPermission(permissions) {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  // Admin has all permissions
  if (user.role.name === 'admin') {
    return true
  }

  return permissions.some(({ resource, action }) =>
    user.permissions.some((p) => p.resource === resource && p.action === action)
  )
}

// Check if user has all of the specified permissions
export async function hasAllPermissions(permissions) {
  const user = await getCurrentUser()
  
  if (!user) {
    return false
  }

  // Admin has all permissions
  if (user.role.name === 'admin') {
    return true
  }

  return permissions.every(({ resource, action }) =>
    user.permissions.some((p) => p.resource === resource && p.action === action)
  )
}

// Get user by ID (for admin purposes)
export async function getUserById(userId) {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        status: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  } catch (error) {
    console.error('Failed to fetch user by ID:', error)
    return null
  }
}
