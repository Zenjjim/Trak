import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Actions } from 'utils/types';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    if (req.body.action === Actions.UpdateDueDate) {
      try {
        const {
          body: { dueDate, employeeTasksId },
        } = req;
        await prisma.employeeTask.updateMany({
          where: {
            id: {
              in: employeeTasksId,
            },
          },
          data: {
            dueDate: dueDate,
          },
        });
        res.json(HttpStatusCode.OK);
      } catch (err) {
        if (err) {
          res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
        } else {
          res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
        }
      }
    } else {
      res.status(HttpStatusCode.BAD_REQUEST).end();
    }
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
}
