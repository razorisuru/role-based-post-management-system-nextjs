import { getCurrentUser } from '@/lib/dal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export const metadata = {
  title: 'Profile | NextBlog',
  description: 'Your profile',
}

export default async function ProfilePage() {
  const user = await getCurrentUser()

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your account information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 border-border/30">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 border-4 border-border/30">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold text-foreground">{user?.name}</h2>
              <p className="text-muted-foreground">{user?.email}</p>
              <span className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                user?.status === 'ACTIVE' 
                  ? 'bg-green-100 text-green-800' 
                  : user?.status === 'INACTIVE'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {user?.status}
              </span>
              <p className="mt-2 text-primary font-medium capitalize">
                {user?.role?.name}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2 border-border/30">
          <CardHeader>
            <CardTitle className="text-primary">Account Details</CardTitle>
            <CardDescription className="text-muted-foreground">
              Your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="mt-1 text-foreground">{user?.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <p className="mt-1 text-foreground">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="mt-1 text-foreground">{user?.phone || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                <p className="mt-1 text-foreground">
                  {new Date(user?.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <Separator className="bg-border/30" />

            <div>
              <h3 className="text-sm font-medium text-primary mb-3">Your Permissions</h3>
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
                <p className="text-muted-foreground">No specific permissions assigned to your role.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
