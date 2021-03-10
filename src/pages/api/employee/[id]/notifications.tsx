import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import { toInteger } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id, limit, offset, read },
  } = req;
  if (req.method === 'GET') {
    if (read === 'false') {
      const employee = await prisma.notification.count({
        where: {
          employeeId: toInteger(id),
          read: false,
        },
      });
      res.status(HttpStatusCode.OK).json(employee);
    } else {
      const employee = await prisma.notification.findMany({
        where: {
          employeeId: toInteger(id),
        },
        orderBy: [
          {
            read: 'asc',
          },
          {
            createdAt: 'asc',
          },
        ],
        skip: parseInt(offset?.toString()) || 0,
        take: parseInt(limit?.toString()) || 5,
      });
      res.status(HttpStatusCode.OK).json(employee);
    }
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
}
