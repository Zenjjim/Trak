import prisma from 'lib/prisma';

import { randomString } from '../utils/utils';

export const processTemplateFactory = async () => {
  const processTemplate = await prisma.processTemplate.create({
    data: {
      title: randomString(),
      slug: randomString(),
    },
  });
  return processTemplate;
};
