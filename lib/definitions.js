import { z } from 'zod'

// Signup form validation schema
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(100, { message: 'Name must be less than 100 characters.' })
    .trim(),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' })
    .regex(/[a-zA-Z]/, { message: 'Password must contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character.' }),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val), {
      message: 'Please enter a valid phone number.',
    }),
})

// Login form validation schema
export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address.' })
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, { message: 'Password is required.' }),
})

// Update profile schema
export const UpdateProfileSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters long.' })
    .max(100, { message: 'Name must be less than 100 characters.' })
    .trim()
    .optional(),
  phone: z
    .string()
    .optional()
    .refine((val) => !val || /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(val), {
      message: 'Please enter a valid phone number.',
    }),
  avatar: z.string().url({ message: 'Please enter a valid URL.' }).optional().nullable(),
})

// Role permission schema for admin
export const RolePermissionSchema = z.object({
  roleId: z.string().min(1, { message: 'Role ID is required.' }),
  permissionIds: z.array(z.string()).min(0),
})
