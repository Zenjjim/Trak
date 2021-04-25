import Head from 'next/head';
import { signIn, signOut, useSession } from 'next-auth/client';

export default function Page() {
  const [session] = useSession();
  return (
    <>
      <Head>
        <title>Logg inn</title>
      </Head>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
}
