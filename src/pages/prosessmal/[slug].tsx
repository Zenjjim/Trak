import { makeStyles } from '@material-ui/core';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import Phase from 'components/views/prosessmal/Phase';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import safeJsonStringify from 'safe-json-stringify';
import { IPhase, IProcessTemplate } from 'utils/types';

export const getServerSideProps: GetServerSideProps = async (context) => {
  console.log("Ree0: " + new Date().getTime())
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
  console.log("Ree1: " + new Date().getTime())
  const employeeQuery = await prisma.employee.findMany();
  console.log("Ree2: " + new Date().getTime())
  const professions = await prisma.profession.findMany();
  console.log("Ree3: " + new Date().getTime())
  const tags = await prisma.tag.findMany();
  console.log("Ree4: " + new Date().getTime())

  const processTemplate = JSON.parse(safeJsonStringify(processTemplatesQuery));
  console.log("Ree5: " + new Date().getTime())
  const employees = JSON.parse(safeJsonStringify(employeeQuery));
  console.log("Ree6: " + new Date().getTime())

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
  const { isFallback } = router
  const { slug } = router.query;
  const classes = useStyles();

  if (isFallback) {
    return <div>LOADING</div>
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
