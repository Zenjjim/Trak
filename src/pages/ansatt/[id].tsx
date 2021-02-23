import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';
import Phase from 'components/views/ansatt/Phase';
import prisma from 'lib/prisma';
import _ from 'lodash';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import safeJsonStringify from 'safe-json-stringify';
import theme from 'theme';
import { ITask } from 'utils/types';
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
  const { id, year, process } = query;
  const parsedId = typeof id === 'string' && parseInt(id);
  const employeeQuery = await prisma.employee.findUnique({
    where: {
      id: parsedId,
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
        where: {
          year: new Date(year.toString()),
          task: {
            phase: {
              processTemplate: {
                slug: process.toString(),
              },
            },
          },
        },
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
              tags: true,
              description: true,
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
        orderBy: {
          year: 'asc',
        },
      },
    },
  });

  const processesQuery = await prisma.processTemplate.findMany({
    where: {
      phases: {
        some: {
          tasks: {
            some: {
              employeeTask: {
                some: {
                  employeeId: parsedId,
                },
              },
            },
          },
        },
      },
    },
    select: {
      title: true,
      slug: true,
      phases: {
        select: {
          tasks: {
            select: {
              employeeTask: {
                select: {
                  year: true,
                },
              },
            },
          },
        },
      },
    },
  });
  if (!employeeQuery) {
    return {
      notFound: true,
    };
  }
  const employee = JSON.parse(safeJsonStringify(employeeQuery));
  const processes = JSON.parse(safeJsonStringify(processesQuery));
  const phases = employee.employeeTask.map((element) => {
    return element.task.phase.title;
  });
  const uniquePhases = Array.from(new Set(phases));
  const phasesWithTasks = uniquePhases.map((unique: string) => {
    const tasks = employee.employeeTask.filter((task) => task.task.phase.title === unique);
    const finishedTasks = employee.employeeTask.filter((task) => task.completed);
    return {
      title: unique,
      tasks: tasks,
      totalTasks: tasks.length,
      finishedTasks: finishedTasks.length,
    };
  });

  const allTasks = processes.map((process) => {
    const years = process.phases.map((phase) => {
      return phase.tasks.map((task: ITask) => {
        return task.employeeTask.filter((employeeTask) => Boolean(employeeTask.year));
      });
    });
    const filteredYears = years.map((year) => {
      return year.filter((element) => {
        return element.length !== 0;
      });
    });
    return { title: process.title, years: filteredYears };
  });
  const history = allTasks.map((process) => {
    const years = _.flattenDeep(process.years);
    const uniqeYears = _.uniqBy(years, 'year');
    return { title: process.title, years: uniqeYears };
  });

  if (!employeeQuery) {
    return {
      notFound: true,
    };
  }

  return { props: { employee, phasesWithTasks, year, process, history } };
};
const Employee = ({ employee, phasesWithTasks, year, process, history }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  return (
    <>
      <Head>
        <title>Ansatt</title>
      </Head>
      <div className={classes.root}>
        <Box alignItems='flex-end' display='flex'>
          <Typo className={classes.spaceRight} variant='h1'>
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
            {year} {process}
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

        {phasesWithTasks.map((phase) => {
          return (
            <Phase
              employee={employee}
              key={phase.title}
              tasks={phase.tasks}
              tasksFinished={phase.finishedTasks}
              title={phase.title}
              totalTasks={phase.totalTasks}
            />
          );
        })}
      </div>
    </>
  );
};

export default Employee;
