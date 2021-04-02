import 'moment/locale/nb';

import { Autocomplete, Box, Button, makeStyles, TextField, ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import SearchFilter from 'components/SearchFilter';
import Typo from 'components/Typo';
import TimeSection from 'components/views/mine-oppgaver/TimeSection';
import { useData } from 'context/Data';
import prisma from 'lib/prisma';
import moment from 'moment';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';
import theme from 'theme';
import { IEmployeeTask, IProcessTemplate, ITag } from 'utils/types';
import { filterAndSearchTasks, splitIntoTimeSections } from 'utils/utils';

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
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
});

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { fullfort: completed } = query;
  const isCompleted = completed.toString() === 'true';
  const myTasksQuery = await prisma.employeeTask.findMany({
    where: {
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
          tags: true,
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

  const [searchAndFilterResults, setSearchAndFilterResults] = useState<TimeSectionType[]>([]);
  const [searchString, setSearchString] = useState('');

  const { tags, processTemplates } = useData();
  const [choosenProcessTemplates, setChoosenProcessTemplates] = useState<string[]>([]);
  const [choosenTags, setChoosenTags] = useState<ITag[]>([]);

  const handleFormat = (_, newFormats) => {
    if (newFormats.length === processTemplates.length) {
      setChoosenProcessTemplates([]);
    } else {
      setChoosenProcessTemplates(newFormats);
    }
  };

  useEffect(() => {
    const noe = filterAndSearchTasks(searchString, { tags: choosenTags, processTemplates: choosenProcessTemplates }, timeSections, true);
    setSearchAndFilterResults(noe);
  }, [choosenTags, choosenProcessTemplates, searchString]);

  const clearFilters = () => {
    setChoosenTags([]);
    setChoosenProcessTemplates([]);
  };
  // TODO:
  // Make this a common component?

  const FilterComponent = () => (
    <Box display='flex' flexDirection='column' maxWidth='400px' minWidth='300px' padding={2}>
      <Typo gutterBottom variant='h2'>
        Tags
      </Typo>
      <Autocomplete
        className={classes.gutterBottom}
        getOptionLabel={(option: ITag) => option.title}
        multiple
        noOptionsText='Finner ingen tags'
        onChange={(_, value: ITag[]) => {
          setChoosenTags(value);
        }}
        options={tags}
        renderInput={(params) => <TextField {...params} size='small' />}
        value={choosenTags}
      />
      <Typo gutterBottom variant='h2'>
        Prosess
      </Typo>
      <ToggleButtonGroup className={classes.gutterBottom} onChange={handleFormat} value={choosenProcessTemplates}>
        {processTemplates?.map((processTemplate: IProcessTemplate) => {
          return (
            <ToggleButton key={processTemplate.id} value={processTemplate.title}>
              {processTemplate.title}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <Button disabled={!choosenProcessTemplates.length && !choosenTags.length} onClick={clearFilters} variant='outlined'>
        Tøm filtre
      </Button>
    </Box>
  );

  return (
    <>
      <Head>
        <title>Alle oppgaver</title>
      </Head>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typo className={classes.title} variant='h1'>
            Alle oppgaver
          </Typo>
          <Typo className={classes.template_title}>{completed.toString() === 'true' ? 'Fullførte' : 'Aktive'} oppgaver</Typo>
        </div>
        <SearchFilter
          activeFilters={Boolean(choosenTags.length || choosenProcessTemplates.length)}
          filterComponent={<FilterComponent />}
          search={setSearchString}
        />
        <div>
          {!timeSections.length ? (
            <Typo>Ingen oppgaver</Typo>
          ) : (
            (searchAndFilterResults.length ? searchAndFilterResults : timeSections).map((section: TimeSectionType, index: number) => {
              return <TimeSection first={index === 0} key={index} section={section} />;
            })
          )}
        </div>
      </div>
    </>
  );
};

export default MyTasks;
