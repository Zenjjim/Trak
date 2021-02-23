import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { phase_id },
  } = req;
  if (req.method === 'GET') {
    GET(res, phase_id);
  } else if (req.method === 'PUT') {
    PUT(req, res, phase_id);
  } else if (req.method === 'DELETE') {
    DELETE(res, phase_id);
  }
}

const GET = async (res, phase_id) => {
  try {
    const phase = await prisma.phase.findUnique({
      where: {
        id: phase_id.toString(),
      },
      select: {
        id: true,
        title: true,
      },
    });
    res.json(phase);
  } catch (err) {
    res.status(404).send({ message: err.meta.cause });
  }
};

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
      },
    });
    res.json(updatedPhase);
  } catch (err) {
    res.status(404).send({ message: err.meta.cause });
  }
};
const DELETE = async (res, phase_id) => {
  try {
    const deletedPhase = await prisma.phase.delete({ where: { id: phase_id.toString() } });
    res.json(deletedPhase);
  } catch (err) {
    res.status(404).send({ message: err.meta.cause });
  }
};
