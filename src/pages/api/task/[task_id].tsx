import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { taskQuery } from 'utils/query';
import { ITask } from 'utils/types';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { task_id },
  } = req;
  if (req.method === 'PUT') {
    const {
      body: { data, phaseId, global },
    }: {
      body: { data: ITask; phaseId: string; global: boolean };
    } = req;
    const updatedTask = await prisma.task.update({
      where: {
        id: task_id.toString(),
      },
      data: taskQuery(data, phaseId, global),
    });
    res.json(updatedTask);
  } else if (req.method === 'DELETE') {
    const deletedTask = await prisma.task.delete({ where: { id: task_id.toString() } });
    res.json(deletedTask);
  }
}
