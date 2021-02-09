import { Avatar, Box, Table, TableCell, TableHead, TableRow } from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import TuneIcon from '@material-ui/icons/Tune';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';
import prisma from 'lib/prisma';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import theme from 'theme';

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

export const getStaticProps: GetStaticProps = async () => {
  const myEmployees = await prisma.employee.findMany({
    where: {
      id: LOGGED_IN_USER,
    },
    include: {
      employees: {
        include: {
          employee_Task: {
            include: {
              task: {
                include: {
                  phase: {
                    include: {
                      processTemplate: true,
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
  return { props: { myEmployees } };
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
});

type UserRowProps = {
  image?: string;
  name: string;
  finishedTasks: number;
  tasksAmount: number;
  profession: string;
  image_responisble?: string;
  responsible: string;
};

const UserRow = ({ image, name, finishedTasks, tasksAmount, profession, image_responisble, responsible }: UserRowProps) => {
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell>
        <Box alignItems='flex-end' className={classes.pointer} display='flex' flexDirection='row'>
          <Avatar alt={'Logged in user photo'} className={classes.avatar} src={image ? image : '/dummy_avatar.png'} />
          <Typo variant='body2'>{name}</Typo>
        </Box>
      </TableCell>
      <TableCell>
        <Typo variant='body2'>
          <b>{finishedTasks}</b> av <b>{tasksAmount}</b>
        </Typo>
      </TableCell>
      <TableCell>
        <Typo variant='body2'>{profession}</Typo>
      </TableCell>
      <TableCell>
        <Box alignItems='flex-end' display='flex' flexDirection='row'>
          <Avatar alt={'Logged in user photo'} className={classes.avatar} src={image_responisble ? image_responisble : '/dummy_avatar.png'} />
          <Typo variant='body2'>{responsible}</Typo>
        </Box>
      </TableCell>
    </TableRow>
  );
};

type PhaseCardProps = {
  title: string;
  amount: number;
  employees: UserRowProps[];
};
const PhaseCard = ({ title, amount, employees }: PhaseCardProps) => {
  const classes = useStyles();
  const [hidden, setIsHidden] = useState(false);
  return (
    <>
      <Box alignItems='center' className={classes.pointer} display='flex' flexDirection='row' onClick={() => setIsHidden(!hidden)}>
        <Typo variant='h2'>
          {title} (<b>{amount}</b>)
        </Typo>
        {hidden ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </Box>

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
                finishedTasks={employee.finishedTasks}
                image_responisble={employee.image_responisble}
                key={employee.name}
                name={employee.name}
                profession={employee.profession}
                responsible={employee.responsible}
                tasksAmount={employee.tasksAmount}
              />
            );
          })}
        </Table>
      </Box>
    </>
  );
};

const MyEmployees = ({ myEmployees }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const classes = useStyles();
  const router = useRouter();
  const { slug } = router.query;

  //  TODO
  // Based on slug do the GET-request to mine-employees
  const phases = [
    {
      title: 'Før oppstart',
      amount: 2,
      employees: [
        {
          name: 'Ola Halvorsen',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
        {
          name: 'Ola Halvorsen',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
        {
          name: 'Ola Halvorsen',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
        {
          name: 'Ola Halvorsen',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
      ],
    },
    {
      title: 'Før første arbeidsdag',
      amount: 5,
      employees: [
        {
          name: 'Ola Halvorsen ',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
        {
          name: 'Ola Halvorsen',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
        {
          name: 'Ola Halvorsen',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
        {
          name: 'Ola Halvorsen',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
        {
          name: 'Ola Halvorsen',
          finishedTasks: 2,
          tasksAmount: 12,
          profession: 'Teknolog',
          responsible: 'Bernt Harald',
        },
      ],
    },
  ];
  const renamedSlug = renameSlug(slug);
  return (
    <>
      <Head>
        <title>Mine ansatte - {renamedSlug}</title>
      </Head>
      <Box className={classes.root}>
        <Box>
          <Typo variant='h1'>Mine ansatte</Typo>
          <Typo variant='h2'>{renamedSlug}</Typo>
        </Box>
        <Box display='flex' justifyContent='flex-end'>
          <Box alignItems='center' className={classes.pointer} display='flex' flexDirection='row' padding={theme.spacing(2)}>
            <SearchIcon />
            <Typo variant='body2'>Søk</Typo>
          </Box>
          <Box alignItems='center' className={classes.pointer} display='flex' flexDirection='row' padding={theme.spacing(2)}>
            <TuneIcon />
            <Typo variant='body2'>Filter</Typo>
          </Box>
        </Box>
        {phases.map((phase) => {
          return (
            <Box key={phase.title} mb={theme.spacing(2)}>
              <PhaseCard amount={phase.amount} employees={phase.employees} title={phase.title} />
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default MyEmployees;
