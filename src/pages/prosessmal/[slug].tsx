import { Avatar, Button, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import AddButton from 'components/AddButton';
import Modal from 'components/Modal';
import TextField from 'components/TextField';
import Typo from 'components/Typo';
import prisma from 'lib/prisma';
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IPhase, IProcessTemplate, ITask } from 'utils/types';

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
  const processTemplates = await prisma.processTemplate.findMany({
    include: {
      phases: {
        include: {
          tasks: {
            include: {
              tags: true,
              professions: true,
            },
          },
        },
      },
    },
  });
  return { props: { processTemplates } };
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: '30px',
    marginTop: '60px',
  },
  title: {
    lineHeight: 0.7,
  },
  template_title: {
    marginLeft: '7px',
  },
  header: {
    marginBottom: '2rem',
  },
  table: {
    minWidth: 650,
  },
  hideLastBorder: {
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
  headerCell: {
    color: theme.palette.text.disabled,
    paddingBottom: 0,
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarSize: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
  grid: {
    display: 'grid',
    gridTemplateRows: 'auto',
    rowGap: 32,
  },
}));

const ProcessTemplate = ({ processTemplates }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();
  const { slug } = router.query;

  const classes = useStyles();

  const processTemplate: IProcessTemplate = processTemplates.find((processTemplate) => processTemplate.slug === slug);

  return (
    <>
      <Head>
        <title>Prosessmal - {slug}</title>
      </Head>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typo className={classes.title} variant='h1'>
            Prosessmal
          </Typo>
          <Typo className={classes.template_title}>{processTemplate.title}</Typo>
        </div>
        {processTemplate.phases.map((phase: IPhase) => (
          <Phase key={phase.id} phase={phase} />
        ))}
        <AddButton onClick={() => undefined} text='Legg til fase' />
      </div>
    </>
  );
};

export default ProcessTemplate;

const Phase = ({ phase }: { phase: IPhase }) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.flexCenter}>
        <Typo variant='h2'>{phase.title}</Typo>
        <IconButton aria-label='edit'>
          <EditIcon />
        </IconButton>
      </div>
      <TemplateTable phaseTitle={phase.title} tasks={phase.tasks} />
    </div>
  );
};

const TemplateTable = ({ tasks, phaseTitle }: { tasks: ITask[]; phaseTitle: string }) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const classes = useStyles();
  return (
    <Table aria-label='Prosessmal tabel' className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell className={classes.headerCell} size='small'>
            Tittel
          </TableCell>
          <TableCell className={classes.headerCell} size='small'>
            Beskrivelse
          </TableCell>
          <TableCell className={classes.headerCell} size='small'>
            Ansvarlig
          </TableCell>
          <TableCell className={classes.headerCell} size='small'></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {tasks.map((task: ITask) => (
          <TableRow className={classes.hideLastBorder} key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>
              <div className={classes.flexCenter}>
                <Avatar className={classes.avatarSize}>O</Avatar>
                Ola Halvorsen
              </div>
            </TableCell>
            <TableCell>
              <IconButton aria-label='edit'>
                <EditIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        <TableRow className={classes.hideLastBorder}>
          <TableCell>
            <AddButton onClick={() => setModalIsOpen(true)} text='Legg til oppgave' />
            <CreateTaskModal closeModal={() => setModalIsOpen(false)} modalIsOpen={modalIsOpen} phaseTitle={phaseTitle} />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const CreateTaskModal = ({ phaseTitle, modalIsOpen, closeModal }: { phaseTitle: string; modalIsOpen: boolean; closeModal: () => void }) => {
  const classes = useStyles();

  const { register, handleSubmit, errors } = useForm();

  const onSubmit = handleSubmit((data) => data);

  return (
    <Modal
      buttonGroup={[
        <Button key={'avbryt'} onClick={closeModal}>
          Avbryt
        </Button>,
        <Button key={'create'} onClick={() => undefined} type='submit'>
          Lag oppgave
        </Button>,
      ]}
      header={'Lag ny oppgave'}
      onClose={closeModal}
      onSubmit={onSubmit}
      open={modalIsOpen}
      subheader={
        <>
          til <b>Fase {phaseTitle}</b>
        </>
      }>
      <div className={classes.grid}>
        <TextField errors={errors} label='Oppgavetittel' name='title' register={register} required />
        <TextField errors={errors} label='Oppgavebeskrivelse' maxRows={4} multiline name='description' register={register} rows={4} />
        <TextField errors={errors} label='Oppgaveansvarlig' name='responsible' register={register} />
      </div>
    </Modal>
  );
};
