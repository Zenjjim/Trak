import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { taskQuery } from 'utils/query';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { data, phaseId, global },
    } = req;
    const newTask = await prisma.task.create({
      data: taskQuery(data, phaseId, global),
    });
    res.json(newTask);
  }
}
