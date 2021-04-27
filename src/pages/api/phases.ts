import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import withAuth from 'lib/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IPhase } from 'utils/types';

/**
 * POST
 * @param {string} processTemplateId processTemplateId for where the phase should be created
 * @param {{title: string, dueDateDayOffset?: number, dueDate?: Date}} data
 * @returns {IPhase} Created phase
 */

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { data, processTemplateId },
    } = req;
    const newPhase = await prisma.phase.create({
      data: {
        title: data.title,
        processTemplateId: processTemplateId,
        dueDateDayOffset: data.dueDateDayOffset,
        dueDate: data.dueDate,
      },
    });
    res.status(HttpStatusCode.CREATED).json(newPhase);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
});
