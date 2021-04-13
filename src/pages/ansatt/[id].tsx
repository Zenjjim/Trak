import { Box, Button, Menu, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';
import Phase from 'components/views/ansatt/Phase';
import prisma from 'lib/prisma';
import { flattenDeep, uniq, uniqBy } from 'lodash';
import moment from 'moment';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { createContext, useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';
import theme from 'theme';
import { IEmployeeTask, ITask } from 'utils/types';

export const EmployeeContext = createContext(undefined);

const useStyles = makeStyles({
  spaceRight: {
    marginRight: theme.spacing(4),
  },
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'row',
    [theme.breakpoints.down('md')]: {
      alignItems: 'flex-start',
      flexDirection: 'column',
    },
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
});
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id, år: year, prosess: process } = query;
  const parsedId = typeof id === 'string' && parseInt(id);
  if (!id || !process || !year) {
    return {
      notFound: true,
    };
  }
  const employeeQuery = await prisma.employee.findUnique({
    where: {
      id: parsedId,
    },

    select: {
      id: true,
      firstName: true,
      lastName: true,
      profession: true,
      hrManager: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      employeeTask: {
        where: {
          dueDate: {
            gte: moment(year.toString()).startOf('year').toDate(),
            lte: moment(year.toString()).endOf('year').toDate(),
          },
          task: {
            phase: {
              processTemplate: {
                slug: process.toString(),
              },
            },
          },
        },
        select: {
          dueDate: true,
          id: true,
          completed: true,
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
              id: true,
              title: true,
              tags: true,
              description: true,
              phase: {
                select: {
                  id: true,
                  title: true,
                  processTemplate: {
                    select: {
                      title: true,
                      slug: true,
                    },
                  },
                  dueDate: true,
                },
              },
            },
          },
        },
        orderBy: {
          dueDate: 'asc',
        },
      },
    },
  });

  const processesQuery = await prisma.processTemplate.findMany({
    select: {
      title: true,
      slug: true,
      phases: {
        select: {
          tasks: {
            select: {
              id: true,
              employeeTask: {
                where: {
                  employeeId: parsedId,
                },
                select: {
                  id: true,
                  dueDate: true,
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
  const phases = uniqBy(
    employee.employeeTask.map((element) => {
      return { id: element.task.phase.id, title: element.task.phase.title };
    }),
    'title',
  );
  // eslint-disable-next-line
  const phasesWithTasks = phases.map((unique: any) => {
    const tasks = employee.employeeTask.filter((task: IEmployeeTask) => task.task.phase.title === unique.title);
    const finishedTasks = tasks.filter((task: IEmployeeTask) => task.completed);
    return {
      id: unique.id,
      title: unique.title,
      tasks: tasks,
      totalTasks: tasks.length,
      finishedTasks: finishedTasks.length,
    };
  });
  const allTasks = processes.map((process) => {
    const years = process.phases.map((phase) => {
      return phase.tasks.map((task: ITask) => {
        return task.employeeTask.map((employeeTask) => new Date(employeeTask.dueDate).getFullYear());
      });
    });

    const filteredYears = years.map((year) => {
      return year.filter((element) => {
        return element.length !== 0;
      });
    });
    return { title: process.title, slug: process.slug, years: filteredYears };
  });

  const history = allTasks.map((process) => {
    const years = flattenDeep(process.years);
    const uniqeYears = uniq(years);
    return { title: process.title, slug: process.slug, years: uniqeYears };
  });

  return { props: { employee, phasesWithTasks, year, process, history } };
};

const Employee = ({ employee, phasesWithTasks, year, process, history }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Head>
        <title>Ansatt</title>
      </Head>
      <>
        <div className={classes.header}>
          <Typo className={classes.spaceRight} noWrap variant='h1'>
            {employee.firstName} {employee.lastName}
          </Typo>
          {employee.hrManager && (
            <Typo noWrap variant='body1'>
              Ansvarlig: {employee.hrManager.firstName} {employee.hrManager.lastName}
            </Typo>
          )}
        </div>
        <div className={classes.buttonGroup}>
          <Typo noWrap variant='body1'>
            {year} {history.find((element) => element.slug === process)?.title}
          </Typo>
          <Box display='flex'>
            <Button
              aria-controls='historikk meny'
              aria-haspopup='true'
              color='primary'
              disabled={history.every((element) => !element.years.length)}
              onClick={handleClick}>
              Historikk
            </Button>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              getContentAnchorEl={null}
              id='history-menu'
              keepMounted
              onClose={handleClose}
              open={Boolean(anchorEl)}>
              {history.map((process) => {
                return process.years.map((year) => {
                  const linkText = `${year} ${process.title}`;
                  return (
                    <MenuItem key={`${process.title} ${year}`} onClick={handleClose}>
                      <Link href={`/ansatt/${employee.id}?år=${year}&prosess=${process.slug}`}>
                        <a style={{ textDecoration: 'none', color: theme.palette.text.primary }}>{linkText}</a>
                      </Link>
                    </MenuItem>
                  );
                });
              })}
            </Menu>
          </Box>
        </div>
        <EmployeeContext.Provider value={{ employee }}>
          {phasesWithTasks.map((phase, index) => {
            return (
              <Phase
                employeeTasks={phase.tasks}
                first={index === 0}
                key={phase.title}
                phaseId={phase.id}
                tasksFinished={phase.finishedTasks}
                title={phase.title}
                totalTasks={phase.totalTasks}
              />
            );
          })}
        </EmployeeContext.Provider>
      </>
    </>
  );
};

export default Employee;
