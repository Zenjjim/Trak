import { Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
import EmployeeSelector from 'components/form/EmployeeSelector';
import TagSelector from 'components/form/TagSelector';
import TextField from 'components/form/TextField';
import ToggleButtonGroup from 'components/form/ToggleButtonGroup';
import Modal from 'components/Modal';
import Typo from 'components/Typo';
import useProgressbar from 'context/Progressbar';
import useSnackbar from 'context/Snackbar';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { IEmployee, IPhase, IProfession, ITag, ITask } from 'utils/types';

type TaskModalProps = {
  phase: IPhase;
  modalIsOpen: boolean;
  closeModal: () => void;
  professions: IProfession[];
  tags: ITag[];
  employees: IEmployee[];
  task?: ITask;
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

const TaskModal = ({ employees, phase, modalIsOpen, closeModal, professions, tags, task = undefined }: TaskModalProps) => {
  const classes = useStyles();
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const showProgressbar = useProgressbar();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const { register, handleSubmit, errors, control } = useForm({
    defaultValues: {
      title: task?.title,
      description: task?.description,
      professions: task?.professions?.map((profession) => profession.id),
    },
  });

  const CRUDBuilder = (axiosFunc: Promise<unknown>, text: string) => {
    showProgressbar(true);
    axiosFunc
      .then(() => {
        closeModal();
        router.replace(router.asPath).finally(() => {
          showProgressbar(false);
          showSnackbar(text, 'success');
        });
      })
      .catch((error) => {
        showProgressbar(false);
        showSnackbar(error, 'error');
      });
  };

  const onSubmit = handleSubmit((formData: TaskData) => {
    const data = {
      data: formData,
      phaseId: phase.id,
      global: true,
    };
    if (task) {
      CRUDBuilder(axios.put(`/api/task/${task.id}`, data), 'Oppgave opprettet');
    } else {
      CRUDBuilder(axios.post('/api/task', data), 'Oppgave oppdatert');
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
          onClick={() => CRUDBuilder(axios.delete(`/api/task/${task.id}`), 'Oppgave slettet')}
          type='button'>
          Slett
        </Button>,
      ]
    : [
        <Button key={'cancel'} onClick={closeModal} type='button'>
          Avbryt
        </Button>,
        task && (
          <Button className={classes.error} color='inherit' key={'delete'} onClick={() => setConfirmDelete(true)} type='button'>
            Slett
          </Button>
        ),
        <Button key={'create'} type='submit'>
          {task ? 'Oppdater' : 'Opprett'}
        </Button>,
      ];

  return (
    <Modal
      buttonGroup={buttonGroup}
      header={'Lag ny oppgave'}
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
          label='Oppgavetittel'
          name='title'
          register={register}
          required
          rules={{
            required: 'Oppgavetittel er påkrevd',
          }}
        />
        <TextField errors={errors} label='Oppgavebeskrivelse' multiline name='description' register={register} rows={4} />
        <ToggleButtonGroup control={control} name={'professions'} professions={professions} />
        <TagSelector control={control} defaultValue={task?.tags} label='Tags' name='tags' options={tags} />
        <EmployeeSelector control={control} employee={task?.responsible} employees={employees} label='Oppgaveansvarlig' name='responsible' />
      </div>
    </Modal>
  );
};

export default TaskModal;
