'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { SignupFormSchema, LoginFormSchema } from '@/lib/definitions'
import { createSession, deleteSession } from '@/lib/session'

export async function signup(state, formData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    phone: formData.get('phone') || undefined,
  })

  // Return early if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    }
  }

  const { name, email, password, phone } = validatedFields.data

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return {
        errors: { email: ['An account with this email already exists.'] },
        message: 'Registration failed.',
      }
    }

    // Get default role (user)
    const defaultRole = await db.role.findFirst({
      where: { isDefault: true },
    })

    if (!defaultRole) {
      return {
        message: 'System error: Default role not found. Please contact administrator.',
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone: phone || null,
        roleId: defaultRole.id,
      },
      include: {
        role: true,
      },
    })

    // Create session
    await createSession(user.id, user.role.name)
  } catch (error) {
    console.error('Signup error:', error)
    return {
      message: 'An error occurred during registration. Please try again.',
    }
  }

  redirect('/dashboard')
}

export async function login(state, formData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  // Return early if validation fails
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Please fix the errors above.',
    }
  }

  const { email, password } = validatedFields.data

  try {
    // Find user by email
    const user = await db.user.findUnique({
      where: { email },
      include: {
        role: true,
      },
    })

    if (!user) {
      return {
        errors: { email: ['Invalid email or password.'] },
        message: 'Login failed.',
      }
    }

    // Check user status
    if (user.status === 'SUSPENDED') {
      return {
        message: 'Your account has been suspended. Please contact administrator.',
      }
    }

    if (user.status === 'INACTIVE') {
      return {
        message: 'Your account is inactive. Please contact administrator.',
      }
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return {
        errors: { email: ['Invalid email or password.'] },
        message: 'Login failed.',
      }
    }

    // Create session
    await createSession(user.id, user.role.name)
  } catch (error) {
    console.error('Login error:', error)
    return {
      message: 'An error occurred during login. Please try again.',
    }
  }

  redirect('/dashboard')
}

export async function logout() {
  await deleteSession()
  redirect('/login')
}
