import { createMocks } from 'node-mocks-http';
import tagsAPI from 'pages/api/tags';

describe('/api/tags', () => {
  test('returns all tags', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await tagsAPI(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())[0].title).toEqual('innkjøp');
  });
});
