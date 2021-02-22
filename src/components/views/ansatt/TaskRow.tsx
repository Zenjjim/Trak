import { Avatar, Box, IconButton } from '@material-ui/core';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, Info as InfoIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';
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
  const classes = useStyles();
  return (
    <Box display='flex'>
      <Box alignItems='center' display='flex' flexGrow={2}>
        {task.completed ? (
          <>
            <CheckBoxIcon />
            <Typo className={classes.completedTask} color='disabled' variant='body2'>
              {task.task.title}
            </Typo>
            <IconButton onClick={() => alert('Hei')}>
              <InfoIcon />
            </IconButton>
          </>
        ) : (
          <>
            <CheckBoxOutlineBlankIcon />
            <Typo variant='body2'>{task.task.title}</Typo>
            <IconButton onClick={() => alert('Hei')}>
              <InfoIcon color={'primary'} />
            </IconButton>
          </>
        )}
      </Box>
      {task.responsible && (
        <Box alignItems='center' display='flex' flexDirection='row' flexGrow={1}>
          <Avatar className={classes.avatar} src={task.responsible.imageUrl || '/dummy_avatar.png'} />
          <Typo variant='body2'>
            {task.responsible.firstName} {task.responsible.lastName}
          </Typo>
        </Box>
      )}
    </Box>
  );
};
export default TaskRow;
