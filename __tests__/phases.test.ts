import HttpStatusCode from 'http-status-typed';
import { createMocks } from 'node-mocks-http';
import phasesAPI from 'pages/api/phases';
import phasesIdAPI from 'pages/api/phases/[phase_id]';

import { processTemplateFactory } from './factories/processTemplates.factory';
import { randomString } from './utils/utils';

describe('/api/phases', () => {
  let processTemplate;
  beforeAll(async () => {
    processTemplate = await processTemplateFactory();
  });
  let phase;
  test('Create phase', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: {
        data: { title: randomString() },
        processTemplateId: processTemplate.id,
      },
    });
    await phasesAPI(req, res);
    phase = JSON.parse(res._getData());
    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
    expect(phase.processTemplateId).toEqual(processTemplate.id);
  });

  test('Get created phase', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { phase_id: phase.id },
    });

    await phasesIdAPI(req, res);

    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });

  test('Update created phase', async () => {
    const { req, res } = createMocks({
      method: 'PUT',
      query: { phase_id: phase.id },
      body: {
        data: {
          title: randomString(),
        },
      },
    });

    await phasesIdAPI(req, res);

    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });

  test('Delete created phase', async () => {
    const { req, res } = createMocks({
      method: 'DELETE',
      query: { phase_id: phase.id },
    });

    await phasesIdAPI(req, res);

    expect(res._getStatusCode()).toBe(HttpStatusCode.OK);
  });
});
