import { makeStyles } from '@material-ui/core';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import Phase from 'components/views/prosessmal/Phase';
import PhaseModal from 'components/views/prosessmal/PhaseModal';
import { TaskModalProvider } from 'context/TaskModal';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
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

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const processTemplate = await prisma.processTemplate.findUnique({
    where: {
      slug: params.slug.toString(),
    },
    include: {
      phases: {
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          title: true,
          tasks: {
            orderBy: {
              createdAt: 'asc',
            },
            where: {
              global: true,
            },
            select: {
              id: true,
              title: true,
              description: true,
              responsible: {
                select: {
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

const ProcessTemplate = ({ processTemplate }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Prosessmal {processTemplate && `- ${processTemplate.title}`}</title>
      </Head>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typo className={classes.title} variant='h1'>
            Prosessmal
          </Typo>
          <Typo className={classes.template_title}>{processTemplate?.title}</Typo>
        </div>
        <TaskModalProvider>
          {processTemplate?.phases.map((phase: IPhase) => (
            <Phase key={phase.id} phase={phase} processTemplate={processTemplate} />
          ))}
        </TaskModalProvider>
        <AddButton onClick={() => setModalIsOpen(true)} text='Legg til fase' />
        {modalIsOpen && <PhaseModal closeModal={() => setModalIsOpen(false)} modalIsOpen={modalIsOpen} processTemplate={processTemplate} />}
      </div>
    </>
  );
};

export default ProcessTemplate;
