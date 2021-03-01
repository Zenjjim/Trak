import { createMocks } from 'node-mocks-http';
import phasesAPI from 'pages/api/phases';

import { processTemplateFactory } from './factories/processTemplates.factory';
import { randomString } from './utils';

describe('/api/phases', () => {
  let processTemplate;
  beforeAll(async () => {
    processTemplate = await processTemplateFactory();
  });
  test('returns all tags', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        data: { title: randomString() },
        processTemplateId: processTemplate.id,
      },
    });

    await phasesAPI(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
});
