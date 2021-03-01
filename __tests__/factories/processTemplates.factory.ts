import { PrismaClient } from '@prisma/client';

import { randomString } from '../utils';
const prisma = new PrismaClient();

export const processTemplateFactory = async () => {
  const processTemplate = await prisma.processTemplate.create({
    data: {
      title: randomString(),
      slug: randomString(),
    },
  });
  prisma.$disconnect();
  return processTemplate;
};
