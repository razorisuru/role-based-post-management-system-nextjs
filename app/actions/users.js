'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { verifySession, hasPermission } from '@/lib/dal'

// Get all users (requires users:read permission)
export async function getUsers() {
  const session = await verifySession()
  
  const canRead = await hasPermission('users', 'read')
  if (!canRead) {
    return { error: 'You do not have permission to view users.' }
  }

  try {
    const users = await db.user.findMany({
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
      },
      orderBy: { createdAt: 'desc' },
    })

    return { users }
  } catch (error) {
    console.error('Get users error:', error)
    return { error: 'Failed to fetch users.' }
  }
}

// Update user status (requires users:update permission)
export async function updateUserStatus(userId, status) {
  const session = await verifySession()
  
  const canUpdate = await hasPermission('users', 'update')
  if (!canUpdate) {
    return { error: 'You do not have permission to update users.' }
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { status },
    })

    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error) {
    console.error('Update user status error:', error)
    return { error: 'Failed to update user status.' }
  }
}

// Update user role (requires users:update permission)
export async function updateUserRole(userId, roleId) {
  const session = await verifySession()
  
  const canUpdate = await hasPermission('users', 'update')
  if (!canUpdate) {
    return { error: 'You do not have permission to update users.' }
  }

  try {
    await db.user.update({
      where: { id: userId },
      data: { roleId },
    })

    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error) {
    console.error('Update user role error:', error)
    return { error: 'Failed to update user role.' }
  }
}

// Delete user (requires users:delete permission)
export async function deleteUser(userId) {
  const session = await verifySession()
  
  const canDelete = await hasPermission('users', 'delete')
  if (!canDelete) {
    return { error: 'You do not have permission to delete users.' }
  }

  // Prevent self-deletion
  if (userId === session.userId) {
    return { error: 'You cannot delete your own account.' }
  }

  try {
    await db.user.delete({
      where: { id: userId },
    })

    revalidatePath('/dashboard/users')
    return { success: true }
  } catch (error) {
    console.error('Delete user error:', error)
    return { error: 'Failed to delete user.' }
  }
}
