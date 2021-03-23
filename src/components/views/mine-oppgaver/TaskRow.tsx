import { ButtonBase, IconButton, makeStyles } from '@material-ui/core';
import { CheckBox, CheckBoxOutlineBlank } from '@material-ui/icons';
import Avatar from 'components/Avatar';
import InfoModal from 'components/InfoModal';
import Typo from 'components/Typo';
import useSnackbar from 'context/Snackbar';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import theme from 'theme';
import { IEmployeeTask } from 'utils/types';
import { toggleCheckBox } from 'utils/utils';

const useStyles = makeStyles({
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  completedTask: {
    textDecoration: 'line-through',
  },
  centeringRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '35rem',
  },
  avatarOnClick: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 'max-content',
    borderRadius: '4px',
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.text.secondary,
    },
  },
  textButton: {
    '&:hover': {
      background: theme.palette.text.secondary,
      borderRadius: theme.spacing(0.5),
    },
  },
});

const TaskRow = ({ data }: { data: IEmployeeTask }) => {
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(data.completed);
  const showSnackbar = useSnackbar();
  const router = useRouter();

  return (
    <>
      <div className={classes.centeringRow}>
        <IconButton onClick={() => toggleCheckBox(data, completed, setCompleted, showSnackbar)} size='small'>
          {completed ? <CheckBox /> : <CheckBoxOutlineBlank />}
        </IconButton>
        <ButtonBase className={classes.textButton} onClick={() => setModalIsOpen(true)}>
          <Typo className={completed ? classes.completedTask : undefined} noWrap>
            {data.task.title}
          </Typo>
        </ButtonBase>
        {modalIsOpen && <InfoModal closeModal={() => setModalIsOpen(false)} employee_task_id={data.id} modalIsOpen={modalIsOpen} />}
      </div>
      <div
        className={classes.avatarOnClick}
        onClick={() => router.push(`/ansatt/${data.employee.id}?år=${new Date(data.dueDate).getFullYear()}&prosess=${data.task.phase.processTemplate.slug}`)}>
        <Avatar className={classes.avatar} firstName={data.employee.firstName} image={data.employee.imageUrl} lastName={data.employee.lastName} />
        <Typo>{`${data.employee.firstName} ${data.employee.lastName}`}</Typo>
      </div>
      <div>{moment(data.dueDate).format('DD.MMM')}</div>
      <div>{data.task.phase.processTemplate.title}</div>
    </>
  );
};

export default TaskRow;
