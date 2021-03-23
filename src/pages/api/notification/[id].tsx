import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  if (req.method === 'PUT') {
    const notification = await prisma.notification.update({
      where: {
        id: id.toString(),
      },
      data: {
        read: true,
      },
    });
    res.status(HttpStatusCode.OK).json(notification);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
}
