import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const processTemplates = await prisma.processTemplate.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
      },
    });
    res.json(processTemplates);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
}
