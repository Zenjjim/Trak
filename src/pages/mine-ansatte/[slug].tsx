import { Box, Button, TextField } from '@material-ui/core';
import { Search, Tune } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';
import PhaseCard, { PhaseCardProps } from 'components/views/mine-ansatte/PhaseCard';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';
import theme from 'theme';
import { IEmployee, IEmployeeTask, IPhase, IProcessTemplate } from 'utils/types';

const LOGGED_IN_USER = 1;
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const phases = prisma.processTemplate.findMany({
    where: {
      slug: params.slug.toString(),
    },
    select: {
      slug: true,
      phases: {
        orderBy: {
          createdAt: 'asc',
        },
        select: {
          id: true,
          title: true,
          tasks: {
            select: {
              employeeTask: {
                where: {
                  employee: {
                    hrManager: {
                      id: LOGGED_IN_USER,
                    },
                  },
                },
                include: {
                  employee: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      imageUrl: true,
                      profession: {
                        select: {
                          title: true,
                        },
                      },
                      hrManager: {
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
          },
        },
      },
    },
  });

  const employees = prisma.employee.findMany({
    where: {
      hrManagerId: LOGGED_IN_USER,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profession: {
        select: {
          title: true,
        },
      },
      hrManager: {
        select: {
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      employeeTask: {
        where: {
          task: {
            phase: {
              processTemplate: {
                slug: params.slug.toString(),
              },
            },
          },
        },
        select: {
          completed: true,
          dueDate: true,
          task: {
            select: {
              phase: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const data = await Promise.all([phases, employees]);

  const allPhases = JSON.parse(safeJsonStringify(data[0]));
  const myEmployees = JSON.parse(safeJsonStringify(data[1]));

  return { props: { allPhases, myEmployees } };
};

const useStyles = makeStyles({
  root: {
    marginLeft: '30px',
    marginTop: '60px',
  },
  pointer: {
    cursor: 'pointer',
  },
  centeringRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textField: {
    height: theme.spacing(4),
  },
});
export const addFinishedTasks = (filteredEmployees: IEmployee[], phase: IPhase) => {
  filteredEmployees.forEach((employee: IEmployee) => {
    employee['tasksFinished'] = employee.employeeTask.filter(
      (employeeTask: IEmployeeTask) => employeeTask.completed && employeeTask.task.phase.title === phase.title,
    ).length;
    employee['totalTasks'] = employee.employeeTask.filter((employeeTask: IEmployeeTask) => employeeTask.task.phase.title === phase.title).length;
  });
};

export const getPhasesWithEmployees = (processTemplate: IProcessTemplate, myEmployees) => {
  const displayedEmployees = [];
  return [
    ...processTemplate.phases.map((phase: IPhase) => {
      const employeesWithUncompletedTasks = myEmployees.filter((employee: IEmployee) =>
        employee.employeeTask.some((employeeTask: IEmployeeTask) => !employeeTask.completed && employeeTask.task.phase.title === phase.title),
      );
      const filteredEmployees = employeesWithUncompletedTasks.filter((employee: IEmployee) => {
        if (displayedEmployees.includes(employee.id)) {
          return false;
        } else {
          displayedEmployees.push(employee.id);
          return true;
        }
      });
      addFinishedTasks(filteredEmployees, phase);

      return { employees: filteredEmployees, title: phase.title, id: phase.id };
    }),
  ];
};
const MyEmployees = ({ myEmployees, allPhases }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  const processTemplate = allPhases[0];
  const phases = getPhasesWithEmployees(processTemplate, myEmployees);
  const [displaySearch, setDisplaySearch] = useState(false);

  const [searchResults, setSearchResults] = useState([]);

  const search = (text: string) => {
    const noe = phases.map((phase) => {
      return { ...phase, employees: phase.employees.filter((employee) => employee.firstName.includes(text) || employee.lastName.includes(text)) };
    });
    setSearchResults(noe);
  };

  return (
    <>
      <Head>
        <title>Mine ansatte - {processTemplate.title}</title>
      </Head>
      <Box className={classes.root}>
        <Box>
          <Typo variant='h1'>Mine ansatte</Typo>
          <Typo variant='h2'>{processTemplate.title}</Typo>
        </Box>
        <Box className={classes.centeringRow} justifyContent='flex-end'>
          {displaySearch ? (
            <TextField
              InputProps={{ className: classes.textField }}
              autoFocus
              onBlur={(e) => !e.target.value && setDisplaySearch(false)}
              onChange={(e) => search(e.target.value)}
              size='small'
            />
          ) : (
            <Button aria-label='Søk' color='primary' onClick={() => setDisplaySearch(true)} startIcon={<Search />}>
              Søk
            </Button>
          )}

          <Button aria-label='Filter' color='primary' startIcon={<Tune />}>
            Filter
          </Button>
        </Box>
        {searchResults.length > 0
          ? searchResults.map((phase) => {
              return (
                <Box key={phase.id} mb={theme.spacing(2)}>
                  <PhaseCard amount={phase.employees.length} employees={phase.employees} id={phase.id} slug={processTemplate.slug} title={phase.title} />
                </Box>
              );
            })
          : phases.map((phase: PhaseCardProps) => {
              return (
                <Box key={phase.id} mb={theme.spacing(2)}>
                  <PhaseCard amount={phase.employees.length} employees={phase.employees} id={phase.id} slug={processTemplate.slug} title={phase.title} />
                </Box>
              );
            })}
      </Box>
    </>
  );
};

export default MyEmployees;
