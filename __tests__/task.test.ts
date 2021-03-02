import { PrismaClient } from '@prisma/client';
import { createMocks } from 'node-mocks-http';
import tasksAPI from 'pages/api/tasks';
import singleTaskAPI from 'pages/api/tasks/[task_id]';
import { StatusCode } from 'status-code-enum';

import { randomString } from './utils/utils';

const prisma = new PrismaClient();
describe('/api/tasks', () => {
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
    expect(res._getStatusCode()).toBe(StatusCode.SuccessCreated);
  });
  test('get one task', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        task_id: task.id,
      },
    });

    await singleTaskAPI(req, res);

    expect(res._getStatusCode()).toBe(StatusCode.SuccessOK);
  });

  test('delete one task', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: {
        task_id: task.id,
      },
    });
    await singleTaskAPI(req, res);

    expect(res._getStatusCode()).toBe(StatusCode.SuccessOK);
  });
  //TODO:
  // FIX THIS
  /* test('get a deleted task', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {
        task_id: 'blælsdkgjsdkjgdskjgnsdn',
      },
    });
    await singleTaskAPI(req, res);
    expect(res._getStatusCode()).toBe(StatusCode.ClientErrorNotFound);
  }); */
});
