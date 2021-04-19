import prisma from 'lib/prisma';

import { randomString } from '../utils/utils';
export const tagsFactory = async () => {
  const tags = await prisma.tag.create({
    data: {
      title: randomString(),
    },
  });
  return tags;
};
