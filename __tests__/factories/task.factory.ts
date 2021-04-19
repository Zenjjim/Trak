import prisma from 'lib/prisma';

import { randomString } from '../utils/utils';
import { phaseFactory } from './phase.factory';
export const taskFactory = async () => {
  const phase = await phaseFactory();

  const task = await prisma.task.create({
    data: {
      title: randomString(),
      description: randomString(),
      global: false,
      phase: {
        connect: {
          id: phase.id,
        },
      },
    },
  });
  return task;
};
