import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'next-auth/jwt';
const secret = process.env.JWT_SECRET;

const prisma = new PrismaClient();

const withAuth = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const token = await jwt.getToken({ req, secret });

      if (token) {
        const userExists = await prisma.employee.findUnique({
          where: {
            email: token.email,
          },
        });
        if (userExists) {
          return handler(req, res);
        }
      }
      // eslint-disable-next-line no-empty
    } catch {}
    return res.status(HttpStatusCode.UNAUTHORIZED).end();
  };
};

export default withAuth;
