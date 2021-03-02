import { PrismaClient } from '@prisma/client';

import { randomString } from '../utils/utils';
const prisma = new PrismaClient();

export const employeeFactory = async (amount: number) => {
  const professions = await prisma.profession.findMany();

  const array = [...Array(amount)].map(() => {
    return {
      firstName: randomString(),
      lastName: randomString(),
      email: randomString(),
      birthDate: new Date(),
      professionId: professions[0].id,
    };
  });

  const employees = await prisma.employee.createMany({
    data: array,
  });
  prisma.$disconnect();
  return employees;
};
