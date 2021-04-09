import { makeStyles } from '@material-ui/core';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import Phase from 'components/views/prosessmal/Phase';
import PhaseModal from 'components/views/prosessmal/PhaseModal';
import { DataProvider } from 'context/Data';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { IPhase } from 'utils/types';

const useStyles = makeStyles({
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
        orderBy: [
          {
            dueDateDayOffset: 'asc',
          },
          {
            dueDate: 'asc',
          },
        ],
        where: {
          active: {
            equals: true,
          },
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
              active: true,
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
      <div className={classes.header}>
        <Typo className={classes.title} variant='h1'>
          Prosessmal
        </Typo>
        <Typo className={classes.template_title}>{processTemplate?.title}</Typo>
      </div>
      <DataProvider>
        {processTemplate?.phases.map((phase: IPhase) => (
          <Phase key={phase.id} phase={phase} processTemplate={processTemplate} />
        ))}
      </DataProvider>
      <AddButton onClick={() => setModalIsOpen(true)} text='Legg til fase' />
      {modalIsOpen && <PhaseModal closeModal={() => setModalIsOpen(false)} modalIsOpen={modalIsOpen} processTemplate={processTemplate} />}
    </>
  );
};

export default ProcessTemplate;
