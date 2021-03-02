import { PrismaClient } from '@prisma/client';

import { randomString } from '../utils/utils';
import { professionFactory } from './profession.factory';
const prisma = new PrismaClient();

export const employeeFactory = async () => {
  const professions = await professionFactory();

  const employees = await prisma.employee.create({
    data: {
      firstName: randomString(),
      lastName: randomString(),
      email: randomString(),
      birthDate: new Date(),
      professionId: professions.id,
    },
  });
  prisma.$disconnect();
  return employees;
};
