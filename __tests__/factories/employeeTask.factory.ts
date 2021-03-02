import { PrismaClient } from '@prisma/client';

import { employeeFactory } from './employee.factory';
import { taskFactory } from './task.factory';

const prisma = new PrismaClient();

export const employeeTaskFactory = async () => {
  const task = await taskFactory();
  const employee = await employeeFactory();
  const responsible = await employeeFactory();

  const employeeTask = await prisma.employeeTask.create({
    data: {
      completed: false,
      year: new Date(),
      dueDate: new Date(),
      task: {
        connect: {
          id: task.id,
        },
      },
      employee: {
        connect: {
          id: employee.id,
        },
      },
      responsible: {
        connect: {
          id: responsible.id,
        },
      },
    },
  });
  prisma.$disconnect();
  return employeeTask;
};
