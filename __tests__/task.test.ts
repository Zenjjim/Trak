import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { createMocks } from 'node-mocks-http';
import tasksAPI from 'pages/api/tasks';
import singleTaskAPI from 'pages/api/tasks/[task_id]';

import { phaseFactory } from './factories/phase.factory';
import { randomString } from './utils/utils';

describe('/api/tasks', () => {
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
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        data: {
          title: randomString(),
          professions: professions,
          tags: [],
        },
        phaseId: phases[0].id,
        global: true,
      },
    });
    await tasksAPI(req, res);
    task = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(HttpStatusCode.CREATED);
  });
  test('get one task', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        task_id: task.id,
      },
    });

    await singleTaskAPI(req, res);

    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });

  test('delete one task', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        task_id: task.id,
      },
    });
    await singleTaskAPI(req, res);

    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });

  test('update one task', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: {
        task_id: task.id,
      },
      data: {
        data: task,
        phaseId: task.phaseId,
        global: true,
      },
    });
    await singleTaskAPI(req, res);

    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });
});
