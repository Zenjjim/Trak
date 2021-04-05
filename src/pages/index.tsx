import { CircularProgress } from '@material-ui/core';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>TRAK</title>
      </Head>
      <CircularProgress />
    </div>
  );
}
