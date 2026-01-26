import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Login | NextBlog',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">NextBlog</h1>
          <p className="text-muted-foreground mt-2">Share Your Stories with the World</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
