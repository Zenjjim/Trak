import { makeStyles } from '@material-ui/core';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import Phase from 'components/views/prosessmal/Phase';
import useProgressbar from 'context/Progressbar';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { IPhase } from 'utils/types';

const useStyles = makeStyles({
  root: {
    marginLeft: '30px',
    marginTop: '60px',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    lineHeight: 0.7,
  },
  template_title: {
    marginLeft: '7px',
  },
});

const fetcher = (url) => fetch(url).then((res) => res.json());
const ProcessTemplate = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { slug } = router.query;

  const showProgressbar = useProgressbar();

  showProgressbar(true);
  const { data, error } = useSWR(`/api/prosessmals/${slug}`, fetcher);

  if (!data) {
    return <div>Loading...</div>;
  }
  showProgressbar(false);

  if (error) {
    return <div>failed to load</div>;
  }

  return (
    <>
      <Head>
        <title>Prosessmal - {data?.title}</title>
      </Head>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typo className={classes.title} variant='h1'>
            Prosessmal
          </Typo>
          <Typo className={classes.template_title}>{data?.title}</Typo>
        </div>
        {data?.phases.map((phase: IPhase) => (
          <Phase employees={[]} key={phase.id} phase={phase} professions={[]} tags={[]} />
        ))}
        <AddButton onClick={() => undefined} text='Legg til fase' />
      </div>
    </>
  );
};

export default ProcessTemplate;
