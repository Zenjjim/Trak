import HttpStatusCode from 'http-status-typed';
import { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';
import cronAPI from 'pages/api/cron/phases';

import { employeeFactory } from './factories/employee.factory';
import { taskFactory } from './factories/task.factory';
import { randomString } from './utils/utils';

const CRON_SECRET_TOKEN = process.env.CRON_SECRET;
const cronAPIHandler: typeof cronAPI & { config?: PageConfig } = cronAPI;

const cron_test = async (start, end) => {
  let loop = new Date(start);
  while (loop <= end) {
    Date.now = jest.fn(() => loop.valueOf());
    await testApiHandler({
      handler: cronAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            cron_secret: CRON_SECRET_TOKEN,
          },
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });

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

  test('With incorrect cron_secret', async () => {
    await testApiHandler({
      handler: cronAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            CRON_SECRET: randomString(),
          },
        });
        expect(res.status).toBe(HttpStatusCode.UNAUTHORIZED);
      },
    });
  });

  test('Method not allowed', async () => {
    await testApiHandler({
      handler: cronAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
          headers: {
            CRON_SECRET: CRON_SECRET_TOKEN,
          },
        });
        expect(res.status).toBe(HttpStatusCode.METHOD_NOT_ALLOWED);
      },
    });
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
    const end = new Date('09/30/2020');
    await cron_test(start, end);
  });
  test('Kvartal 4', async () => {
    const start = new Date('10/01/2020');
    const end = new Date('12/31/2020');
    await cron_test(start, end);
  });
});
