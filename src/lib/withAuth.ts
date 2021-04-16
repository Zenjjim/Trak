import { PrismaClient } from '@prisma/client';
import HttpStatusCode from 'http-status-typed';
import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'next-auth/jwt';
const secret = process.env.JWT_SECRET;

const prisma = new PrismaClient();

const withAuth = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      if (process.env.NODE_ENV === 'test') {
        const user = await prisma.employee.findFirst({
          select: {
            id: true,
            email: true,
          },
        });
        return handler(req, res, user);
      }
      const token = await jwt.getToken({ req, secret });

      if (token) {
        const user = await prisma.employee.findUnique({
          where: {
            email: token.email,
          },
          select: {
            id: true,
            email: true,
          },
        });
        if (user) {
          return handler(req, res, user);
        }
      }
      // eslint-disable-next-line no-empty
    } catch (err) {
      return res.json(err?.message);
    }
    return res.status(HttpStatusCode.UNAUTHORIZED).end();
  };
};

export default withAuth;
