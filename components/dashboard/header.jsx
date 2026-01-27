import Link from 'next/link'
import { getCurrentUser, hasPermission } from '@/lib/dal'
import { UserNav } from './user-nav'
import { MobileNav } from './mobile-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import { NavLinks } from './nav-links'
import { SearchCommand } from './search-command'

export async function DashboardHeader() {
  const user = await getCurrentUser()
  const canManageSettings = await hasPermission('settings', 'manage')
  const canViewUsers = await hasPermission('users', 'read')
  const canCreatePosts = await hasPermission('posts', 'create')

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left Section */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Mobile Menu */}
          <MobileNav 
            user={user} 
            canManageSettings={canManageSettings} 
            canViewUsers={canViewUsers} 
          />
          
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
              <svg className="h-4 w-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="hidden sm:block text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              NextBlog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center ml-6">
            <NavLinks 
              canViewUsers={canViewUsers} 
              canManageSettings={canManageSettings} 
            />
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Search */}
          <SearchCommand />
          
          {/* Quick Actions */}
          {canCreatePosts && (
            <Link href="/dashboard/posts/new" className="hidden sm:flex">
              <button className="inline-flex items-center justify-center gap-2 h-9 px-3 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden md:inline">New Post</span>
              </button>
            </Link>
          )}

          {/* Notifications */}
          <button className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            <span className="sr-only">Notifications</span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Separator */}
          <div className="hidden sm:block h-6 w-px bg-border/60 mx-1" />

          {/* User Menu */}
          <UserNav user={user} />
        </div>
      </div>
    </header>
  )
}
