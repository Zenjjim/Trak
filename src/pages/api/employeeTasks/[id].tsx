import { Error } from '@material-ui/icons';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  if (req.method === 'GET') {
    GET(res, id);
  } else if (req.method === 'PUT') {
    PUT(req, res, id);
  } else {
    res.status(405);
  }
  prisma.$disconnect();
}

const GET = async (res, id) => {
  try {
    const employeeTask = await prisma.employeeTask.findUnique({
      where: {
        id: id.toString(),
      },
      select: {
        id: true,
        completed: true,
        year: true,
        dueDate: true,
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        responsible: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
            description: true,
            global: true,
            tags: {
              select: {
                id: true,
                title: true,
              },
            },
            phase: {
              select: {
                id: true,
                title: true,
                processTemplate: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!employeeTask) {
      throw new Error();
    }
    res.status(200).json(employeeTask);
  } catch (err) {
    if (err) {
      res.status(404).send({ message: err?.meta?.cause });
    } else {
      res.status(500).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};

type employeeTaskUpdateData = {
  body: {
    completed: boolean;
    dueDate: Date;
    responsibleId: number;
  };
};

const PUT = async (req, res, id) => {
  const {
    body: { completed, dueDate, responsibleId },
  }: employeeTaskUpdateData = req;
  try {
    const updatedEmployeeTask = await prisma.employeeTask.update({
      where: {
        id: id.toString(),
      },
      data: {
        completed: completed,
        dueDate: dueDate,
        responsible: {
          connect: {
            id: responsibleId,
          },
        },
      },
    });
    res.status(200).json(updatedEmployeeTask);
  } catch (err) {
    if (err) {
      res.status(404).send({ message: err?.meta?.cause });
    } else {
      res.status(500).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
