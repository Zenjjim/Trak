import { Box, Button, Chip, IconButton, makeStyles, Skeleton } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import axios from 'axios';
import EmployeeSelector from 'components/form/EmployeeSelector';
import Modal from 'components/Modal';
import Typo from 'components/Typo';
import { DataProvider, useData } from 'context/Data';
import useSnackbar from 'context/Snackbar';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import Linkify from 'react-linkify';
import ReactMarkdown from 'react-markdown';
import theme from 'theme';
import { IEmployeeTask } from 'utils/types';

const useStyles = makeStyles({
  chip: {
    marginRight: theme.spacing(1),
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'fit-content(100%) auto',
    columnGap: theme.spacing(2),
  },
  centeringRow: {
    display: 'grid',
    gridTemplateColumns: '4fr 1fr 1fr',
  },
});

const ResponsibleSelector = ({ employeeTask }: { employeeTask: IEmployeeTask }) => {
  const [responsibleSelector, setResponsibleSelector] = useState<boolean>(false);
  const { employees } = useData();
  const classes = useStyles();
  const showSnackbar = useSnackbar();
  const router = useRouter();

  const { control, reset, handleSubmit } = useForm({
    reValidateMode: 'onChange',
    defaultValues: useMemo(
      () => ({
        responsible: employeeTask?.responsible,
      }),
      [employeeTask, employeeTask?.responsible],
    ),
  });

  useEffect(() => {
    reset({
      responsible: employeeTask?.responsible,
    });
  }, [employeeTask, employeeTask?.responsible]);

  useMemo(() => employeeTask, [employeeTask, employeeTask?.responsible]);

  const onSubmit = handleSubmit(async (formData) => {
    if (formData.responsible?.id !== employeeTask.responsible.id) {
      try {
        await axios.put(`/api/employeeTasks/${employeeTask.id}`, {
          completed: employeeTask.completed,
          dueDate: employeeTask.dueDate,
          responsibleId: formData.responsible?.id,
        });
        const employeeWantsDelegateNotifications = formData.responsible.employeeSettings?.notificationSettings?.includes('DELEGATE');
        if (employeeWantsDelegateNotifications) {
          await axios.post('/api/notification', {
            description: `Du har blitt delegert arbeidsoppgaven "${employeeTask.task.title}" av ${employeeTask.responsible.firstName} ${employeeTask.responsible.lastName}`,
            employeeId: formData.responsible?.id,
            ...(formData.responsible.employeeSettings?.slack && {
              slackData: {
                email: formData.responsible.email,
              },
            }),
          });
        }

        setResponsibleSelector(false);
        employeeTask.responsible = formData.responsible;
        router.replace(router.asPath).finally(() => {
          showSnackbar('Ansvarlig byttet', 'success');
        });
      } catch (error) {
        showSnackbar(error.response?.data?.message || 'Noe gikk galt', 'error');
      }
    }
  });

  return (
    <Typo variant='body1'>
      {employeeTask ? (
        responsibleSelector ? (
          <form className={classes.centeringRow}>
            <EmployeeSelector control={control} employees={employees} label='Oppgaveansvarlig' name='responsible' required />
            <Button onClick={onSubmit} type='button'>
              Lagre
            </Button>
            <Button onClick={() => setResponsibleSelector(false)} type='button'>
              Avbryt
            </Button>
          </form>
        ) : (
          <>
            {`${employeeTask?.responsible.firstName} ${employeeTask?.responsible.lastName}`}
            <IconButton onClick={() => setResponsibleSelector(true)} size='small'>
              <Edit />
            </IconButton>
          </>
        )
      ) : (
        <Skeleton width={theme.spacing(32)} />
      )}
    </Typo>
  );
};

type InfoModalProps = {
  employee_task_id: string;
  modalIsOpen: boolean;
  closeModal: () => void;
};

const InfoModal = ({ employee_task_id, modalIsOpen, closeModal }: InfoModalProps) => {
  const classes = useStyles();
  const [employeeTask, setEmployeeTask] = useState<IEmployeeTask | undefined>(undefined);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    axios
      .get(`/api/employeeTasks/${employee_task_id}`)
      .then((res) => {
        setEmployeeTask(res.data);
      })
      .catch((error) => {
        showSnackbar(error.response.data?.message || 'Noe gikk galt', 'error');
      });
  }, [employee_task_id]);
  return (
    <Modal
      buttonGroup={[
        <Button key={'avbryt'} onClick={closeModal} type='button'>
          Avbryt
        </Button>,
      ]}
      header={employeeTask ? <>{employeeTask?.task.title}</> : <Skeleton />}
      onClose={closeModal}
      onSubmit={null}
      open={modalIsOpen}>
      <>
        <div className={classes.grid}>
          <Typo variant='body1'>
            <b>Ansvarlig:</b>
          </Typo>
          <DataProvider>
            <ResponsibleSelector employeeTask={employeeTask} />
          </DataProvider>
          <Typo variant='body1'>
            <b>Gjelder:</b>
          </Typo>
          <Typo variant='body1'>
            {employeeTask ? `${employeeTask?.employee.firstName} ${employeeTask?.employee.lastName}` : <Skeleton width={theme.spacing(32)} />}
          </Typo>
          <Typo variant='body1'>
            <b>Fase:</b>
          </Typo>
          <Typo variant='body1'>{employeeTask ? `${employeeTask?.task.phase.title}` : <Skeleton width={theme.spacing(32)} />}</Typo>
          <Typo variant='body1'>
            <b>Forfallsdato:</b>
          </Typo>
          <Typo variant='body1'>{employeeTask ? moment(new Date(employeeTask?.dueDate)).format('DD.MM.YYYY') : <Skeleton width={theme.spacing(32)} />}</Typo>
          {employeeTask?.completedBy && employeeTask?.completedDate && (
            <>
              <Typo variant='body1'>
                <b>Fullført av:</b>{' '}
              </Typo>
              <Typo variant='body1'>
                {employeeTask.completedBy.firstName} {employeeTask.completedBy.lastName} den{' '}
                {moment(new Date(employeeTask?.completedDate)).format('DD.MM.YYYY')}
              </Typo>
            </>
          )}
        </div>
        <Box className={classes.gutterBottom}>
          {employeeTask ? (
            <>
              {employeeTask?.task.tags.map((tag) => {
                return <Chip className={classes.chip} color='primary' key={tag.id} label={tag.title} size='small' />;
              })}
            </>
          ) : (
            <div className={classes.centeringRow}>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i}>
                    <Chip />
                  </Skeleton>
                ))}
            </div>
          )}
        </Box>
        <Typo>
          {employeeTask ? (
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a href={decoratedHref} key={key} target='blank'>
                  {decoratedText}
                </a>
              )}>
              <ReactMarkdown>{employeeTask?.task.description}</ReactMarkdown>
            </Linkify>
          ) : (
            <Skeleton height={theme.spacing(24)} />
          )}
        </Typo>
      </>
    </Modal>
  );
};

export default InfoModal;
