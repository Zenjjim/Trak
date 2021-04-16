import HttpStatusCode from 'http-status-typed';
import { createMocks } from 'node-mocks-http';
import tagsAPI from 'pages/api/tags';

import { tagsFactory } from './factories/tags.factory';

describe('/api/tags', () => {
  beforeAll(async () => {
    await tagsFactory();
  });
  test('returns all tags', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await tagsAPI(req, res);
    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });
});
