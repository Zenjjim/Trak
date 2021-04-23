import { Button, makeStyles, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import axios from 'axios';
import EmployeeSelector from 'components/form/EmployeeSelector';
import TagSelector from 'components/form/TagSelector';
import TextField from 'components/form/TextField';
import ToggleButtonGroup from 'components/form/ToggleButtonGroup';
import Modal from 'components/Modal';
import Typo from 'components/Typo';
import { useData } from 'context/Data';
import useProgressbar from 'context/Progressbar';
import useSnackbar from 'context/Snackbar';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IEmployee, IPhase, ITag, ITask } from 'utils/types';
import { axiosBuilder } from 'utils/utils';
import validator from 'validator';

type TaskModalProps = {
  phase: IPhase;
  modalIsOpen: boolean;
  closeModal: () => void;
  task_id?: string;
};

type TaskData = {
  title: string;
  description?: string;
  professions?: string[];
  responsible?: IEmployee;
  tags?: ITag[];
};

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateRows: 'auto',
    rowGap: 32,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const TaskModal = ({ phase, modalIsOpen, closeModal, task_id = undefined }: TaskModalProps) => {
  const classes = useStyles();
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const showProgressbar = useProgressbar();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const { professions, tags, employees } = useData();
  const [task, setTask] = useState<ITask | undefined>(undefined);
  const { register, handleSubmit, errors, control, reset } = useForm({
    reValidateMode: 'onChange',
    defaultValues: useMemo(
      () => ({
        title: task?.title,
        description: task?.description,
        link: task?.link,
        professions: task?.professions,
        tags: task?.tags,
        responsible: task?.responsible,
      }),
      [task],
    ),
  });

  useEffect(() => {
    if (task_id) {
      axios.get(`/api/tasks/${task_id}`).then((res) => {
        setTask(res.data);
      });
    }
  }, [task_id]);

  useEffect(() => {
    reset({
      title: task?.title,
      description: task?.description,
      link: task?.link,
      professions: task?.professions,
      tags: task?.tags,
      responsible: task?.responsible,
    });
  }, [task]);

  const axiosTaskModal = (axiosFunc: Promise<unknown>, text: string) => {
    axiosBuilder(axiosFunc, text, router, showProgressbar, showSnackbar, closeModal);
  };

  const onSubmit = handleSubmit((formData: TaskData) => {
    const data = {
      data: formData,
      phaseId: phase.id,
      global: true,
    };
    if (task_id) {
      axiosTaskModal(axios.put(`/api/tasks/${task_id}`, data), 'Oppgave opprettet');
    } else {
      axiosTaskModal(axios.post('/api/tasks', data), 'Oppgave oppdatert');
    }
  });

  const buttonGroup = confirmDelete
    ? [
        <Typo key={'text'}>Er du sikker?</Typo>,
        <Button key={'cancel'} onClick={() => setConfirmDelete(false)} type='button'>
          Avbryt
        </Button>,
        <Button
          className={classes.error}
          color='inherit'
          key={'delete'}
          onClick={() => axiosTaskModal(axios.delete(`/api/tasks/${task_id}`), 'Oppgave slettet')}
          type='button'>
          Slett
        </Button>,
      ]
    : [
        <Button key={'cancel'} onClick={closeModal} type='button'>
          Avbryt
        </Button>,
        task_id && (
          <Button className={classes.error} color='inherit' key={'delete'} onClick={() => setConfirmDelete(true)} type='button'>
            Slett
          </Button>
        ),
        <Button key={'create'} type='submit'>
          {task_id ? 'Oppdater' : 'Opprett'}
        </Button>,
      ];

  return (
    <Modal
      buttonGroup={buttonGroup}
      header={task_id ? 'Oppdater oppgave' : 'Lag oppgave'}
      onClose={closeModal}
      onSubmit={onSubmit}
      open={modalIsOpen}
      subheader={
        <>
          til <b>{phase.title}</b>
        </>
      }>
      <div className={classes.grid}>
        <TextField
          errors={errors}
          inputProps={{ 'aria-label': 'Rediger oppgavetittel' }}
          label='Oppgavetittel'
          name='title'
          register={register}
          required
          rules={{
            required: 'Oppgavetittel er påkrevd',
          }}
        />
        <TextField
          errors={errors}
          inputProps={{ 'aria-label': 'Rediger oppggavebeskrivelse' }}
          label={
            <>
              Oppgavebeskrivelse{' '}
              <Tooltip
                title={
                  <>
                    Dette feltet støtter{' '}
                    <a href='https://www.markdownguide.org/cheat-sheet/' rel='noreferrer noopener' target='_blank'>
                      markdown
                    </a>
                  </>
                }>
                <HelpIcon fontSize='small' />
              </Tooltip>
            </>
          }
          multiline
          name='description'
          register={register}
          rows={4}
        />
        <TextField
          errors={errors}
          inputProps={{ 'aria-label': 'Rediger hurtiglink' }}
          label={
            <>
              Link{' '}
              <Tooltip title={`Link til nettsted/e-post for å få rask tilgang fra oppgaveoversikten`}>
                <HelpIcon fontSize='small' />
              </Tooltip>
            </>
          }
          name='link'
          register={register}
          rules={{
            validate: {
              isLinkOrEmail: (tekst) => validator.isEmail(tekst) || validator.isURL(tekst) || !tekst || 'Linken må være en gyldig URL eller E-post',
            },
          }}
        />
        <ToggleButtonGroup control={control} name={'professions'} professions={professions} />
        <TagSelector control={control} label='Tags' name='tags' options={tags} />
        <EmployeeSelector control={control} employees={employees} label='Oppgaveansvarlig' name='responsible' />
      </div>
    </Modal>
  );
};

export default TaskModal;
