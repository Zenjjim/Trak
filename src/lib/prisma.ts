// https://github.com/prisma/prisma/issues/1983

import { PrismaClient } from '@prisma/client';

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

//TODO: SKITTENT SOM FAEEEN
prisma.$use(async (params, next) => {
  const result = await next(params);
  const betterDateResult = result.map((e) => {
    const a = e;
    Object.entries(e).forEach((k) => {
      if (k[1] instanceof Date) {
        a[k[0]] = k[1].toISOString().substring(0, 10);
      }
    });
    return a;
  });
  return betterDateResult;
});

export default prisma;
