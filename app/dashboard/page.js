import { getCurrentUser, hasPermission } from '@/lib/dal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/lib/db'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const canViewUsers = await hasPermission('users', 'read')
  const canManageSettings = await hasPermission('settings', 'manage')

  // Get stats if user has permission
  let stats = { totalUsers: 0, totalRoles: 0, totalPermissions: 0 }
  
  if (canViewUsers || canManageSettings) {
    const [totalUsers, totalRoles, totalPermissions] = await Promise.all([
      db.user.count(),
      db.role.count(),
      db.permission.count(),
    ])
    stats = { totalUsers, totalRoles, totalPermissions }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Here&apos;s an overview of your dashboard
        </p>
      </div>

      {/* User Info Card */}
      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="text-primary">Your Profile</CardTitle>
          <CardDescription className="text-muted-foreground">
            Your account information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="font-medium text-foreground">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium text-foreground break-all">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium text-foreground">{user?.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="font-medium text-primary capitalize">{user?.role?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user?.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                  : user?.status === 'INACTIVE'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
              }`}>
                {user?.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium text-foreground">
                {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards - Only show if user has permissions */}
      {(canViewUsers || canManageSettings) && (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          <Card className="border-border/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="border-border/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Roles
              </CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalRoles}</div>
            </CardContent>
          </Card>

          <Card className="border-border/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Permissions
              </CardTitle>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalPermissions}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Permissions Card */}
      <Card className="border-border/30">
        <CardHeader>
          <CardTitle className="text-primary">Your Permissions</CardTitle>
          <CardDescription className="text-muted-foreground">
            Actions you can perform in this system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user?.permissions && user.permissions.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {user.permissions.map((permission) => (
                <span
                  key={permission.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/30 text-foreground"
                >
                  {permission.resource}:{permission.action}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No specific permissions assigned.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
