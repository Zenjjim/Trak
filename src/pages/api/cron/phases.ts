import { IEmployee, IPhase } from './../../../utils/types';
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
    console.log('RUN');
    phases.forEach((phase) => {
      if (phase?.cronDate?.setTime(0) == new Date().setTime(0)) {
        employees.forEach((employee) => {
          if (!employee?.terminationDate) {
            createEmployeeTasks(employee, phase);
          }
        });
        console.log(phase.cronDate);
        console.log(phase.title);
      }
    });
    console.log('STOP');
    res.status(HttpStatusCode.CREATED).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}

const createEmployeeTasks = async (employee, phase) => {
  const data = phase?.tasks.map((task) => ({
    employeeId: employee.id,
    responsibleId: task.responsibleId || employee.hrManagerId ,
    year: phase.dueDate,
    dueDate: phase.dueDate,
    taskId: task.id,
  }));
  console.log(data);
  await prisma.employeeTask.createMany({ data: data, skipDuplicates: true });
};
