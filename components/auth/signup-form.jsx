'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined)

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-border/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-primary">
          Create Account
        </CardTitle>
        <CardDescription className="text-center text-muted-foreground">
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <form action={action}>
        <CardContent className="space-y-4">
          {state?.message && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {state.message}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              required
              className="border-border/50 focus:border-primary focus:ring-primary"
            />
            {state?.errors?.name && (
              <p className="text-sm text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="border-border/50 focus:border-primary focus:ring-primary"
            />
            {state?.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground">Phone (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              className="border-border/50 focus:border-primary focus:ring-primary"
            />
            {state?.errors?.phone && (
              <p className="text-sm text-red-500">{state.errors.phone[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-foreground">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              className="border-border/50 focus:border-primary focus:ring-primary"
            />
            {state?.errors?.password && (
              <div className="text-sm text-red-500">
                <p>Password must:</p>
                <ul className="list-disc list-inside ml-2">
                  {state.errors.password.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            disabled={pending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-4"
          >
            {pending ? 'Creating account...' : 'Create Account'}
          </Button>
          
          <p className="text-sm text-center text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
