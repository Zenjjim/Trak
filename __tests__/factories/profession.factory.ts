import { PrismaClient } from '@prisma/client';

import { randomString } from '../utils/utils';
const prisma = new PrismaClient();

export const professionFactory = async () => {
  const profession = await prisma.profession.create({
    data: {
      title: randomString(),
    },
  });
  prisma.$disconnect();
  return profession;
};
