import { PrismaClient } from '@prisma/client';

import { randomString } from './../utils/utils';
import { processTemplateFactory } from './processTemplates.factory';

const prisma = new PrismaClient();

export const phaseFactory = async () => {
  const processTemplate = await processTemplateFactory();

  const phase = await prisma.phase.create({
    data: {
      title: randomString(),
      processTemplate: {
        connect: {
          id: processTemplate.id,
        },
      },
    },
  });
  prisma.$disconnect();
  return phase;
};
