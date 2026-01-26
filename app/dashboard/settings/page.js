import { redirect } from 'next/navigation'
import { hasPermission } from '@/lib/dal'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RolePermissionsManager } from './role-permissions-manager'

export const metadata = {
  title: 'Settings | RoleBase',
  description: 'Manage roles and permissions',
}

export default async function SettingsPage() {
  const canManageSettings = await hasPermission('settings', 'manage')
  
  if (!canManageSettings) {
    redirect('/dashboard')
  }

  const [roles, permissions] = await Promise.all([
    db.role.findMany({
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
    }),
    db.permission.findMany({
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    }),
  ])

  // Group permissions by resource
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.resource]) {
      acc[permission.resource] = []
    }
    acc[permission.resource].push(permission)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage roles and permissions dynamically</p>
      </div>

      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="text-primary">Roles & Permissions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Configure what each role can do. Changes take effect immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RolePermissionsManager 
            roles={roles} 
            permissions={permissions}
            groupedPermissions={groupedPermissions}
          />
        </CardContent>
      </Card>
    </div>
  )
}
