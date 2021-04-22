import HttpStatusCode from 'http-status-typed';
import { createMocks } from 'node-mocks-http';
import cronAPI from 'pages/api/cron/phases';

import { employeeFactory } from './factories/employee.factory';
import { taskFactory } from './factories/task.factory';

const CRON_SECRET = process.env.CRON_SECRET;

const cron_test = async (start, end) => {
  let loop = new Date(start);
  while (loop <= end) {
    Date.now = jest.fn(() => loop.valueOf());
    const { req, res } = createMocks({
      method: 'POST',
      headers: {
        CRON_SECRET: CRON_SECRET,
      },
    });

    await cronAPI(req, res);
    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
    const newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
  }
};

describe('/api/cron/phases/', () => {
  beforeAll(async () => {
    await employeeFactory();
    await taskFactory('lopende');
    await taskFactory('lopende');
    await taskFactory('lopende');
    await taskFactory('lopende');
  });

  test('Kvartal 1', async () => {
    jest.setTimeout(30000);
    const start = new Date('01/01/2020');
    const end = new Date('03/31/2020');
    await cron_test(start, end);
  });
  test('Kvartal 2', async () => {
    const start = new Date('04/01/2020');
    const end = new Date('06/30/2020');
    await cron_test(start, end);
  });
  test('Kvartal 3', async () => {
    const start = new Date('07/01/2020');
    const end = new Date('09/31/2020');
    await cron_test(start, end);
  });
  test('Kvartal 4', async () => {
    const start = new Date('10/01/2020');
    const end = new Date('12/31/2020');
    await cron_test(start, end);
  });
});