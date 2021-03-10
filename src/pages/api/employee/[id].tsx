import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import { toInteger } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  if (req.method === 'GET') {
    const employee = await prisma.employee.findUnique({
      where: {
        id: toInteger(id),
      },
    });
    res.status(HttpStatusCode.OK).json(employee);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
}
