import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const tags = await prisma.tag.findMany({
      select: {
        title: true,
        id: true,
      },
    });
    res.json(tags);
  } else {
    res.status(405);
  }
  prisma.$disconnect();
}
