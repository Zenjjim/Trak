import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

import { slackMessager } from './../../utils/utils';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { description, employeeId, slackData },
    } = req;
    try {
      const newNotification = await prisma.notification.create({
        data: {
          employeeId: employeeId,
          description: description,
        },
      });
      if (slackData) {
        slackMessager(slackData.email, description);
      }
      res.status(HttpStatusCode.CREATED).json(newNotification);
    } catch (err) {
      if (err) {
        res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
      } else {
        res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
      }
    }
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
}
