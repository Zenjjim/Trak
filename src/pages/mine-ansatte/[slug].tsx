import { Box } from '@material-ui/core';
import SearchFilter from 'components/SearchFilter';
import Typo from 'components/Typo';
import Filter from 'components/views/mine-ansatte/Filter';
import PhaseCard from 'components/views/mine-ansatte/PhaseCard';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/client';
import { useEffect, useMemo, useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';
import theme from 'theme';
import { IEmployee, IEmployeeTask, IPhase, IProcessTemplate, Process } from 'utils/types';
import { filterAndSearchEmployees } from 'utils/utils';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  const phases = prisma.processTemplate.findMany({
    where: {
      slug: context.params.slug.toString(),
    },
    select: {
      title: true,
      slug: true,
      phases: {
        orderBy: {
          dueDate: 'asc',
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
                      email: session?.user?.email,
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
      hrManager: {
        email: session?.user?.email,
      },
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      activeYear: true,
      imageUrl: true,
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
                slug: context.params.slug.toString(),
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
                  processTemplate: {
                    select: {
                      slug: true,
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
  const data = await Promise.all([phases, employees]);

  const allPhases = JSON.parse(safeJsonStringify(data[0]));
  const myEmployees = JSON.parse(safeJsonStringify(data[1]));

  return { props: { allPhases, myEmployees } };
};
export const addFinishedTasks = (filteredEmployees: IEmployee[], phase: IPhase) => {
  filteredEmployees.forEach((employee: IEmployee) => {
    employee['tasksFinished'] = employee.employeeTask.filter(
      (employeeTask: IEmployeeTask) =>
        employeeTask.completed &&
        employeeTask.task.phase.title === phase.title &&
        (employeeTask.task.phase.processTemplate.slug === Process.LOPENDE
          ? new Date(employeeTask.dueDate).getFullYear() === new Date(employee.activeYear).getFullYear()
          : true),
    ).length;

    employee['totalTasks'] = employee.employeeTask.filter(
      (employeeTask: IEmployeeTask) =>
        employeeTask.task.phase.title === phase.title &&
        (employeeTask.task.phase.processTemplate.slug === Process.LOPENDE
          ? new Date(employeeTask.dueDate).getFullYear() === new Date(employee.activeYear).getFullYear()
          : true),
    ).length;
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
  const processTemplate = allPhases[0];
  const phases = getPhasesWithEmployees(processTemplate, myEmployees);
  const router = useRouter();
  const [searchString, setSearchString] = useState('');
  const [choosenProfession, setChoosenProfession] = useState<string[]>([]);
  useEffect(() => {
    setChoosenProfession([]);
  }, [router.query]);
  const filterResult = useMemo(() => {
    return filterAndSearchEmployees(searchString, { professions: choosenProfession }, phases);
  }, [searchString, choosenProfession]);

  return (
    <>
      <Head>
        <title>Mine ansatte - {processTemplate.title}</title>
      </Head>
      <Box>
        <Typo variant='h1'>Mine ansatte</Typo>
        <Typo variant='h2'>{processTemplate.title}</Typo>
      </Box>
      <SearchFilter
        activeFilters={Boolean(choosenProfession.length)}
        filterComponent={<Filter choosenProfession={choosenProfession} setChoosenProfession={setChoosenProfession} />}
        search={setSearchString}
      />
      {(filterResult.length ? filterResult : phases).map((phase) => {
        return (
          <Box key={phase.id} mb={theme.spacing(2)}>
            <PhaseCard amount={phase.employees.length} employees={phase.employees} id={phase.id} slug={processTemplate.slug} title={phase.title} />
          </Box>
        );
      })}
    </>
  );
};

export default MyEmployees;
