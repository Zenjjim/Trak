import { createMocks } from 'node-mocks-http';

import tagsAPI from '../pages/api/tags';

describe('/api/tags', () => {
  test('returns all tags', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await tagsAPI(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())[0]).toEqual(expect.objectContaining({ title: 'innkjøp', id: '5690291c-b309-4a64-9615-5927ec0254f7' }));
  });
});
