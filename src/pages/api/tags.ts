import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import withAuth from 'lib/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const tags = await prisma.tag.findMany({
      select: {
        title: true,
        id: true,
      },
    });
    res.json(tags);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
});
