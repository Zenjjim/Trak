import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import withAuth from 'lib/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IProfession } from 'utils/types';

/**
 * GET
 * @returns {IProfession[]} All professions
 */

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const professions = await prisma.profession.findMany({
      select: {
        title: true,
        id: true,
      },
    });
    res.json(professions);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
});
