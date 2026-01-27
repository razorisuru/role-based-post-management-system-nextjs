import Link from 'next/link'
import { getCurrentUser, hasPermission } from '@/lib/dal'
import { UserNav } from './user-nav'
import { MobileNav } from './mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'

export async function DashboardHeader() {
  const user = await getCurrentUser()
  const canManageSettings = await hasPermission('settings', 'manage')
  const canViewUsers = await hasPermission('users', 'read')
  const canCreatePosts = await hasPermission('posts', 'create')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <MobileNav 
            user={user} 
            canManageSettings={canManageSettings} 
            canViewUsers={canViewUsers} 
          />
          
          <Link href="/dashboard" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-primary">NextBlog</span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-6 ml-6">
            <Link 
              href="/dashboard" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/posts" 
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Posts
            </Link>
            {canViewUsers && (
              <Link 
                href="/dashboard/users" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Users
              </Link>
            )}
            {canManageSettings && (
              <Link 
                href="/dashboard/settings" 
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Settings
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
