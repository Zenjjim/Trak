import { PrismaClient } from '@prisma/client';

import { randomString } from '../utils/utils';
import { phaseFactory } from './phase.factory';

const prisma = new PrismaClient();

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
  prisma.$disconnect();
  return task;
};
