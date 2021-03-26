import 'moment/locale/nb';

import { makeStyles } from '@material-ui/core';
import SearchFilter from 'components/SearchFilter';
import Typo from 'components/Typo';
import TimeSection from 'components/views/mine-oppgaver/TimeSection';
import Fuse from 'fuse.js';
import prisma from 'lib/prisma';
import moment from 'moment';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';
import { IEmployeeTask } from 'utils/types';
import { splitIntoTimeSections } from 'utils/utils';

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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { fullfort: completed } = query;
  const isCompleted = completed.toString() === 'true';
  const myTasksQuery = await prisma.employeeTask.findMany({
    where: {
      responsible: {
        id: LOGGED_IN_USER,
      },
      completed: isCompleted,
      ...(isCompleted && {
        dueDate: {
          gte: moment().startOf('day').toDate(),
        },
      }),
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
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      employee: {
        select: {
          id: true,
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
                  slug: true,
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
  date?: string;
  data: IEmployeeTask[];
  error?: boolean;
  defaultOpen?: boolean;
};

const MyTasks = ({ myTasks }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  const router = useRouter();
  const { fullfort: completed } = router.query;

  const timeSections: TimeSectionType[] = splitIntoTimeSections(myTasks);

  const searchOptions = {
    keys: ['task.title', 'employee.searchName', 'employee.firstName', 'employee.lastName'],
    threshold: 0.3,
  };

  useEffect(() => {
    setSearchResults([]);
  }, [router.query]);

  const [searchResults, setSearchResults] = useState([]);
  const search = (text: string) => {
    const result = timeSections.map((timeSection) => {
      if (!text) {
        return timeSection;
      }
      const modifiedSearchData = timeSection.data.map((section) => {
        return { ...section, employee: { ...section.employee, searchName: `${section.employee.firstName} ${section.employee.lastName}` } };
      });

      const fuse = new Fuse(modifiedSearchData, searchOptions);
      return {
        ...timeSection,
        data: fuse.search(text).map((item) => item.item),
      };
    });
    setSearchResults(result);
  };

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
        <SearchFilter search={search} />
        <div>
          {timeSections.length === 0 ? (
            <Typo>Ingen oppgaver</Typo>
          ) : searchResults.length > 0 ? (
            searchResults.map((section: TimeSectionType, index: number) => {
              return <TimeSection first={index === 0} key={index} section={section} />;
            })
          ) : (
            timeSections.map((section: TimeSectionType, index: number) => <TimeSection first={index === 0} key={index} section={section} />)
          )}
        </div>
      </div>
    </>
  );
};

export default MyTasks;
