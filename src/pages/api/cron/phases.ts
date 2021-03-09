import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
import { addDays } from 'utils/utils';

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

    const onboardingEmployeeTasks = await prisma.employeeTask.findMany({
      select: {
        id: true,
      },
      where: {
        task: {
          phase: {
            processTemplate: {
              slug: 'onboarding',
            },
          },
        },
      },
    });
    prisma.$disconnect();

    // CHECK ONBOARDING
    employees.forEach((employee) => {
      if (!employee.hrManagerId) {
        return;
      }
      if (intersectionBy(employee.employeeTask, onboardingEmployeeTasks, 'id').length === 0) {
        phases.forEach((phase) => {
          if (phase.processTemplate.slug === 'onboarding' && employee.dateOfEmployment) {
            phase.dueDate = addDays(employee.dateOfEmployment, phase.dueDateDayOffset);
            createEmployeeTasks(employee, phase);
          }
        });
      }
    });

    // CHECK LØPENDE
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

    res.status(HttpStatusCode.OK).end();
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}

const calculateDueDate = (phase: IPhase, employee: IEmployee) => {
  if (phase.dueDate) {
    return phase.dueDate;
  }

  if (phase.dueDateOffsetType === DUE_DATE_OFFSET_TYPE.TERMINATION_DATE && employee.terminationDate) {
    return moment(employee.terminationDate).add(phase.dueDateDayOffset, 'days').toDate();
  }

  //TODO:
  //Add for onboarding
};

const createEmployeeTasks = async (employee, phase) => {
  const year = calculateDueDate(phase, employee);
  const data = phase?.tasks.map((task) => {
    if (task.professions.map(({ id }) => id).includes(employee.professionId)) {
      return {
        employeeId: employee.id,
        responsibleId: task.responsibleId || employee.hrManagerId,
        year: new Date(year.getFullYear().toString()),
        dueDate: year,
        taskId: task.id,
      };
    }
  });

  await prisma.employeeTask.createMany({ data: data, skipDuplicates: true });
};
