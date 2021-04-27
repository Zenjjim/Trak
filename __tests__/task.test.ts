import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';
import tasksAPI from 'pages/api/tasks';
import singleTaskAPI from 'pages/api/tasks/[task_id]';

import { phaseFactory } from './factories/phase.factory';
import { randomString } from './utils/utils';

describe('/api/tasks handling errors', () => {
  const singleTaskAPIHandler: typeof singleTaskAPI & { config?: PageConfig } = singleTaskAPI;
  const tasksAPIHandler: typeof singleTaskAPI & { config?: PageConfig } = tasksAPI;

  beforeAll(async () => {
    await phaseFactory();
  });

  afterAll((done) => {
    prisma.$disconnect();
    done();
  });
  let task;
  test('create new task', async () => {
    const phases = await prisma.phase.findMany();
    const professions = await prisma.profession.findMany();
    await testApiHandler({
      handler: tasksAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              title: randomString(),
              professions: professions,
              tags: [],
            },
            phaseId: phases[0].id,
            global: true,
          }),
        });
        task = await res.json();
        expect(res.status).toBe(HttpStatusCode.CREATED);
      },
    });
  });
  test('get one task', async () => {
    await testApiHandler({
      handler: singleTaskAPIHandler,
      params: {
        task_id: task.id,
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });

  test('get task that does noe exist', async () => {
    await testApiHandler({
      handler: singleTaskAPIHandler,
      params: { task_id: 'test' },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET' });
        expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
      },
    });
  });

  test('delete one task', async () => {
    await testApiHandler({
      handler: singleTaskAPIHandler,
      params: { task_id: task.id },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE' });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });

  test('delete task which does not exist', async () => {
    await testApiHandler({
      handler: singleTaskAPIHandler,
      params: { task_id: randomString() },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE' });
        expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
      },
    });
  });

  test('update one task', async () => {
    await testApiHandler({
      handler: singleTaskAPIHandler,
      params: { task_id: task.id },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            data: task,

            phaseId: task.phaseId,
            global: true,
          }),
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });
});
