import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';
import phasesAPI from 'pages/api/phases';
import singlePhaseAPI from 'pages/api/phases/[phase_id]';

import { processTemplateFactory } from './factories/processTemplates.factory';
import { randomString } from './utils/utils';

describe('/api/phases', () => {
  const phasesAPIHandler: typeof phasesAPI & { config?: PageConfig } = phasesAPI;
  const singlePhaseAPIHandler: typeof singlePhaseAPI & { config?: PageConfig } = singlePhaseAPI;
  let processTemplate;
  beforeAll(async () => {
    processTemplate = await processTemplateFactory();
  });

  afterAll((done) => {
    prisma.$disconnect();
    done();
  });
  let phase;
  test('Create phase', async () => {
    await testApiHandler({
      handler: phasesAPIHandler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            data: { title: randomString() },
            processTemplateId: processTemplate.id,
          }),
        });
        phase = await res.json();
        expect(res.status).toBe(HttpStatusCode.CREATED);
        expect(phase.processTemplateId).toEqual(processTemplate.id);
      },
    });
  });

  test('Get created phase', async () => {
    await testApiHandler({
      handler: singlePhaseAPIHandler,
      params: {
        phase_id: phase.id,
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });

  test('Get phase that does not exist', async () => {
    await testApiHandler({
      handler: singlePhaseAPIHandler,
      params: {
        phase_id: randomString(),
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'GET',
        });
        expect(res.status).toBe(HttpStatusCode.NOT_FOUND);
      },
    });
  });

  test('Update created phase', async () => {
    await testApiHandler({
      handler: singlePhaseAPI,
      params: {
        phase_id: phase.id,
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              title: randomString(),
            },
          }),
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });

  test('Delete created phase', async () => {
    await testApiHandler({
      handler: singlePhaseAPI,
      params: {
        phase_id: phase.id,
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'DELETE',
        });
        expect(res.status).toBe(HttpStatusCode.OK);
      },
    });
  });

  test('Method not allowed', async () => {
    await testApiHandler({
      handler: singlePhaseAPI,
      params: {
        phase_id: phase.id,
      },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PATCH',
        });
        expect(res.status).toBe(HttpStatusCode.METHOD_NOT_ALLOWED);
      },
    });
  });
});
