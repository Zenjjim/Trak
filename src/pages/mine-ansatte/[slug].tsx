import { Avatar, Box, ButtonBase, IconButton, Table, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon, Search as SearchIcon, Tune as TuneIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import Typo from 'components/Typo';
import prisma from 'lib/prisma';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import theme from 'theme';
import { IEmployee, IEmployeeTask, IPhase, IProcessTemplate, IProfession } from 'utils/types';

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
    '&:focus': {
      outline: `0.1px solid ${theme.palette.text.disabled}`,
    },
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
const MyEmployees = ({ myEmployees, allPhases }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const classes = useStyles();
  const processTemplate = allPhases[0];
  const phases = getPhasesWithEmployees(processTemplate, myEmployees);

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
          <Box className={classNames(classes.pointer, classes.centeringRow)} onClick={() => null} padding={theme.spacing(2)}>
            <IconButton aria-label='Søk'>
              <SearchIcon />
              <Typo variant='body2'>Søk</Typo>
            </IconButton>
          </Box>
          <Box className={classNames(classes.pointer, classes.centeringRow)} padding={theme.spacing(2)}>
            <IconButton aria-label='Filter'>
              <TuneIcon />
              <Typo variant='body2'>Filter</Typo>
            </IconButton>
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
type EmployeeRow = {
  id: number;
  firstName: string;
  lastName: string;
  profession: IProfession;
  hrManager: IEmployee;
  tasksFinished: number;
  totalTasks: number;
};

type UserRowProps = {
  employee: EmployeeRow;
};

const UserRow = ({ employee }: UserRowProps) => {
  const classes = useStyles();
  const typoVariant = 'body2';
  return (
    <TableRow className={classes.pointer} hover>
      <TableCell>
        <div className={classes.userRow} tabIndex={0}>
          <Avatar alt={'Logged in user photo'} className={classes.avatar} src={'/dummy_avatar.png'} />
          <Typo variant={typoVariant}>
            {employee.firstName} {employee.lastName}
          </Typo>
        </div>
      </TableCell>
      <TableCell>
        <Typo variant={typoVariant}>
          <b>{employee.tasksFinished}</b> av <b>{employee.totalTasks}</b>
        </Typo>
      </TableCell>
      <TableCell>
        <Typo variant={typoVariant}>{employee.profession.title}</Typo>
      </TableCell>
      <TableCell>
        <Box alignItems='flex-end' display='flex' flexDirection='row'>
          <Avatar alt={'Logged in user photo'} className={classes.avatar} src={'/dummy_avatar.png'} />
          <Typo variant={typoVariant}>
            {employee.hrManager.firstName} {employee.hrManager.lastName}
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
  employees: EmployeeRow[];
};
const PhaseCard = ({ title, amount, employees }: PhaseCardProps) => {
  const classes = useStyles();
  const [hidden, setIsHidden] = useState(employees.length === 0);
  return (
    <>
      <ButtonBase focusRipple onClick={() => setIsHidden(!hidden)}>
        <div className={classNames(classes.centeringRow, classes.pointer)}>
          <Typo variant='h2'>
            {title} (<b>{amount}</b>)
          </Typo>
          {hidden ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </div>
      </ButtonBase>
      <Box display={hidden ? 'none' : 'block'}>
        {employees.length > 0 ? (
          <Table aria-label='Mine ansatte tabell'>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '37.5rem' }}>Navn</TableCell>
                <TableCell style={{ width: '18.75rem' }}>Oppgaver gjennomført</TableCell>
                <TableCell style={{ width: '18.75rem' }}>Stilling</TableCell>
                <TableCell style={{ width: '18.75rem' }}>Ansvarlig</TableCell>
              </TableRow>
            </TableHead>
            {employees.map((employee) => {
              return <UserRow employee={employee} key={employee.id} />;
            })}
          </Table>
        ) : (
          <Typo variant='body2'>Ingen ansatte i denne fasen</Typo>
        )}
      </Box>
    </>
  );
};

export default MyEmployees;
