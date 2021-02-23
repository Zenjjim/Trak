import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const professions = await prisma.profession.findMany({
      select: {
        title: true,
        id: true,
      },
    });
    res.json(professions);
  }
}
