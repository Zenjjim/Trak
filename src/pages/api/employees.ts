import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();
import withAuth from 'lib/withAuth';

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        imageUrl: true,
        employeeSettings: {
          select: {
            slack: true,
            notificationSettings: true,
          },
        },
      },
    });
    res.json(employees);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
});
