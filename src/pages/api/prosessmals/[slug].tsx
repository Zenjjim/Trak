import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { taskQuery } from 'utils/query';
import { ITask } from 'utils/types';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { slug },
  } = req;
  if (req.method === 'GET') {
    const processTemplate = await prisma.processTemplate.findUnique({
      where: {
        slug: slug.toString(),
      },
      include: {
        phases: {
          orderBy: {
            order: 'asc',
          },
          select: {
            id: true,
            order: true,
            title: true,
            tasks: {
              where: {
                global: true,
              },
              select: {
                id: true,
                title: true,
                description: true,
                tags: true,
                professions: true,
                responsible: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    imageUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    res.json(processTemplate);
  }
}
