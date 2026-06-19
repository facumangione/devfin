import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'

export async function getCategories(_req: Request, res: Response): Promise<void> {
  const categories = await prisma.category.findMany({
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  })

  res.json({ data: categories })
}
