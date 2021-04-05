import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();
import withAuth from 'lib/withAuth';

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  if (req.method === 'GET') {
    const employee = await prisma.employee.findUnique({
      where: {
        email: id.toString(),
      },
    });
    res.status(HttpStatusCode.OK).json(employee);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
});
