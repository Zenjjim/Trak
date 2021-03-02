import { PrismaClient } from '@prisma/client';

import { randomString } from '../utils/utils';
const prisma = new PrismaClient();

export const taskFactory = async (amount: number) => {
  const phases = await prisma.phase.findMany();
  const array = [...Array(amount)].map(() => {
    return {
      title: randomString(),
      phaseId: phases[0].id,
    };
  });

  const tasks = await prisma.task.createMany({
    data: array,
  });
  prisma.$disconnect();
  return tasks;
};
