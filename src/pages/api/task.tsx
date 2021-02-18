import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { body } = req;
    const data = body.data;
    const phaseId = body.phaseId;
    const newTask = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        global: true,
        phase: {
          connect: {
            id: phaseId,
          },
        },
        responsible: {
          connect: data.responsible && {
            id: data.responsible.id,
          },
        },
        tags: {
          connectOrCreate: data.tags?.map((tag) => ({
            where: {
              id: tag.id,
            },
            create: {
              title: tag.title,
            },
          })),
        },
        professions: {
          connect: data.professions.map((profession) => ({ id: profession })),
        },
      },
    });
    res.json(newTask);
  }
}
