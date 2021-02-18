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

export const getServerSideProps: GetServerSideProps = async () => {
  const processTemplatesQuery = await prisma.processTemplate.findMany({
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
  const professions = await prisma.profession.findMany();
  const tags = await prisma.tag.findMany();

  const processTemplates = JSON.parse(safeJsonStringify(processTemplatesQuery));
  const employees = JSON.parse(safeJsonStringify(await prisma.employee.findMany()));
  return { props: { processTemplates, professions, employees, tags } };
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

const ProcessTemplate = ({ processTemplates, employees, professions, tags }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();
  const { slug } = router.query;

  const classes = useStyles();

  const processTemplate: IProcessTemplate = processTemplates.find((processTemplate) => processTemplate.slug === slug);

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
