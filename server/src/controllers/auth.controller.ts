import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import {
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  isRefreshTokenValid,
} from '../lib/jwt'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export async function register(req: Request, res: Response): Promise<void> {
  const result = registerSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { name, email, password } = result.data

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    res.status(409).json({ error: 'An account with this email already exists' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  const accessToken = generateAccessToken({ userId: user.id, email: user.email })
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email })
  await saveRefreshToken(user.id, refreshToken)

  res.status(201).json({ user, accessToken, refreshToken })
}

export async function login(req: Request, res: Response): Promise<void> {
  const result = loginSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { email, password } = result.data

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
  if (!isPasswordValid) {
    res.status(401).json({ error: 'Invalid email or password' })
    return
  }

  const accessToken = generateAccessToken({ userId: user.id, email: user.email })
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email })
  await saveRefreshToken(user.id, refreshToken)

  const { passwordHash: _, ...userWithoutPassword } = user
  res.json({ user: userWithoutPassword, accessToken, refreshToken })
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body

  if (!refreshToken) {
    res.status(400).json({ error: 'Refresh token is required' })
    return
  }

  try {
    const isValid = await isRefreshTokenValid(refreshToken)
    if (!isValid) {
      res.status(401).json({ error: 'Invalid or expired refresh token' })
      return
    }

    const payload = verifyRefreshToken(refreshToken)
    await revokeRefreshToken(refreshToken)

    const newAccessToken = generateAccessToken({ userId: payload.userId, email: payload.email })
    const newRefreshToken = generateRefreshToken({ userId: payload.userId, email: payload.email })
    await saveRefreshToken(payload.userId, newRefreshToken)

    res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  } catch {
    res.status(401).json({ error: 'Invalid or expired refresh token' })
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body

  if (refreshToken) {
    await revokeRefreshToken(refreshToken).catch(() => {})
  }

  res.status(204).send()
}

export async function me(req: Request, res: Response): Promise<void> {
  const userId = (req as any).user?.userId

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  })

  if (!user) {
    res.status(404).json({ error: 'User not found' })
    return
  }

  res.json({ user })
}
