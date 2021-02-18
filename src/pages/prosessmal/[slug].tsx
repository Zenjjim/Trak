import { makeStyles } from '@material-ui/core';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import Phase from 'components/views/prosessmal/Phase';
import fastjson from 'fastjson';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import safeJsonStringify from 'safe-json-stringify';
import { IPhase, IProcessTemplate } from 'utils/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const processTemplatesQuery = await prisma.processTemplate.findUnique({
    where: {
      slug: context.params.slug.toString(),
    },
    include: {
      phases: {
        include: {
          tasks: {
            include: {
              tags: true,
              professions: true,
              responsible: true,
            },
          },
        },
      },
    },
  });
  const processTemplate = fastjson.stringify(processTemplatesQuery);

  const employeeQuery = await prisma.employee.findMany();
  const employees = fastjson.stringify(employeeQuery);

  const professions = await prisma.profession.findMany();
  const tags = await prisma.tag.findMany();
  return { props: { processTemplate, professions, employees, tags } };
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

const ProcessTemplate = ({ processTemplate, employees, professions, tags }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { slug } = router.query;

  const classes = useStyles();

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
