import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ITag } from 'utils/types';
const prisma = new PrismaClient();

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { task_id },
  } = req;
  if (req.method === 'GET') {
    GET(res, task_id);
  } else if (req.method === 'PUT') {
    PUT(req, res, task_id);
  } else if (req.method === 'DELETE') {
    DELETE(res, task_id);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
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
    if (!task) {
      throw new Error();
    }
    res.status(HttpStatusCode.OK).json(task);
  } catch (err) {
    if (err) {
      res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};

const PUT = async (req, res, task_id) => {
  const {
    body: { data, phaseId, global },
  } = req;
  try {
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
    res.status(HttpStatusCode.OK).json(updatedTask);
  } catch (err) {
    if (err) {
      res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
const DELETE = async (res, task_id) => {
  try {
    const deletedTask = await prisma.task.delete({ where: { id: task_id.toString() } });
    res.status(HttpStatusCode.OK).json(deletedTask);
  } catch (err) {
    if (err) {
      res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
