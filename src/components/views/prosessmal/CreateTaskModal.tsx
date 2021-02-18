import { Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
import EmployeeSelector from 'components/form/EmployeeSelector';
import TagSelector from 'components/form/TagSelector';
import TextField from 'components/form/TextField';
import ToggleButtonGroup from 'components/form/ToggleButtonGroup';
import Modal from 'components/Modal';
import useProgressbar from 'context/Progressbar';
import useSnackbar from 'context/Snackbar';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { IEmployee, IPhase, IProfession, ITag, ITask } from 'utils/types';

type CreateTaskModalProps = {
  phase: IPhase;
  modalIsOpen: boolean;
  closeModal: () => void;
  professions: IProfession[];
  tags: ITag[];
  employees: IEmployee[];
  task?: ITask;
};

type CreateTaskData = {
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

const CreateTaskModal = ({ employees, phase, modalIsOpen, closeModal, professions, tags, task = undefined }: CreateTaskModalProps) => {
  const classes = useStyles();
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const showProgressbar = useProgressbar();
  const { register, handleSubmit, errors, control } = useForm({
    defaultValues: {
      title: task?.title,
      description: task?.description,
      professions: task?.professions?.map((profession) => profession.id),
    },
  });

  const onSubmit = handleSubmit((formData: CreateTaskData) => {
    const data = {
      data: formData,
      phaseId: phase.id,
      global: true,
    };
    showProgressbar(true);
    if (task) {
      axios
        .put(`/api/task/${task.id}`, data)
        .then(() => {
          closeModal();
          router.replace(router.asPath);
          showSnackbar('Oppgave oppdatert', 'success');
        })
        .catch((error) => {
          showSnackbar('Noe gikk feil', 'error');
          // eslint-disable-next-line no-console
          console.error(error);
        })
        .finally(() => {
          showProgressbar(false);
        });
    } else {
      axios
        .post('/api/task', data)
        .then(() => {
          closeModal();
          router.replace(router.asPath);
          showSnackbar('Oppgave opprettet', 'success');
        })
        .catch((error) => {
          showSnackbar('Noe gikk feil', 'error');
          // eslint-disable-next-line no-console
          console.error(error);
        })
        .finally(() => {
          showProgressbar(false);
        });
    }
  });

  const deleteTask = () => {
    axios
      .delete(`/api/task/${task.id}`)
      .then(() => {
        closeModal();
        router.replace(router.asPath);
        showSnackbar('Oppgave slettet', 'success');
      })
      .catch((error) => {
        showSnackbar('Noe gikk feil', 'error');
        // eslint-disable-next-line no-console
        console.error(error);
      })
      .finally(() => {
        showProgressbar(false);
      });
  };

  const buttonGroup = [
    <Button key={'avbryt'} onClick={closeModal} type='button'>
      Avbryt
    </Button>,
    task && (
      <Button className={classes.error} color='inherit' key={'delete'} onClick={deleteTask} type='button'>
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

export default CreateTaskModal;
