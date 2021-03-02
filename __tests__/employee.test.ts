import { createMocks } from 'node-mocks-http';
import employeeAPI from 'pages/api/employees';

import { employeeFactory } from './factories/employee.factory';

describe('/api/employee', () => {
  beforeAll(() => {
    employeeFactory(2);
  });

  test('returns all employees', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await employeeAPI(req, res);
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData()).length).toBeGreaterThanOrEqual(2);
  });
});
