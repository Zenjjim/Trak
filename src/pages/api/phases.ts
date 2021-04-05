import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import withAuth from 'lib/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { data, processTemplateId },
    } = req;
    const newPhase = await prisma.phase.create({
      data: {
        title: data.title,
        processTemplateId: processTemplateId,
        dueDateDayOffset: data.dueDateDayOffset,
        dueDate: data.dueDate,
        cronDate: data.cronDate,
      },
    });
    res.status(HttpStatusCode.CREATED).json(newPhase);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
});
