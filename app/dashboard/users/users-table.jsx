'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateUserStatus, updateUserRole, deleteUser } from '@/app/actions/users'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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

export function UsersTable({ users, roles }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleStatusChange = async (userId, status) => {
    setIsLoading(true)
    const result = await updateUserStatus(userId, status)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User status updated successfully')
    }
  }

  const handleRoleChange = async (userId, roleId) => {
    setIsLoading(true)
    const result = await updateUserRole(userId, roleId)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User role updated successfully')
    }
  }

  const handleDelete = async (userId) => {
    setIsLoading(true)
    const result = await deleteUser(userId)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('User deleted successfully')
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/30">
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left py-3 px-4 font-medium text-muted-foreground">Joined</th>
            <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-border/10 hover:bg-accent/10">
              <td className="py-3 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="capitalize text-primary hover:text-primary/80"
                      disabled={isLoading}
                    >
                      {user.role.name}
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {roles.map((role) => (
                      <DropdownMenuItem
                        key={role.id}
                        onClick={() => handleRoleChange(user.id, role.id)}
                        className="capitalize cursor-pointer"
                      >
                        {role.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
              <td className="py-3 px-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isLoading}>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user.id, 'ACTIVE')}
                      className="cursor-pointer"
                    >
                      Active
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user.id, 'INACTIVE')}
                      className="cursor-pointer"
                    >
                      Inactive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleStatusChange(user.id, 'SUSPENDED')}
                      className="cursor-pointer text-red-600"
                    >
                      Suspended
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
              <td className="py-3 px-4 text-muted-foreground">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4 text-right">
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
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{user.name}"? This action cannot be undone and will remove all associated data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No users found
        </div>
      )}
    </div>
  )
}
