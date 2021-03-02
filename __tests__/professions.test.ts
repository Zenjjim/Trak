import HttpStatusCode from 'http-status-typed';
import { createMocks } from 'node-mocks-http';
import professionAPI from 'pages/api/professions';

describe('/api/professions', () => {
  test('returns all tags', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await professionAPI(req, res);

    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });
});
