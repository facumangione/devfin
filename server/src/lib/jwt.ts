import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

interface TokenPayload {
  userId: string
  email: string
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as any,
  })
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
  })
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as TokenPayload
}

export async function saveRefreshToken(userId: string, token: string): Promise<void> {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  await prisma.refreshToken.create({
    data: { token, userId, expiresAt },
  })
}

export async function revokeRefreshToken(token: string): Promise<void> {
  await prisma.refreshToken.deleteMany({ where: { token } })
}

export async function isRefreshTokenValid(token: string): Promise<boolean> {
  const record = await prisma.refreshToken.findUnique({ where: { token } })
  if (!record) return false
  if (record.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { token } })
    return false
  }
  return true
}