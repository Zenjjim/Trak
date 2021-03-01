import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      body: { data, processTemplateId },
    } = req;
    const newPhase = await prisma.phase.create({
      data: {
        title: data.title,
        processTemplateId: processTemplateId,
      },
    });
    res.json(newPhase);
  } else {
    res.status(405);
  }
  prisma.$disconnect();
}
