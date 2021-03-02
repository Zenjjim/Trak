import 'moment/locale/nb';

import { makeStyles } from '@material-ui/core';
import capitalize from 'capitalize-first-letter';
import SearchFilter from 'components/SearchFilter';
import Typo from 'components/Typo';
import TimeSection from 'components/views/mine-oppgaver/TimeSection';
import prisma from 'lib/prisma';
import { compact, differenceBy } from 'lodash';
import moment from 'moment';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import safeJsonStringify from 'safe-json-stringify';
import { thisMonth, thisWeek, today, tomorrow } from 'sortof';
import { IEmployeeTask } from 'utils/types';

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
    marginLeft: '3px',
  },
});

const LOGGED_IN_USER = 1;
moment.locale('nb');

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { fullført: completed } = query;

  const myTasksQuery = await prisma.employeeTask.findMany({
    where: {
      responsible: {
        id: LOGGED_IN_USER,
      },
      completed: completed.toString() === 'true',
      dueDate: {
        gte: moment().startOf('day').toDate(),
      },
    },
    orderBy: {
      dueDate: 'asc',
    },
    select: {
      id: true,
      dueDate: true,
      completed: true,
      responsible: {
        select: {
          id: true,
        },
      },
      employee: {
        select: {
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      task: {
        select: {
          id: true,
          title: true,
          phase: {
            select: {
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
  });

  const myTasks = JSON.parse(safeJsonStringify(myTasksQuery));

  return { props: { myTasks } };
};

export type TimeSectionType = {
  title?: string;
  date: string;
  data: IEmployeeTask[];
};

const MyTasks = ({ myTasks }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  const router = useRouter();
  const { fullført: completed } = router.query;

  const splitIntoTimeSections = (myTasks) => {
    const taskToday = today(myTasks, 'dueDate');
    const withoutToday = differenceBy(myTasks, taskToday, 'id');
    const taskTomorrow = tomorrow(withoutToday, 'dueDate');
    const withoutTomorrow = differenceBy(withoutToday, taskTomorrow, 'id');
    const taskThisWeek = thisWeek(withoutTomorrow, 'dueDate');
    const withoutThisWeek = differenceBy(withoutTomorrow, taskThisWeek, 'id');
    const taskThisMonth = thisMonth(withoutThisWeek, 'dueDate');
    const withoutThisMonth = differenceBy(withoutThisWeek, taskThisMonth, 'id');
    const taskNextMonth = thisMonth(withoutThisMonth, 'dueDate', '', (moment().month() + 1) % 12);
    const taskNextNextMonth = thisMonth(withoutThisMonth, 'dueDate', '', (moment().month() + 2) % 12);

    const data = [
      taskToday.length && {
        title: 'I dag',
        data: taskToday,
        date: moment(taskToday[0]?.dueDate).format('ddd d MMM'),
      },
      taskTomorrow.length && {
        title: 'I morgen',
        data: taskTomorrow,
        date: moment(taskTomorrow[0]?.dueDate).format('ddd d MMM'),
      },
      taskThisWeek.length && {
        title: 'Denne uken',
        data: taskThisWeek,
        date: `uke ${moment(taskThisWeek[0]?.dueDate).isoWeek()}`,
      },
      taskThisMonth.length && {
        title: 'Denne måneden',
        data: taskThisMonth,
        date: capitalize(moment(taskThisMonth[0]?.dueDate).format('MMMM')),
      },
      taskNextMonth.length && {
        title: 'Neste måned',
        data: taskNextMonth,
        date: capitalize(moment(taskNextMonth[0]?.dueDate).format('MMMM')),
      },
      taskNextNextMonth && {
        data: taskNextNextMonth,
        date: capitalize(moment(taskNextNextMonth[0]?.dueDate).format('MMMM')),
      },
    ];

    return compact(data);
  };

  const timeSections: TimeSectionType[] = splitIntoTimeSections(myTasks);

  return (
    <>
      <Head>
        <title>Mine oppgaver</title>
      </Head>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typo className={classes.title} variant='h1'>
            Mine oppgaver
          </Typo>
          <Typo className={classes.template_title}>{completed.toString() === 'true' ? 'Fullførte' : 'Aktive'} oppgaver</Typo>
        </div>
        <SearchFilter />
        <div>
          {timeSections.map((section: TimeSectionType, index: number) => (
            <TimeSection first={index === 0} key={index} section={section} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyTasks;
