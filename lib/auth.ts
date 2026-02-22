import { cookies } from "next/headers"
import { prisma } from "@/lib/db"

// ── Types ────────────────────────────────────────────────────────────────
export interface User {
  id: string
  identifier: string
  type: "email" | "phone"
  createdAt: string
}

export interface Session {
  id: string
  userId: string
  expiresAt: number
}

const SESSION_COOKIE = "social-saver-session"
const OTP_TTL_MS = 5 * 60 * 1000 // 5 minutes
const SESSION_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

// ── OTP ──────────────────────────────────────────────────────────────────
export async function generateOtp(identifier: string): Promise<string> {
  const code = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + OTP_TTL_MS)

  await prisma.otp.upsert({
    where: { identifier },
    create: { identifier, code, expiresAt },
    update: { code, expiresAt },
  })

  return code
}

export async function verifyOtp(identifier: string, code: string): Promise<boolean> {
  const row = await prisma.otp.findUnique({ where: { identifier } })
  if (!row) return false
  if (new Date() > row.expiresAt) {
    await prisma.otp.delete({ where: { identifier } }).catch(() => {})
    return false
  }
  if (row.code !== code) return false
  await prisma.otp.delete({ where: { identifier } })
  return true
}

// ── Users ────────────────────────────────────────────────────────────────
export async function findOrCreateUser(
  identifier: string,
  type: "email" | "phone"
): Promise<User> {
  const existing = await prisma.user.findUnique({
    where: { identifier },
  })
  if (existing) {
    return toUser(existing)
  }

  const user = await prisma.user.create({
    data: { identifier, type },
  })
  return toUser(user)
}

export async function getUserById(id: string): Promise<User | undefined> {
  const user = await prisma.user.findUnique({ where: { id } })
  return user ? toUser(user) : undefined
}

function toUser(row: { id: string; identifier: string; type: string; createdAt: Date }): User {
  return {
    id: row.id,
    identifier: row.identifier,
    type: row.type as "email" | "phone",
    createdAt: row.createdAt.toISOString(),
  }
}

// ── Sessions ─────────────────────────────────────────────────────────────
export async function createSession(userId: string): Promise<Session> {
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS)
  const session = await prisma.session.create({
    data: { userId, expiresAt },
  })
  return {
    id: session.id,
    userId: session.userId,
    expiresAt: expiresAt.getTime(),
  }
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  })
  if (!session) return null
  if (new Date() > session.expiresAt) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
    return null
  }
  return {
    id: session.id,
    userId: session.userId,
    expiresAt: session.expiresAt.getTime(),
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
}

// ── Session + Cookie helpers for route handlers ──────────────────────────
export async function getAuthenticatedUser(): Promise<{
  user: User
  session: Session
} | null> {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value
  if (!sessionId) return null

  const session = await getSession(sessionId)
  if (!session) return null

  const user = await getUserById(session.userId)
  if (!user) return null

  return { user, session }
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE
}
