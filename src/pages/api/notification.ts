import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { INotification } from 'utils/types';
import { slackMessager } from 'utils/utils';

/**
 * POST
 * @param {string} description Notification description
 * @param {number} employeeId For which employee should the notification be created
 * @param {string?} email Email connected to slack, for slack notifications
 * @returns {INotification} Created notification
 */

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { description, employeeId, email },
    } = req;
    try {
      const newNotification = await prisma.notification.create({
        data: {
          employeeId: employeeId,
          description: description,
        },
      });
      if (email) {
        slackMessager(email, description);
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
