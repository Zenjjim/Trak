import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import withAuth from 'lib/withAuth';
import { toInteger } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  if (req.method === 'GET') {
    const employee = await prisma.employee.findUnique({
      where: {
        id: toInteger(id),
      },
    });
    res.status(HttpStatusCode.OK).json(employee);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
});
