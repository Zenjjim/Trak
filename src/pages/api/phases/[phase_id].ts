import HttpStatusCode from 'http-status-typed';
import prisma from 'lib/prisma';
import withAuth from 'lib/withAuth';
import type { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IPhase } from 'utils/types';
export const config = {
  api: {
    externalResolver: true,
  },
};

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { phase_id },
  } = req;
  if (req.method === 'GET') {
    return GET(res, phase_id);
  } else if (req.method === 'PUT') {
    return PUT(req, res, phase_id);
  } else if (req.method === 'DELETE') {
    return DELETE(res, phase_id);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED).end();
  }
});
/**
 * GET
 * @param {string} phase_id
 * @returns {IPhase}
 */
const GET = async (res, phase_id) => {
  try {
    const phase = await prisma.phase.findUnique({
      where: {
        id: phase_id.toString(),
      },
      select: {
        id: true,
        title: true,
        dueDateDayOffset: true,
        dueDate: true,
      },
    });
    if (!phase) {
      throw new Error();
    }
    res.status(HttpStatusCode.OK).json(phase);
  } catch (err) {
    if (err) {
      res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
/**
 * PUT
 * @param {string} phase_id
 * @param {{title: string, dueDateDayOffset?: number, dueDate?: Date}} data
 * @returns {IPhase}
 */
const PUT = async (req, res, phase_id) => {
  const {
    body: { data },
  } = req;
  try {
    const updatedPhase = await prisma.phase.update({
      where: {
        id: phase_id.toString(),
      },
      data: {
        title: data.title,
        dueDateDayOffset: data.dueDateDayOffset,
        dueDate: data.dueDate,
      },
    });
    res.status(HttpStatusCode.OK).json(updatedPhase);
  } catch (err) {
    if (err) {
      res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
/**
 * DELETE
 * @param {string} phase_id
 */
const DELETE = async (res, phase_id) => {
  try {
    await prisma.task.updateMany({
      where: {
        phaseId: phase_id.toString(),
      },
      data: {
        active: false,
      },
    });
    const deletedPhase = await prisma.phase.update({ where: { id: phase_id.toString() }, data: { active: false } });
    res.status(HttpStatusCode.OK).json(deletedPhase);
  } catch (err) {
    if (err) {
      res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
