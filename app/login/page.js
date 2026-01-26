import { LoginForm } from '@/components/auth/login-form'

export const metadata = {
  title: 'Login | RoleBase',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RoleBase</h1>
          <p className="text-muted-foreground mt-2">Role-Based Access Control System</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
