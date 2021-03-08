import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();
export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const phases = await prisma.phase.findMany({
      select: {
        id: true,
        title: true,
        cronDate: true,
        dueDate: true,
        dueDateDayOffset: true,
        dueDateOffsetType: true,
        tasks: {
          where: {
            global: true,
          },
          select: {
            id: true,
            responsibleId: true,
            professions: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    const employees = await prisma.employee.findMany({
      select: {
        id: true,
        terminationDate: true,
        dateOfEmployment: true,
        professionId: true,
        hrManagerId: true,
        employeeTask: {
          select: {
            task: {
              select: {
                phase: {
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
    prisma.$disconnect();
    const today = new Date();
    phases.forEach((phase) => {
      if (phase?.cronDate?.getDate() === today.getDate() && phase?.cronDate?.getMonth() === today.getMonth()) {
        employees.forEach((employee) => {
          if (!employee?.terminationDate) {
            if (employee?.hrManagerId) {
              createEmployeeTasks(employee, phase);
            }
          }
        });
      }
    });
    res.status(HttpStatusCode.CREATED).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}

const createEmployeeTasks = async (employee, phase) => {
  const data = phase?.tasks.map((task) => {
    if (task.professions.map(({ id }) => id).includes(employee.professionId)) {
      return {
        employeeId: employee.id,
        responsibleId: task.responsibleId || employee.hrManagerId,
        year: phase.dueDate,
        dueDate: phase.dueDate,
        taskId: task.id,
      };
    }
  });
  await prisma.employeeTask.createMany({ data: data, skipDuplicates: true });
};
