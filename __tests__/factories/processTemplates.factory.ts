import prisma from 'lib/prisma';

import { randomString } from '../utils/utils';

export const processTemplateFactory = async (slug = randomString()) => {
  const processTemplate = await prisma.processTemplate.upsert({
    where: {
      slug: slug,
    },
    update: {},
    create: {
      title: slug,
      slug: slug,
    },
  });
  return processTemplate;
};
