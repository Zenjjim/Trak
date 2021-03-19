import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
import { addDays } from 'utils/utils';

const prisma = new PrismaClient();
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const CRON_SECRET = process.env.CRON_SECRET;

  if (req.headers.cron_secret !== CRON_SECRET) {
    res.status(HttpStatusCode.UNAUTHORIZED).end();
  }
  if (req.method === 'POST') {
    const phases = await prisma.phase.findMany({
      select: {
        id: true,
        title: true,
        cronDate: true,
        dueDate: true,
        dueDateDayOffset: true,
        processTemplate: {
          select: {
            slug: true,
          },
        },
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
            id: true,
            task: {
              select: {
                phase: {
                  select: {
                    id: true,
                    title: true,
                    processTemplate: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    prisma.$disconnect();

    cronDateEmployeeTaskCreator(phases, employees);
    nonCronDateEmployeeTaskCreator(phases, employees);

    res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}

const cronDateEmployeeTaskCreator = (phases, employees) => {
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
};
const nonCronDateEmployeeTaskCreator = (phases, employees) =>
  employees.forEach((employee) => {
    if (!employeeHasProcessTask(employee, 'onboarding')) {
      onboardingEmployeeTaskCreator(phases, employee);
    }
    if (employee.terminationDate && !employeeHasProcessTask(employee, 'offboarding')) {
      offboardingEmployeeTaskCreator(phases, employee);
    }
  });
const onboardingEmployeeTaskCreator = (phases, employee) =>
  phases.forEach((phase) => {
    if (phase.processTemplate.slug === 'onboarding' && employee.dateOfEmployment) {
      phase.dueDate = addDays(employee.dateOfEmployment, phase.dueDateDayOffset);
      createEmployeeTasks(employee, phase);
    }
  });
const offboardingEmployeeTaskCreator = (phases, employee) =>
  phases.forEach((phase) => {
    if (phase.processTemplate.slug === 'offboarding') {
      phase.dueDate = addDays(employee.terminationDate, phase.dueDateDayOffset);
      createEmployeeTasks(employee, phase);
    }
  });
const employeeHasProcessTask = (employee, processTitle) =>
  employee.employeeTask.some((employeeTask) => employeeTask.task.phase.processTemplate.slug === processTitle);

const createEmployeeTasks = async (employee, phase) => {
  const data = phase?.tasks.map((task) => {
    if (task.professions.map(({ id }) => id).includes(employee.professionId)) {
      if (!task.responsibleId && !employee.hrManagerId) {
        return;
      }
      return {
        employeeId: employee.id,
        responsibleId: task.responsibleId || employee.hrManagerId,
        dueDate: phase.dueDate,
        taskId: task.id,
      };
    }
  });

  await prisma.employeeTask.createMany({ data: data, skipDuplicates: true });
};
