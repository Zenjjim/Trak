import prisma from 'lib/prisma';

import { randomString } from './../utils/utils';
import { processTemplateFactory } from './processTemplates.factory';
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
  return phase;
};
