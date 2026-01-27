import { redirect } from 'next/navigation'
import { getCurrentUser, hasPermission } from '@/lib/dal'
import { db } from '@/lib/db'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { UsersTable } from './users-table'

export const metadata = {
  title: 'Users | NextBlog',
  description: 'Manage users',
}

export default async function UsersPage() {
  const canViewUsers = await hasPermission('users', 'read')
  
  if (!canViewUsers) {
    redirect('/dashboard')
  }

  const [users, roles] = await Promise.all([
    db.user.findMany({
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
    }),
    db.role.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Users</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage user accounts and their roles</p>
      </div>

      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="text-primary">All Users</CardTitle>
          <CardDescription className="text-muted-foreground">
            A list of all users in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UsersTable users={users} roles={roles} />
        </CardContent>
      </Card>
    </div>
  )
}
