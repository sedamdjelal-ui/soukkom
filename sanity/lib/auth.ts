import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || 'fallback_secret_change_me'
)

export type SessionUser = {
  id: string
  name: string
  email: string
  storeName: string
}

export async function createSession(user: SessionUser) {
  const token = await new SignJWT({
    id: user.id,
    name: user.name,
    email: user.email,
    storeName: user.storeName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('session')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload as unknown as SessionUser
  } catch {
    return null
  }
}

export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}