import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import withAuth from 'lib/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { IProfession, ITag } from 'utils/types';

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { data, phaseId, global },
    } = req;
    const newTask = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        link: data.link,
        global: global,
        phase: {
          connect: {
            id: phaseId,
          },
        },
        ...(data.responsible && {
          responsible: {
            connect: {
              id: parseInt(data.responsible.id),
            },
          },
        }),
        tags: {
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
          connect: data.professions.map((profession: IProfession) => ({ id: profession.id })),
        },
      },
    });
    res.status(HttpStatusCode.CREATED).json(newTask);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
});
