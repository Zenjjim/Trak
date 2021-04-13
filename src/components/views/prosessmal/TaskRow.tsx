import { IconButton, makeStyles, TableCell, TableRow } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import Avatar from 'components/Avatar';
import TaskModal from 'components/views/prosessmal/TaskModal';
import { useState } from 'react';
import { IPhase, ITask } from 'utils/types';

type TaskProps = {
  task: ITask;
  phase: IPhase;
};

const useStyles = makeStyles((theme) => ({
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
}));

const TaskRow = ({ task, phase }: TaskProps) => {
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  if (!task) {
    return <></>;
  }
  return (
    <TableRow className={classes.hideLastBorder} key={task.id}>
      <TableCell style={{ width: '25rem' }}>{task.title}</TableCell>
      <TableCell style={{ width: '55rem' }}>{task.description}</TableCell>
      <TableCell style={{ width: '20rem' }}>
        {task.responsible && (
          <div className={classes.flexCenter}>
            <Avatar
              className={classes.avatarSize}
              firstName={task.responsible.firstName}
              image={task.responsible.imageUrl}
              lastName={task.responsible.lastName}
            />
            {`${task.responsible.firstName} ${task.responsible.lastName}`}
          </div>
        )}
      </TableCell>
      <TableCell style={{ width: '10rem' }}>
        <IconButton
          aria-label='edit'
          onClick={() => {
            setModalIsOpen(true);
          }}>
          <Edit />
        </IconButton>
        {modalIsOpen && <TaskModal closeModal={() => setModalIsOpen(false)} modalIsOpen={modalIsOpen} phase={phase} task_id={task.id} />}
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
