import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  debug: true,
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  callbacks: {
    //eslint-disabe-next-line
    async signIn(_, __, profile) {
      try {
        const user = await prisma.employee.findUnique({
          where: {
            email: profile.email,
          },
        });
        if (user && profile.verified_email) {
          await prisma.employeeSettings.upsert({
            where: {
              employeeId: user.id,
            },
            update: {},
            create: {
              employeeId: user.id,
              notificationSettings: ['DELEGATE', 'DEADLINE', 'WEEK_BEFORE_DEADLINE', 'HIRED', 'TERMINATION'],
            },
          });
          return true;
        }
        // eslint-disable-next-line no-empty
      } catch (err) {}
      return false;
    },
    async session(session, user) {
      try {
        const user_id = await prisma.employee.findUnique({
          where: {
            email: user.email,
          },
          select: {
            id: true,
          },
        });
        session.user.id = user_id.id;
        // eslint-disable-next-line no-empty
      } catch (err) {}
      return session;
    },
  },
});
