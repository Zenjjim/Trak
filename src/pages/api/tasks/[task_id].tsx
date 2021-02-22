import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ITag, ITask } from 'utils/types';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { task_id },
  } = req;
  if (req.method === 'PUT') {
    const {
      body: { data, phaseId, global },
    }: {
      body: { data: Pick<ITask, 'title' | 'description' | 'responsible' | 'tags'> & { professions: string[] }; phaseId: string; global: boolean };
    } = req;
    const getTask = await prisma.task.findUnique({
      where: {
        id: task_id.toString(),
      },
      select: {
        responsibleId: true,
      },
    });
    const updatedTask = await prisma.task.update({
      where: {
        id: task_id.toString(),
      },
      data: {
        title: data.title,
        description: data.description,
        global: global,
        phase: {
          connect: {
            id: phaseId,
          },
        },
        ...(data.responsible
          ? {
              responsible: {
                connect: {
                  id: data.responsible.id,
                },
              },
            }
          : Boolean(getTask.responsibleId) && {
              responsible: {
                disconnect: true,
              },
            }),
        tags: {
          set: [],
          connectOrCreate: data.tags?.map((tag: ITag) => ({
            where: {
              id: tag.id,
            },
            create: {
              title: tag.title,
            },
          })),
        },
        professions: {
          set: [],
          connect: data.professions.map((profession: string) => ({ id: profession })),
        },
      },
    });

    res.json(updatedTask);
  } else if (req.method === 'DELETE') {
    const deletedTask = await prisma.task.delete({ where: { id: task_id.toString() } });
    res.json(deletedTask);
  }
}
