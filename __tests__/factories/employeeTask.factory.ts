import prisma from 'lib/prisma';

import { employeeFactory } from './employee.factory';
import { taskFactory } from './task.factory';
export const employeeTaskFactory = async () => {
  const task = await taskFactory();
  const employee = await employeeFactory();
  const responsible = await employeeFactory();

  const employeeTask = await prisma.employeeTask.create({
    data: {
      completed: false,
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
  return employeeTask;
};
