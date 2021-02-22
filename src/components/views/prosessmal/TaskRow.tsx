import { Avatar, IconButton, makeStyles, TableCell, TableRow } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import TaskModal from 'components/views/prosessmal/TaskModal';
import { useState } from 'react';
import { IEmployee, IPhase, IProfession, ITag, ITask } from 'utils/types';

type TaskProps = {
  task: ITask;
  phase: IPhase;
  professions: IProfession[];
  employees: IEmployee[];
  tags: ITag[];
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

const TaskRow = ({ task, phase, professions, tags, employees }: TaskProps) => {
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  if (!task) {
    return <></>;
  }
  return (
    <TableRow className={classes.hideLastBorder} key={task.id}>
      <TableCell>{task.title}</TableCell>
      <TableCell>{task.description}</TableCell>
      <TableCell>
        {task.responsible && (
          <div className={classes.flexCenter}>
            <Avatar className={classes.avatarSize} src={task.responsible.imageUrl}>
              X
            </Avatar>
            {`${task.responsible.firstName} ${task.responsible.lastName}`}
          </div>
        )}
      </TableCell>
      <TableCell>
        <IconButton
          aria-label='edit'
          onClick={() => {
            setModalIsOpen(true);
          }}>
          <Edit />
        </IconButton>
        <TaskModal
          closeModal={() => setModalIsOpen(false)}
          employees={employees}
          modalIsOpen={modalIsOpen}
          phase={phase}
          professions={professions}
          tags={tags}
          task={task}
        />
      </TableCell>
    </TableRow>
  );
};

export default TaskRow;
