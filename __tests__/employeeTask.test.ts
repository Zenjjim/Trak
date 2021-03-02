import HttpStatusCode from 'http-status-typed';
import { createMocks } from 'node-mocks-http';
import employeeTaskAPI from 'pages/api/employeeTasks/[id]';

import { employeeTaskFactory } from './factories/employeeTask.factory';

describe('/api/employeeTask', () => {
  let employeeTask;
  beforeAll(async () => {
    employeeTask = await employeeTaskFactory();
  });

  describe('Get task', () => {
    test('Get employeeTask', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { id: employeeTask.id },
      });

      await employeeTaskAPI(req, res);

      expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
    });
  });

  describe('Complete task', () => {
    test('Complete employeeTask', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
        query: { id: employeeTask.id },
        body: {
          data: {
            completed: true,
          },
        },
      });
      await employeeTaskAPI(req, res);
      expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
    });
  });
});
