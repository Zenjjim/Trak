import prisma from 'lib/prisma';

import { randomString } from '../utils/utils';

export const professionFactory = async () => {
  const profession = await prisma.profession.create({
    data: {
      title: randomString(),
    },
  });
  return profession;
};
