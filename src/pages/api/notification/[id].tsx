import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import withAuth from 'lib/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  /**
   * PUT
   * @param {string} id
   */
  if (req.method === 'PUT') {
    const notification = await prisma.notification.update({
      where: {
        id: id.toString(),
      },
      data: {
        read: true,
      },
    });
    res.status(HttpStatusCode.OK).json(notification);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
});
