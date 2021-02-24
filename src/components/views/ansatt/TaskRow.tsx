import { Box, IconButton } from '@material-ui/core';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, Info as InfoIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import AvatarComponent from 'components/AvatarComponent';
import Typo from 'components/Typo';
import InfoModal from 'components/views/ansatt/InfoModal';
import { useState } from 'react';
import theme from 'theme';
import { IEmployeeTask } from 'utils/types';

const useStyles = makeStyles({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  completedTask: {
    textDecoration: 'line-through',
  },
});

type TaskRowProps = {
  task: IEmployeeTask;
};

const TaskRow = ({ task }: TaskRowProps) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const classes = useStyles();

  return (
    <Box display='flex'>
      <Box alignItems='center' display='flex' flex={2}>
        {task.completed ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        <Typo className={task.completed && classes.completedTask} color={!task.completed && 'disabled'} noWrap variant='body1'>
          {task.task.title}
        </Typo>
        <IconButton onClick={() => setModalIsOpen(true)} size='small'>
          <InfoIcon color={task.completed ? 'inherit' : 'primary'} />
        </IconButton>
        <InfoModal closeModal={() => setModalIsOpen(false)} modalIsOpen={modalIsOpen} task={task} />
      </Box>
      {task.responsible && (
        <Box alignItems='center' display='flex' flex={1} flexDirection='row'>
          <AvatarComponent
            className={classes.avatar}
            firstName={task.responsible.firstName}
            image={task.responsible.imageUrl}
            lastName={task.responsible.lastName}
          />
          <Typo variant='body1'>
            {task.responsible.firstName} {task.responsible.lastName}
          </Typo>
        </Box>
      )}
    </Box>
  );
};
export default TaskRow;
