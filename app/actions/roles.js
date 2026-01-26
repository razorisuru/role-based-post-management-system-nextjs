'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { verifySession, hasPermission } from '@/lib/dal'

// Get all roles with their permissions
export async function getRoles() {
  const session = await verifySession()
  
  const canManage = await hasPermission('settings', 'manage')
  if (!canManage) {
    return { error: 'You do not have permission to manage settings.' }
  }

  try {
    const roles = await db.role.findMany({
      include: {
        permissions: {
          include: {
            permission: true,
          },
        },
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    return { roles }
  } catch (error) {
    console.error('Get roles error:', error)
    return { error: 'Failed to fetch roles.' }
  }
}

// Get all permissions
export async function getPermissions() {
  const session = await verifySession()
  
  const canManage = await hasPermission('settings', 'manage')
  if (!canManage) {
    return { error: 'You do not have permission to manage settings.' }
  }

  try {
    const permissions = await db.permission.findMany({
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    })

    return { permissions }
  } catch (error) {
    console.error('Get permissions error:', error)
    return { error: 'Failed to fetch permissions.' }
  }
}

// Update role permissions (add/remove permissions dynamically)
export async function updateRolePermissions(roleId, permissionIds) {
  const session = await verifySession()
  
  const canManage = await hasPermission('settings', 'manage')
  if (!canManage) {
    return { error: 'You do not have permission to manage settings.' }
  }

  try {
    // Delete existing role permissions
    await db.rolePermission.deleteMany({
      where: { roleId },
    })

    // Create new role permissions
    if (permissionIds.length > 0) {
      await db.rolePermission.createMany({
        data: permissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      })
    }

    revalidatePath('/dashboard/settings')
    return { success: true }
  } catch (error) {
    console.error('Update role permissions error:', error)
    return { error: 'Failed to update role permissions.' }
  }
}

// Create a new role
export async function createRole(name, description) {
  const session = await verifySession()
  
  const canManage = await hasPermission('settings', 'manage')
  if (!canManage) {
    return { error: 'You do not have permission to manage settings.' }
  }

  try {
    const existingRole = await db.role.findUnique({
      where: { name: name.toLowerCase() },
    })

    if (existingRole) {
      return { error: 'A role with this name already exists.' }
    }

    const role = await db.role.create({
      data: {
        name: name.toLowerCase(),
        description,
      },
    })

    revalidatePath('/dashboard/settings')
    return { role }
  } catch (error) {
    console.error('Create role error:', error)
    return { error: 'Failed to create role.' }
  }
}

// Create a new permission
export async function createPermission(name, resource, action, description) {
  const session = await verifySession()
  
  const canManage = await hasPermission('settings', 'manage')
  if (!canManage) {
    return { error: 'You do not have permission to manage settings.' }
  }

  try {
    const existingPermission = await db.permission.findUnique({
      where: {
        resource_action: {
          resource,
          action,
        },
      },
    })

    if (existingPermission) {
      return { error: 'A permission with this resource and action already exists.' }
    }

    const permission = await db.permission.create({
      data: {
        name,
        resource,
        action,
        description,
      },
    })

    revalidatePath('/dashboard/settings')
    return { permission }
  } catch (error) {
    console.error('Create permission error:', error)
    return { error: 'Failed to create permission.' }
  }
}
