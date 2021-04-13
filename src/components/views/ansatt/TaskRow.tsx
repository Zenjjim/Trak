import { Box, ButtonBase, Hidden, IconButton, Tooltip } from '@material-ui/core';
import { CheckBox as CheckBoxIcon, CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon, Launch, Mail } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import Avatar from 'components/Avatar';
import InfoModal from 'components/InfoModal';
import Typo from 'components/Typo';
import useSnackbar from 'context/Snackbar';
import { EmployeeContext } from 'pages/ansatt/[id]';
import React, { useContext, useMemo, useState } from 'react';
import theme from 'theme';
import { IEmployeeTask } from 'utils/types';
import { toggleCheckBox } from 'utils/utils';
import validator from 'validator';

const useStyles = makeStyles({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  completedTask: {
    textDecoration: 'line-through',
  },
  textButton: {
    '&:hover': {
      background: theme.palette.text.secondary,
      borderRadius: theme.spacing(0.5),
    },
  },
});

type TaskRowProps = {
  employeeTask: IEmployeeTask;
};

const TaskRow = ({ employeeTask }: TaskRowProps) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const classes = useStyles();
  const { employee } = useContext(EmployeeContext);
  const [completed, setCompleted] = useState<boolean>(employeeTask.completed);
  const showSnackbar = useSnackbar();

  useMemo(() => setCompleted(employeeTask.completed), [employeeTask, employeeTask.completed]);

  return (
    <Box display='flex'>
      <Box alignItems='center' display='flex' flex={2}>
        <IconButton onClick={() => toggleCheckBox(employeeTask, completed, setCompleted, showSnackbar)} size='small'>
          {completed ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
        </IconButton>
        <ButtonBase className={classes.textButton} onClick={() => setModalIsOpen(true)}>
          <Typo className={completed ? classes.completedTask : null} color={!completed && 'disabled'} noWrap style={{ maxWidth: '80vw' }} variant='body1'>
            {employeeTask.task.title}
          </Typo>
        </ButtonBase>
        {employeeTask.task.link && (
          <Tooltip title={employeeTask.task.link}>
            <a href={`${validator.isEmail(employeeTask.task.link) && 'mailto:'}${employeeTask.task.link}`} rel='noopener noreferrer' target='_blank'>
              <IconButton size='small'>{validator.isEmail(employeeTask.task.link) ? <Mail /> : <Launch />}</IconButton>
            </a>
          </Tooltip>
        )}
        {modalIsOpen && <InfoModal closeModal={() => setModalIsOpen(false)} employee_task_id={employeeTask.id} modalIsOpen={modalIsOpen} />}
      </Box>
      <Hidden smDown>
        {employeeTask.responsible.id !== employee.hrManager.id && (
          <Box alignItems='center' display='flex' flex={1} flexDirection='row'>
            <Avatar
              className={classes.avatar}
              firstName={employeeTask.responsible.firstName}
              image={employeeTask.responsible.imageUrl}
              lastName={employeeTask.responsible.lastName}
            />
            <Typo variant='body1'>
              {employeeTask.responsible.firstName} {employeeTask.responsible.lastName}
            </Typo>
          </Box>
        )}
      </Hidden>
    </Box>
  );
};
export default TaskRow;
