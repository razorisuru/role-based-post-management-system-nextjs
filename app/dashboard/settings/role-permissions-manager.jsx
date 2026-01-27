'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateRolePermissions } from '@/app/actions/roles'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export function RolePermissionsManager({ roles, permissions, groupedPermissions }) {
  const [selectedRole, setSelectedRole] = useState(roles[0]?.id || null)
  const [selectedPermissions, setSelectedPermissions] = useState(() => {
    const role = roles[0]
    return role?.permissions?.map((rp) => rp.permission.id) || []
  })
  const [isLoading, setIsLoading] = useState(false)

  const currentRole = roles.find((r) => r.id === selectedRole)

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId)
    const role = roles.find((r) => r.id === roleId)
    setSelectedPermissions(role?.permissions?.map((rp) => rp.permission.id) || [])
  }

  const handlePermissionToggle = (permissionId) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    )
  }

  const handleSelectAllForResource = (resource) => {
    const resourcePermissionIds = groupedPermissions[resource].map((p) => p.id)
    const allSelected = resourcePermissionIds.every((id) => selectedPermissions.includes(id))

    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !resourcePermissionIds.includes(id))
      )
    } else {
      setSelectedPermissions((prev) => {
        const newPermissions = [...prev]
        resourcePermissionIds.forEach((id) => {
          if (!newPermissions.includes(id)) {
            newPermissions.push(id)
          }
        })
        return newPermissions
      })
    }
  }

  const handleSave = async () => {
    if (!selectedRole) return

    setIsLoading(true)
    const result = await updateRolePermissions(selectedRole, selectedPermissions)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Permissions updated successfully')
    }
  }

  const isAllResourceSelected = (resource) => {
    const resourcePermissionIds = groupedPermissions[resource].map((p) => p.id)
    return resourcePermissionIds.every((id) => selectedPermissions.includes(id))
  }

  return (
    <div className="space-y-6">
      {/* Role Selection */}
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Select Role</h3>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <Button
              key={role.id}
              variant={selectedRole === role.id ? 'default' : 'outline'}
              onClick={() => handleRoleChange(role.id)}
              className={selectedRole === role.id 
                ? 'bg-primary hover:bg-primary/90 text-primary-foreground capitalize' 
                : 'border-border/50 text-muted-foreground hover:bg-accent/20 capitalize'
              }
            >
              {role.name}
              <span className="ml-2 text-xs opacity-70">
                ({role._count.users} users)
              </span>
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/30" />

      {/* Permissions Grid */}
      {selectedRole && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              Permissions for <span className="text-primary capitalize">{currentRole?.name}</span>
            </h3>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(groupedPermissions).map(([resource, perms]) => (
              <Card key={resource} className="border-border/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-primary capitalize">
                      {resource}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectAllForResource(resource)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {isAllResourceSelected(resource) ? 'Deselect All' : 'Select All'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {perms.map((permission) => (
                    <label
                      key={permission.id}
                      className="flex items-center gap-3 cursor-pointer p-2 rounded-md hover:bg-accent/20 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="w-4 h-4 rounded border-border/50 text-primary focus:ring-primary"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground capitalize">
                          {permission.action}
                        </p>
                        {permission.description && (
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="p-4 bg-accent/20 rounded-lg">
            <p className="text-sm text-foreground">
              <span className="font-medium">{selectedPermissions.length}</span> permissions selected for{' '}
              <span className="font-medium text-primary capitalize">{currentRole?.name}</span> role
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
