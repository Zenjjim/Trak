import AddButton from 'components/AddButton';
import PageTitle from 'components/PageTitle';
import Phase from 'components/views/prosessmal/Phase';
import PhaseModal from 'components/views/prosessmal/PhaseModal';
import { DataProvider } from 'context/Data';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import theme from 'theme';
import { IPhase } from 'utils/types';

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
              link: true,
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
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  return (
    <>
      <Head>
        <title>Prosessmal {processTemplate && `- ${processTemplate.title}`}</title>
      </Head>
      <PageTitle subtitle={processTemplate?.title} title='Prosessmal' />
      <DataProvider>
        {processTemplate?.phases.map((phase: IPhase) => (
          <Phase key={phase.id} phase={phase} processTemplate={processTemplate} />
        ))}
      </DataProvider>
      <AddButton onClick={() => setModalIsOpen(true)} text='Legg til fase' />
      <div style={{ marginBottom: theme.spacing(3) }} />
      {modalIsOpen && <PhaseModal closeModal={() => setModalIsOpen(false)} modalIsOpen={modalIsOpen} processTemplate={processTemplate} />}
    </>
  );
};

export default ProcessTemplate;
