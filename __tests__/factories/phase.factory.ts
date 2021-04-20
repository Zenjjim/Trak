import prisma from 'lib/prisma';

import { randomString } from './../utils/utils';
import { processTemplateFactory } from './processTemplates.factory';
export const phaseFactory = async (slug = undefined) => {
  const processTemplate = await processTemplateFactory(slug);
  const start = new Date('01/01/2020');
  const end = new Date('12/31/2020');

  function getRandomDate(from, to) {
    from = from.getTime();
    to = to.getTime();
    return new Date(from + Math.random() * (to - from));
  }
  const dueDate = getRandomDate(start, end);

  const phase = await prisma.phase.create({
    data: {
      title: randomString(),
      dueDate: dueDate,
      processTemplate: {
        connect: {
          id: processTemplate.id,
        },
      },
    },
  });
  return phase;
};
