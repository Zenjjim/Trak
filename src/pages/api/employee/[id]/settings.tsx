import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import withAuth from 'lib/withAuth';
import { toInteger } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
const prisma = new PrismaClient();

export default withAuth(async function (req: NextApiRequest, res: NextApiResponse, user) {
  const {
    query: { id },
  } = req;
  if (user.id.toString() !== id.toString()) {
    res.status(HttpStatusCode.FORBIDDEN).send({ message: 'Kan kun gjøre endringer på egen bruker' });
  } else if (req.method === 'PUT') {
    PUT(req, res, id);
  } else {
    res.status(HttpStatusCode.METHOD_NOT_ALLOWED);
  }
  prisma.$disconnect();
});

const PUT = async (req, res, id) => {
  const {
    body: { slack, notificationSettings },
  } = req;
  try {
    const employeeSettings = await prisma.employeeSettings.update({
      where: {
        employeeId: toInteger(id),
      },
      data: {
        slack: slack,
        notificationSettings: notificationSettings,
      },
    });
    if (!employeeSettings) {
      throw new Error('Ansattinnstillinger mangler i bodyen');
    }
    res.status(HttpStatusCode.OK).json(employeeSettings);
  } catch (err) {
    if (err) {
      res.status(HttpStatusCode.NOT_FOUND).send({ message: err?.meta?.cause });
    } else {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send({ message: 'Noe gikk galt med serveren' });
    }
  }
};
