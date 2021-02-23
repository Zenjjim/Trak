import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ITag } from 'utils/types';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { task_id },
  } = req;
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> refactor(api): handle errors in  api
  if (req.method === 'GET') {
    GET(res, task_id);
  } else if (req.method === 'PUT') {
    PUT(req, res, task_id);
  } else if (req.method === 'DELETE') {
    DELETE(res, task_id);
  }
}

const GET = async (res, task_id) => {
  try {
    const task = await prisma.task.findUnique({
      where: {
        id: task_id.toString(),
      },
      select: {
        id: true,
        title: true,
        description: true,
        phaseId: true,
        tags: {
          select: {
            id: true,
            title: true,
          },
        },
        professions: {
          select: {
            id: true,
            title: true,
          },
        },
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
      },
    });
    res.json(task);
  } catch (err) {
    res.status(404).send({ message: err.meta.cause });
  }
};

const PUT = async (req, res, task_id) => {
  const {
    body: { data, phaseId, global },
  } = req;
  try {
<<<<<<< HEAD
=======
  if (req.method === 'PUT') {
    const {
      body: { data, phaseId, global },
    }: {
      body: { data: ITask; phaseId: string; global: boolean };
    } = req;
>>>>>>> refactor(prosessmal): update query and  react hook form for performance and clearer code
=======
>>>>>>> refactor(api): handle errors in  api
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
          connect: data.professions.map((profession) => ({ id: profession.id })),
        },
      },
    });
    res.json(updatedTask);
  } catch (err) {
    res.status(404).send({ message: err.meta.cause });
  }
};
const DELETE = async (res, task_id) => {
  try {
<<<<<<< HEAD
    const deletedTask = await prisma.task.delete({ where: { id: task_id.toString() } });
=======
    const deletedTask = await prisma.task.delete({ where: { id: task_id.toString() + '1' } });
>>>>>>> refactor(api): handle errors in  api
    res.json(deletedTask);
  } catch (err) {
    res.status(404).send({ message: err.meta.cause });
  }
};
