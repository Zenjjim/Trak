import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
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
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
}
