import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import withAuth from 'lib/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
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
});
