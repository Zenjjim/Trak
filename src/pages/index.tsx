import LoadingLogo from 'components/LoadingLogo';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>TRAK</title>
      </Head>
      <LoadingLogo />
    </div>
  );
}
