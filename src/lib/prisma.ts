// https://github.com/prisma/prisma/issues/1983

import { PrismaClient } from '@prisma/client';
import { formatDateInObject } from 'utils/utilFunctions';

const prismaClientPropertyName = `__prevent-name-collision__prisma`;
type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient;
};

const getPrismaClient = () => {
  if (process.env.NODE_ENV === `production`) {
    return new PrismaClient();
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient;
    if (!newGlobalThis[prismaClientPropertyName]) {
      newGlobalThis[prismaClientPropertyName] = new PrismaClient();
    }
    return newGlobalThis[prismaClientPropertyName];
  }
};

const prisma = getPrismaClient();

prisma.$use(async (params, next) => {
  const result = await next(params);
  return formatDateInObject(result);
});

export default prisma;
