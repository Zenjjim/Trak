import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export const config = {
  api: {
    externalResolver: true,
  },
};

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
  } else {
    res.status(405);
  }
  prisma.$disconnect();
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
    if (!phase) {
      throw new Error();
    }
    res.status(200).json(phase);
  } catch (err) {
    if (err) {
      res.status(404).send({ message: err?.meta?.cause });
    } else {
      res.status(500).send({ message: 'Noe gikk galt med serveren' });
    }
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
    res.status(200).json(updatedPhase);
  } catch (err) {
    if (err) {
      res.status(404).send({ message: err?.meta?.cause });
    } else {
      res.status(500).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
const DELETE = async (res, phase_id) => {
  try {
    const deletedPhase = await prisma.phase.delete({ where: { id: phase_id.toString() } });
    res.status(200).json(deletedPhase);
  } catch (err) {
    if (err) {
      res.status(404).send({ message: err?.meta?.cause });
    } else {
      res.status(500).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
