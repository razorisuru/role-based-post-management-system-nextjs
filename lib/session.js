import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

// Session duration: 7 days
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000

export async function encrypt(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session) {
  if (!session) {
    return null
  }
  
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    // Only log if there's an actual session that failed to verify
    if (process.env.NODE_ENV === 'development') {
      console.log('Failed to verify session:', error.message)
    }
    return null
  }
}

export async function createSession(userId, role) {
  const expiresAt = new Date(Date.now() + SESSION_DURATION)
  const session = await encrypt({ userId, role, expiresAt: expiresAt.toISOString() })
  const cookieStore = await cookies()

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  return { session, expiresAt }
}

export async function updateSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  const payload = await decrypt(session)

  if (!session || !payload) {
    return null
  }

  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  })

  return payload
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  
  if (!session) {
    return null
  }

  return await decrypt(session)
}
