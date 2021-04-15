import { Button, makeStyles, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import axios from 'axios';
import EmployeeSelector from 'components/form/EmployeeSelector';
import TagSelector from 'components/form/TagSelector';
import TextField from 'components/form/TextField';
import Modal from 'components/Modal';
import { useData } from 'context/Data';
import useProgressbar from 'context/Progressbar';
import useSnackbar from 'context/Snackbar';
import { useRouter } from 'next/router';
import { EmployeeContext } from 'pages/ansatt/[id]';
import { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ITask } from 'utils/types';
import { axiosBuilder } from 'utils/utils';
import validator from 'validator';

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateRows: 'auto',
    rowGap: theme.spacing(4),
  },
  error: {
    color: theme.palette.error.main,
  },
}));

type TaskModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  phaseId: string;
  dueDate: Date;
};

const TaskModal = ({ modalIsOpen, closeModal, phaseId, dueDate }: TaskModalProps) => {
  const buttonGroup = [
    <Button key='cancel' onClick={closeModal} type='button'>
      Avrbyt
    </Button>,
    <Button key='create' type='submit'>
      Opprett
    </Button>,
  ];
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const showProgressbar = useProgressbar();
  const { tags, employees } = useData();
  const defaultValues = {
    title: '',
    link: '',
    description: '',
    tags: [],
    responsible: null,
  };
  const { register, handleSubmit, errors, control, clearErrors, reset } = useForm({
    defaultValues: defaultValues,
  });
  const { employee } = useContext(EmployeeContext);
  const classes = useStyles();
  const onSubmit = handleSubmit((formData) => {
    const data = {
      data: { ...formData, professions: [employee.profession] },
      phaseId: phaseId,
      global: false,
    };
    axios
      .post('/api/tasks', data)
      .then((res) => {
        const newTask: ITask = res.data;
        const responsibleId = formData.responsible?.id || employee.hrManager.id;
        const data = { taskId: newTask.id, dueDate: dueDate, employeeId: employee.id, responsibleId: responsibleId };

        axiosBuilder(axios.post('/api/employeeTasks', { data }), 'Oppgaven ble opprettet', router, showProgressbar, showSnackbar, closeModal);
      })
      .catch((err) => {
        showSnackbar(err?.message, 'error');
      });
  });

  useEffect(() => {
    return () => {
      clearErrors();
      reset(defaultValues);
    };
  }, []);

  return (
    <Modal buttonGroup={buttonGroup} header={'Lag oppgave'} onClose={closeModal} onSubmit={onSubmit} open={modalIsOpen}>
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
        <TextField
          errors={errors}
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
        <TagSelector control={control} label='Tags' name='tags' options={tags} />
        <EmployeeSelector control={control} employees={employees} label='Oppgaveansvarlig' name='responsible' />
      </div>
    </Modal>
  );
};

export default TaskModal;
