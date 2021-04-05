import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import withAuth from 'lib/withAuth';
import { toInteger } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  if (req.method === 'GET') {
    const employee = await prisma.notification.findMany({
      where: {
        employeeId: toInteger(id),
        read: false,
      },
      orderBy: [
        {
          createdAt: 'asc',
        },
      ],
    });
    res.status(HttpStatusCode.OK).json(employee);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
});
