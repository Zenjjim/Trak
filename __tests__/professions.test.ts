import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';
import professionAPI from 'pages/api/professions';

describe('/api/professions', () => {
  const professionAPIHandler: typeof professionAPI & { config?: PageConfig } = professionAPI;

  afterAll((done) => {
    prisma.$disconnect();
    done();
  });
  test('returns all professions', async () => {
    await testApiHandler({
      handler: professionAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });
});
