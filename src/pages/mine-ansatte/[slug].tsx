import { Avatar, Box, Table, TableCell, TableHead, TableRow } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import TuneIcon from '@material-ui/icons/Tune';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import Typo from 'components/Typo';
import prisma from 'lib/prisma';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import theme from 'theme';
import { IEmployee, IEmployeeTask, IPhase, IProfession } from 'utils/types';

const LOGGED_IN_USER = 1;

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const processTemplates = await prisma.processTemplate.findMany();

  return {
    paths: processTemplates.map((processTemplate) => ({
      params: {
        slug: processTemplate.slug,
      },
    })),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const allPhases = await prisma.processTemplate.findMany({
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

  const myEmployees = await prisma.employee.findMany({
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
          year: true,
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

  return { props: { myEmployees, allPhases } };
};

const useStyles = makeStyles({
  root: {
    marginLeft: '30px',
    marginTop: '60px',
  },
  pointer: {
    cursor: 'pointer',
  },
  avatar: {
    width: '25px',
    height: '25px',
  },
  centeringRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userRow: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
  },
});
const MyEmployees = ({ myEmployees, allPhases }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const classes = useStyles();
  const processTemplate = allPhases[0];
  const displayedEmployees = [];
  const addFinishedTasks = (filteredEmployees: IEmployee[], phase: IPhase) => {
    filteredEmployees.forEach((employee: IEmployee) => {
      employee['tasksFinished'] = employee.employeeTask.filter(
        (employeeTask: IEmployeeTask) => employeeTask.completed && employeeTask.task.phase.title === phase.title,
      ).length;
      employee['totalTasks'] = employee.employeeTask.filter((employeeTask: IEmployeeTask) => employeeTask.task.phase.title === phase.title).length;
    });
  };

  const phases = [
    ...processTemplate.phases.map((phase: IPhase) => {
      const employees = myEmployees.filter((employee: IEmployee) =>
        employee.employeeTask.some((employeeTask: IEmployeeTask) => !employeeTask.completed && employeeTask.task.phase.title === phase.title),
      );
      const filteredEmployees = employees.filter((employee: IEmployee) => {
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
        <Box display='flex' justifyContent='flex-end'>
          <Box className={classNames(classes.pointer, classes.centeringRow)} padding={theme.spacing(2)} tabIndex={0}>
            <SearchIcon />
            <Typo variant='body2'>Søk</Typo>
          </Box>
          <Box className={classNames(classes.pointer, classes.centeringRow)} padding={theme.spacing(2)}>
            <TuneIcon />
            <Typo variant='body2'>Filter</Typo>
          </Box>
        </Box>
        {phases.map((phase: PhaseCardProps) => {
          return (
            <Box key={phase.id} mb={theme.spacing(2)}>
              <PhaseCard amount={phase.employees.length} employees={phase.employees} id={phase.id} title={phase.title} />
            </Box>
          );
        })}
      </Box>
    </>
  );
};

type UserRowProps = {
  id: number;
  firstName: string;
  lastName: string;
  profession: IProfession;
  hrManager: IEmployee;
  tasksFinished: number;
  totalTasks: number;
};

const UserRow = ({ firstName, lastName, profession, hrManager, tasksFinished, totalTasks }: UserRowProps) => {
  const classes = useStyles();
  const typoVariant = 'body2';
  return (
    <TableRow>
      <TableCell width='600px'>
        <div className={classNames(classes.pointer, classes.userRow)} onKeyDown={(e) => (e.key === 'Enter' ? null : null)} tabIndex={0}>
          <Avatar alt={'Logged in user photo'} className={classes.avatar} src={'/dummy_avatar.png'} />
          <Typo variant={typoVariant}>
            {firstName} {lastName}
          </Typo>
        </div>
      </TableCell>
      <TableCell width='300px'>
        <Typo variant={typoVariant}>
          <b>{tasksFinished}</b> av <b>{totalTasks}</b>
        </Typo>
      </TableCell>
      <TableCell width='300px'>
        <Typo variant={typoVariant}>{profession.title}</Typo>
      </TableCell>
      <TableCell width='300px'>
        <Box alignItems='flex-end' display='flex' flexDirection='row'>
          <Avatar alt={'Logged in user photo'} className={classes.avatar} src={'/dummy_avatar.png'} />
          <Typo variant={typoVariant}>
            {hrManager.firstName} {hrManager.lastName}
          </Typo>
        </Box>
      </TableCell>
    </TableRow>
  );
};

type PhaseCardProps = {
  id: string;
  title: string;
  amount: number;
  employees: UserRowProps[];
};
const PhaseCard = ({ title, amount, employees }: PhaseCardProps) => {
  const classes = useStyles();
  const [hidden, setIsHidden] = useState(false);
  return (
    <>
      <div
        className={classNames(classes.centeringRow, classes.pointer)}
        onClick={() => setIsHidden(!hidden)}
        onKeyDown={(e) => (e.key === 'Enter' ? setIsHidden(!hidden) : null)}
        tabIndex={0}>
        <Typo variant='h2'>
          {title} (<b>{amount}</b>)
        </Typo>
        {hidden ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </div>
      {employees.length > 0 ? (
        <Box display={hidden ? 'none' : 'block'}>
          <Table aria-label='Mine ansatte tabell'>
            <TableHead>
              <TableRow>
                <TableCell size='small'>Navn</TableCell>
                <TableCell size='small'>Oppgaver gjennomført</TableCell>
                <TableCell size='small'>Stilling</TableCell>
                <TableCell size='small'>Ansvarlig</TableCell>
              </TableRow>
            </TableHead>
            {employees.map((employee) => {
              return (
                <UserRow
                  firstName={employee.firstName}
                  hrManager={employee.hrManager}
                  id={employee.id}
                  key={employee.id}
                  lastName={employee.lastName}
                  profession={employee.profession}
                  tasksFinished={employee.tasksFinished}
                  totalTasks={employee.totalTasks}
                />
              );
            })}
          </Table>
        </Box>
      ) : (
        <Typo variant='body2'>Ingen ansatte i denne fasen</Typo>
      )}
    </>
  );
};

export default MyEmployees;
