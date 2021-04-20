import prisma from 'lib/prisma';

import { randomString } from '../utils/utils';
import { phaseFactory } from './phase.factory';
export const taskFactory = async (slug = undefined) => {
  const phase = await phaseFactory(slug);

  const task = await prisma.task.create({
    data: {
      title: randomString(),
      description: randomString(),
      global: true,
      phase: {
        connect: {
          id: phase.id,
        },
      },
    },
  });
  return task;
};
