import { PrismaClient } from '@prisma/client';
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const prisma = new PrismaClient();

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  //adapter: Adapters.Prisma.Adapter({ prisma }),
  // A database is optional, but required to persist accounts in a database
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
        const userExists = await prisma.employee.findUnique({
          where: {
            email: profile.email,
          },
        });
        if (userExists && profile.verified_email) {
          return true;
        }
        // eslint-disable-next-line no-empty
      } catch (err) {}
      return false;
    },
  },
});
