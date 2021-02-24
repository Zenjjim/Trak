import { Box, Button, Chip, makeStyles } from '@material-ui/core';
import Modal from 'components/Modal';
import Typo from 'components/Typo';
import { EmployeeContext } from 'pages/ansatt/[id]';
import { useContext } from 'react';
import theme from 'theme';
import { IEmployeeTask } from 'utils/types';

const useStyles = makeStyles({
  chip: {
    marginRight: theme.spacing(1),
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
});

type InfoModalProps = {
  task: IEmployeeTask;
  modalIsOpen: boolean;
  closeModal: () => void;
};

const InfoModal = ({ task, modalIsOpen, closeModal }: InfoModalProps) => {
  const classes = useStyles();
  const { employee } = useContext(EmployeeContext);
  return (
    <Modal
      buttonGroup={[
        <Button key={'avbryt'} onClick={closeModal} type='button'>
          Avbryt
        </Button>,
      ]}
      header={task.task.title}
      onClose={closeModal}
      onSubmit={null}
      open={modalIsOpen}>
      <>
        <Typo variant='body1'>
          <b>Ansvarlig:</b> {task.responsible && `${task.responsible.firstName} ${task.responsible.lastName}`}
        </Typo>
        <Typo variant='body1'>
          <b>Gjelder:</b> {employee.firstName} {employee.lastName}
        </Typo>
        <Typo className={classes.gutterBottom} variant='body1'>
          <b>Prosess:</b> {task.task.phase.title}
        </Typo>
        <Box className={classes.gutterBottom}>
          {task.task.tags.map((tag) => {
            return <Chip className={classes.chip} color='primary' key={tag.id} label={tag.title} size='small' />;
          })}
        </Box>

        <Typo variant='body2'>{task.task.description}</Typo>
      </>
    </Modal>
  );
};

export default InfoModal;
