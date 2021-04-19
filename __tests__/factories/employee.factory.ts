import prisma from 'lib/prisma';

import { randomString } from '../utils/utils';
import { professionFactory } from './profession.factory';

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
  return employees;
};
