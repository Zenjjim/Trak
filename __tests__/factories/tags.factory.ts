import { PrismaClient } from '@prisma/client';

import { randomString } from '../utils/utils';

const prisma = new PrismaClient();

export const tagsFactory = async () => {
  const tags = await prisma.tag.create({
    data: {
      title: randomString(),
    },
  });
  prisma.$disconnect();
  return tags;
};
