import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';
import tagsAPI from 'pages/api/tags';

import { tagsFactory } from './factories/tags.factory';

describe('/api/tags', () => {
  const tagsAPIHandler: typeof tagsAPI & { config?: PageConfig } = tagsAPI;
  beforeAll(async () => {
    await tagsFactory();
  });

  afterAll((done) => {
    prisma.$disconnect();
    done();
  });
  test('returns all tags', async () => {
    await testApiHandler({
      handler: tagsAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });

  test('not allowed method', async () => {
    await testApiHandler({
      handler: tagsAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'DELETE',
        });
        expect(res.status).toBe(HttpStatusCode.METHOD_NOT_ALLOWED);
      },
    });
  });
});
