import { Box, Button, Hidden } from '@material-ui/core';
import AlarmIcon from '@material-ui/icons/Alarm';
import { makeStyles } from '@material-ui/styles';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import ChangeDueDateModal from 'components/views/ansatt/ChangeDueDateModal';
import TaskModal from 'components/views/ansatt/TaskModal';
import TaskRow from 'components/views/ansatt/TaskRow';
import moment from 'moment';
import { useState } from 'react';
import theme from 'theme';
import { IEmployeeTask } from 'utils/types';

const useStyles = makeStyles({
  spaceRight: {
    marginRight: theme.spacing(2),
  },
});

type PhaseProps = {
  phaseId: string;
  title: string;
  tasksFinished: number;
  totalTasks: number;
  employeeTasks: IEmployeeTask[];
  first: boolean;
};

const Phase = ({ phaseId, title, tasksFinished, totalTasks, employeeTasks, first }: PhaseProps) => {
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [createTaskModalIsOpen, setCreateModalIsOpen] = useState(false);
  return (
    <Box marginBottom={theme.spacing(2)}>
      <Box alignItems='center' display='flex'>
        <Typo className={classes.spaceRight} variant='h2'>
          {title}
        </Typo>
        <Button onClick={() => setModalIsOpen(true)} size='medium' startIcon={<AlarmIcon />}>
          {moment(employeeTasks[0].dueDate).format('DD.MM.YYYY')}
        </Button>
      </Box>
      <Box display='flex'>
        <Box flex={2} mb={theme.spacing(1)}>
          <Typo variant='body2'>
            <b>{tasksFinished}</b> av <b>{totalTasks}</b> oppgaver er gjennomført
          </Typo>
        </Box>
        <Hidden smDown>
          <Box flex={1}>{first && <Typo variant='body2'>Ansvarlig</Typo>}</Box>
        </Hidden>
      </Box>
      {employeeTasks.map((employeeTask) => {
        return <TaskRow employeeTask={employeeTask} key={employeeTask.taskId} />;
      })}
      <AddButton onClick={() => setCreateModalIsOpen(true)} text='Legg til oppgave' />
      <ChangeDueDateModal closeModal={() => setModalIsOpen(false)} employeeTasks={employeeTasks} modalIsOpen={modalIsOpen} />
      <TaskModal closeModal={() => setCreateModalIsOpen(false)} dueDate={employeeTasks[0]?.dueDate} modalIsOpen={createTaskModalIsOpen} phaseId={phaseId} />
    </Box>
  );
};

export default Phase;
