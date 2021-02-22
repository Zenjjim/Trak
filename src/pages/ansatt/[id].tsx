import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';
import Phase from 'components/views/ansatt/Phase';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';
import theme from 'theme';

const useStyles = makeStyles({
  root: {
    marginLeft: '30px',
    marginTop: '60px',
    marginRight: '30px',
  },
  spaceRight: {
    marginRight: theme.spacing(4),
  },
});

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = typeof query.id === 'string' && parseInt(query.id);
  const employeeQuery = await prisma.employee.findUnique({
    where: {
      id: id,
    },
    select: {
      firstName: true,
      lastName: true,
      hrManager: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      employeeTask: {
        select: {
          completed: true,
          year: true,
          responsible: {
            select: {
              firstName: true,
              lastName: true,
              imageUrl: true,
              id: true,
            },
          },
          task: {
            select: {
              title: true,
              phase: {
                select: {
                  title: true,
                  processTemplate: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const employee = JSON.parse(safeJsonStringify(employeeQuery));

  return { props: { employee } };
};

type ProcessSelector = {
  year: Date;
  process: 'Onboarding' | 'Offboarding' | 'Løpende';
};

const Employee = ({ employee }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();

  //TODO:
  // Automate this to select the current process
  const [choosenProcess] = useState<ProcessSelector>({ year: new Date(2021, 1, 1), process: 'Onboarding' });
  const tasks = employee.employeeTask.filter(
    (employeeTask) =>
      employeeTask.task.phase.processTemplate.title === choosenProcess.process &&
      new Date(employeeTask.year).getFullYear() === choosenProcess.year.getFullYear(),
  );

  const phases = tasks.map((element) => {
    return element.task.phase.title;
  });
  const uniquePhases = Array.from(new Set(phases));
  const noeAnnetKjorDa = uniquePhases.map((unique: string) => {
    const tasks1 = tasks.filter((task) => task.task.phase.title === unique);
    const finishedTasks = tasks1.filter((task) => task.completed);
    return {
      title: unique,
      tasks: tasks1,
      totalTasks: tasks1.length,
      finishedTasks: finishedTasks.length,
    };
  });
  return (
    <>
      <Head>
        <title>Ansatt</title>
      </Head>
      <div className={classes.root}>
        <Box alignItems='flex-end' display='flex'>
          <Typo variant='h1'>
            {employee.firstName} {employee.lastName}
          </Typo>
          {employee.hrManager && (
            <Typo variant='body1'>
              Ansvarlig: {employee.hrManager.firstName} {employee.hrManager.lastName}
            </Typo>
          )}
        </Box>
        <Box display='flex' justifyContent='space-between' mb={theme.spacing(4)}>
          <Typo variant='body1'>
            {choosenProcess.year.getFullYear()} {choosenProcess.process}
          </Typo>
          <Box display='flex'>
            <Typo className={classes.spaceRight} variant='body1'>
              Filer
            </Typo>
            <Typo onClick={null} variant='body1'>
              Historikk
            </Typo>
          </Box>
        </Box>

        {noeAnnetKjorDa.map((phase) => {
          return <Phase key={phase.title} tasks={phase.tasks} tasksFinished={phase.finishedTasks} title={phase.title} totalTasks={phase.totalTasks} />;
        })}
      </div>
    </>
  );
};

export default Employee;
