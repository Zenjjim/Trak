import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { createMocks } from 'node-mocks-http';
import employeeAPI from 'pages/api/employees';

import { employeeFactory } from './factories/employee.factory';

describe('/api/employee', () => {
  beforeAll(async () => {
    await employeeFactory();
  });

  afterAll((done) => {
    prisma.$disconnect();
    done();
  });

  test('returns all employees', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await employeeAPI(req, res);
    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
    expect(JSON.parse(res._getData()).length).toBeGreaterThanOrEqual(1);
  });
});
