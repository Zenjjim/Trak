import { Button, makeStyles } from '@material-ui/core';
import axios from 'axios';
import EmployeeSelector from 'components/form/EmployeeSelector';
import TagSelector from 'components/form/TagSelector';
import TextField from 'components/form/TextField';
import ToggleButtonGroup from 'components/form/ToggleButtonGroup';
import Modal from 'components/Modal';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { IEmployee, IPhase, IProfession, ITag } from 'utils/types';

type CreateTaskModalProps = {
  phase: IPhase;
  modalIsOpen: boolean;
  closeModal: () => void;
  professions: IProfession[];
  tags: ITag[];
  employees: IEmployee[];
};

type CreateTaskData = {
  title: string;
  description?: string;
  professions?: string[];
  responsible?: IEmployee;
  tags?: ITag[];
};

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateRows: 'auto',
    rowGap: 32,
  },
});

const CreateTaskModal = ({ employees, phase, modalIsOpen, closeModal, professions, tags }: CreateTaskModalProps) => {
  const classes = useStyles();
  const router = useRouter();
  const { register, handleSubmit, errors, control } = useForm();

  const onSubmit = handleSubmit((data: CreateTaskData) => {
    axios
      .post('/api/task', {
        data: data,
        phaseId: phase.id,
      })
      .then(() => {
        router.replace(router.asPath);
        closeModal();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  });

  return (
    <Modal
      buttonGroup={[
        <Button key={'avbryt'} onClick={closeModal} type='button'>
          Avbryt
        </Button>,
        <Button key={'create'} type='submit'>
          Lag oppgave
        </Button>,
      ]}
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
            required: true,
          }}
        />
        <TextField errors={errors} label='Oppgavebeskrivelse' multiline name='description' register={register} rows={4} />
        <ToggleButtonGroup control={control} name={'professions'} professions={professions} />
        <TagSelector control={control} label='Tags' name='tags' options={tags} />
        <EmployeeSelector control={control} employees={employees} label='Oppgaveansvarlig' name='responsible' />
      </div>
    </Modal>
  );
};

export default CreateTaskModal;
