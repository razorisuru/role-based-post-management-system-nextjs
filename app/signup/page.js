import { SignupForm } from '@/components/auth/signup-form'

export const metadata = {
  title: 'Sign Up | RoleBase',
  description: 'Create a new account',
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RoleBase</h1>
          <p className="text-muted-foreground mt-2">Role-Based Access Control System</p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
