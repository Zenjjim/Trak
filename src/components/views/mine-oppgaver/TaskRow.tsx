import { ButtonBase, Checkbox, Hidden, IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { Launch, Mail } from '@material-ui/icons';
import Avatar from 'components/Avatar';
import CenteringRow from 'components/CenteringRow';
import InfoModal from 'components/InfoModal';
import Typo from 'components/Typo';
import useSnackbar from 'context/Snackbar';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useState } from 'react';
import theme from 'theme';
import { IEmployeeTask, Process } from 'utils/types';
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
  avatarRoot: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'start',
  },
  onClick: {
    width: 'max-content',
    borderRadius: '4px',
    '&:hover': {
      cursor: 'pointer',
      background: theme.palette.text.secondary,
    },
  },
  textButton: {
    textTransform: 'none',
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.text.primary,
    whiteSpace: 'nowrap',
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
      <CenteringRow>
        <Checkbox
          checked={completed}
          color='primary'
          inputProps={{ 'aria-label': `Marker oppgave som ${completed ? 'ikke' : ''} fullført` }}
          onClick={() => toggleCheckBox(data, completed, setCompleted, showSnackbar)}
        />
        <ButtonBase className={classes.textButton} focusRipple onClick={() => setModalIsOpen(true)}>
          <Typo className={completed ? classes.completedTask : undefined} noWrap style={{ maxWidth: '50vw' }}>
            {data.task.title}
          </Typo>
        </ButtonBase>
        {data.task.link && (
          <Tooltip title={data.task.link}>
            <a href={`${validator.isEmail(data.task.link) ? 'mailto:' : ''}${data.task.link}`} rel='noopener noreferrer' target='_blank'>
              <IconButton disableFocusRipple size='small'>
                {validator.isEmail(data.task.link) ? <Mail /> : <Launch />}
              </IconButton>
            </a>
          </Tooltip>
        )}
        {modalIsOpen && <InfoModal closeModal={() => setModalIsOpen(false)} employee_task_id={data.id} modalIsOpen={modalIsOpen} />}
      </CenteringRow>
      <ButtonBase
        className={classes.avatarRoot}
        focusRipple
        onClick={() =>
          router.push(
            `/ansatt/${data.employee.id}?${data.task.phase.processTemplate.slug === Process.LOPENDE ? `år=${new Date().getFullYear()}&` : ''}prosess=${
              data.task.phase.processTemplate.slug
            }`,
          )
        }>
        <Avatar className={classes.avatar} firstName={data.employee.firstName} image={data.employee.imageUrl} lastName={data.employee.lastName} />
        <Typo noWrap>{`${data.employee.firstName} ${data.employee.lastName[0]}.`}</Typo>
      </ButtonBase>
      <Hidden lgDown>
        <div className={classes.avatarRoot}>
          <Avatar className={classes.avatar} firstName={data.responsible.firstName} image={data.responsible.imageUrl} lastName={data.responsible.lastName} />
          <Typo noWrap>{`${data.responsible.firstName} ${data.responsible.lastName[0]}.`}</Typo>
        </div>
      </Hidden>
      <Hidden mdDown>
        <div>{moment(data.dueDate).format('DD.MMM')}</div>
      </Hidden>
      <Hidden lgDown>
        <div>{data.task.phase.processTemplate.title}</div>
      </Hidden>
    </>
  );
};

export default TaskRow;
