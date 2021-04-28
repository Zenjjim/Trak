import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';
import employeeTaskAPI from 'pages/api/employeeTasks/[id]';

import { employeeTaskFactory } from './factories/employeeTask.factory';
import { randomString } from './utils/utils';

describe('/api/employeeTask', () => {
  const employeeTaskAPIHandler: typeof employeeTaskAPI & { config?: PageConfig } = employeeTaskAPI;

  let employeeTask;
  beforeAll(async () => {
    employeeTask = await employeeTaskFactory();
  });

  afterAll((done) => {
    prisma.$disconnect();
    done();
  });

  test('Get employeeTask', async () => {
    await testApiHandler({
      handler: employeeTaskAPIHandler,
      params: { id: employeeTask.id },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });

  test('Complete employeeTask', async () => {
    await testApiHandler({
      handler: employeeTaskAPIHandler,
      params: {
        id: employeeTask.id,
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            completed: true,
            dueDate: employeeTask.dueDate,
            responsibleId: employeeTask.responsibleId,
          }),
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });

  test('Get employeeTask which does not exist', async () => {
    await testApiHandler({
      handler: employeeTaskAPIHandler,
      params: { id: randomString() },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
        });
        expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
      },
    });
  });

  test('Complete employeeTask which does not exist', async () => {
    await testApiHandler({
      handler: employeeTaskAPIHandler,
      params: {
        id: randomString(),
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            completed: true,
            dueDate: employeeTask.dueDate,
            responsibleId: employeeTask.responsibleId,
          }),
        });
        expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
      },
    });
  });

  test('Method not allowed', async () => {
    await testApiHandler({
      handler: employeeTaskAPIHandler,
      params: { id: employeeTask.id },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'DELETE',
        });
        expect(res.status).toBe(HttpStatusCode.METHOD_NOT_ALLOWED);
      },
    });
  });
});
