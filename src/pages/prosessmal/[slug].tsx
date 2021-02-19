import { makeStyles } from '@material-ui/core';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import Phase from 'components/views/prosessmal/Phase';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { IPhase } from 'utils/types';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const processTemplate = prisma.processTemplate.findUnique({
    where: {
      slug: params.slug.toString(),
    },
    include: {
      phases: {
        orderBy: {
          order: 'asc',
        },
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
  const employees = prisma.employee.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
    },
  });
  const professions = prisma.profession.findMany();
  const tags = prisma.tag.findMany();

  const data = await Promise.all([processTemplate, employees, professions, tags]);

  return { props: { data } };
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

const ProcessTemplate = ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();

  const [processTemplate, employees, professions, tags] = data;

  return (
    <>
      <Head>
        <title>Prosessmal - {processTemplate?.title}</title>
      </Head>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typo className={classes.title} variant='h1'>
            Prosessmal
          </Typo>
          <Typo className={classes.template_title}>{processTemplate?.title}</Typo>
        </div>
        {processTemplate?.phases.map((phase: IPhase) => (
          <Phase employees={employees} key={phase.id} phase={phase} professions={professions} tags={tags} />
        ))}
        <AddButton onClick={() => undefined} text='Legg til fase' />
      </div>
    </>
  );
};

export default ProcessTemplate;
