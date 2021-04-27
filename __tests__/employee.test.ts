import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';
import employeeAPI from 'pages/api/employees';

import { employeeFactory } from './factories/employee.factory';

describe('/api/employee', () => {
  const employeeAPIHandler: typeof employeeAPI & { config?: PageConfig } = employeeAPI;

  beforeAll(async () => {
    await employeeFactory();
  });

  afterAll((done) => {
    prisma.$disconnect();
    done();
  });

  test('returns all employees', async () => {
    await testApiHandler({
      handler: employeeAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });
});
