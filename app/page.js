import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">RoleBase</h1>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-muted-foreground hover:text-primary">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl text-center space-y-8">
          <h2 className="text-5xl font-bold text-foreground leading-tight">
            Role-Based Access Control
            <span className="block text-primary">Made Simple</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure your application with dynamic permissions. Manage users, roles, 
            and access controls effortlessly with our modern authentication system.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-border text-muted-foreground hover:bg-accent/20 px-8">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 bg-card rounded-xl border border-border/30 shadow-sm">
              <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Secure Authentication</h3>
              <p className="text-sm text-muted-foreground">
                Industry-standard security with JWT sessions and bcrypt password hashing
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border/30 shadow-sm">
              <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Dynamic Roles</h3>
              <p className="text-sm text-muted-foreground">
                Create and manage roles with customizable permissions on the fly
              </p>
            </div>
            <div className="p-6 bg-card rounded-xl border border-border/30 shadow-sm">
              <div className="w-12 h-12 bg-accent/30 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground mb-2">Fine-Grained Control</h3>
              <p className="text-sm text-muted-foreground">
                Resource-based permissions for precise access management
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>Built with Next.js, Prisma, and Shadcn UI</p>
        </div>
      </footer>
    </div>
  )
}
