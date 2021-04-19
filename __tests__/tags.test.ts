import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { createMocks } from 'node-mocks-http';
import tagsAPI from 'pages/api/tags';

import { tagsFactory } from './factories/tags.factory';

describe('/api/tags', () => {
  beforeAll(async () => {
    await tagsFactory();
  });

  afterAll((done) => {
    prisma.$disconnect();
    done();
  });
  test('returns all tags', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await tagsAPI(req, res);
    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });
});
