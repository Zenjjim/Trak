import { Box } from '@material-ui/core';
import AddButton from 'components/AddButton';
import Typo from 'components/Typo';
import theme from 'theme';
import { IEmployee, IEmployeeTask } from 'utils/types';

import TaskRow from './TaskRow';

type PhaseProps = {
  title: string;
  tasksFinished: number;
  totalTasks: number;
  tasks: IEmployeeTask[];
  employee: IEmployee;
};

const Phase = ({ employee, title, tasksFinished, totalTasks, tasks }: PhaseProps) => {
  return (
    <Box marginBottom={theme.spacing(2)}>
      <Typo variant='h2'>{title}</Typo>
      <Box display='flex'>
        <Box flexGrow={2} mb={theme.spacing(1)}>
          <Typo variant='body2'>
            <b>{tasksFinished}</b> av <b>{totalTasks}</b> oppgaver er gjennomført
          </Typo>
        </Box>
        <Box flexGrow={1}>
          <Typo variant='body2'>Ansvarlig</Typo>
        </Box>
      </Box>
      {tasks.map((task) => {
        return <TaskRow employee={employee} key={task.taskId} task={task} />;
      })}
      <AddButton onClick={() => undefined} text='Legg til oppgave' />
    </Box>
  );
};

export default Phase;
