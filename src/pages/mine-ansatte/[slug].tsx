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
  section: {
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
  image_responisble: string;
  responsible: string;
};

const UserRow = ({ image, name, finishedTasks, tasksAmount, profession, image_responisble, responsible }: UserRowProps) => {
  const classes = useStyles();
  return (
    <TableRow>
      <TableCell>
        <Box alignItems='center' display='flex' flexDirection='row'>
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
        <Box alignItems='center' display='flex' flexDirection='row'>
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
};
const PhaseCard = ({ title, amount }: PhaseCardProps) => {
  const classes = useStyles();
  const [hidden, setIsHidden] = useState(false);
  return (
    <>
      <Typo className={classes.section} onClick={() => setIsHidden(!hidden)} variant='h2'>
        {title} (<b>{amount}</b>) {hidden ? <ExpandMoreIcon /> : <ExpandLessIcon />}
      </Typo>
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
          <UserRow finishedTasks={2} image_responisble='noe' name='Ola Halvorsen' profession='Teknolog' responsible='Bern Harald' tasksAmount={12} />
        </Table>
      </Box>
    </>
  );
};

const MyEmployees = ({ myEmployees }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const classes = useStyles();
  const router = useRouter();
  const { slug } = router.query;
  return (
    <Box className={classes.root}>
      <Box>
        <Typo variant='h1'>Mine ansatte</Typo>
        <Typo variant='h2'>{slug}</Typo>
      </Box>
      <Box display='flex' justifyContent='flex-end'>
        <Box alignItems='center' display='flex' flexDirection='row' padding={theme.spacing(2)}>
          <SearchIcon />
          <Typo variant='body2'>Søk</Typo>
        </Box>
        <Box alignItems='center' display='flex' flexDirection='row' padding={theme.spacing(2)}>
          <TuneIcon />
          <Typo variant='body2'>Filter</Typo>
        </Box>
      </Box>
      <PhaseCard amount={2} title='Ved signering' />
      <PhaseCard amount={4} title='Før oppstart' />
    </Box>
  );
};

export default MyEmployees;
