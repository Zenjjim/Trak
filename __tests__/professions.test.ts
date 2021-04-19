import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { createMocks } from 'node-mocks-http';
import professionAPI from 'pages/api/professions';

describe('/api/professions', () => {
  afterAll((done) => {
    prisma.$disconnect();
    done();
  });
  test('returns all professions', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await professionAPI(req, res);

    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });
});
