import { makeStyles } from '@material-ui/core';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import Phase from 'components/views/prosessmal/Phase';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { IPhase } from 'utils/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const processTemplate = await prisma.processTemplate.findUnique({
    where: {
      slug: context.params.slug.toString(),
    },
    include: {
      phases: {
        select: {
          id: true,
          order: true,
          title: true,
          tasks: {
            where: {
              global: true,
            },
            select: {
              id: true,
              title: true,
              description: true,
              tags: true,
              professions: true,
              responsible: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return { props: { processTemplate } };
};

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

const ProcessTemplate = ({ processTemplate }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { isFallback } = router;
  const { slug } = router.query;
  const classes = useStyles();

  const employees = [];
  const professions = [];
  const tags = [];

  if (isFallback) {
    return <div>LOADING</div>;
  }

  return (
    <>
      <Head>
        <title>Prosessmal - {slug}</title>
      </Head>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typo className={classes.title} variant='h1'>
            Prosessmal
          </Typo>
          <Typo className={classes.template_title}>{processTemplate.title}</Typo>
        </div>
        {processTemplate.phases.map((phase: IPhase) => (
          <Phase employees={employees} key={phase.id} phase={phase} professions={professions} tags={tags} />
        ))}
        <AddButton onClick={() => undefined} text='Legg til fase' />
      </div>
    </>
  );
};

export default ProcessTemplate;
