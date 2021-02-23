import { Chip, makeStyles } from '@material-ui/core';
import Modal from 'components/Modal';
import Typo from 'components/Typo';
import theme from 'theme';
import { IEmployee, IEmployeeTask } from 'utils/types';

const useStyles = makeStyles({
  chip: {
    marginRight: theme.spacing(1),
  },
});

type InfoModalProps = {
  employee: IEmployee;
  task: IEmployeeTask;
  modalIsOpen: boolean;
  closeModal: () => void;
};

const InfoModal = ({ employee, task, modalIsOpen, closeModal }: InfoModalProps) => {
  const classes = useStyles();
  return (
    <Modal buttonGroup={[]} header={task.task.title} onClose={closeModal} onSubmit={null} open={modalIsOpen}>
      <>
        <Typo variant='body2'>
          <b>Ansvarlig:</b> {task.responsible && `${task.responsible.firstName} ${task.responsible.lastName}`}
        </Typo>
        <Typo variant='body2'>
          <b>Gjelder:</b> {employee.firstName} {employee.lastName}
        </Typo>
        <Typo variant='body2'>
          <b>Prosess:</b> {task.task.phase.title}
        </Typo>
        {task.task.tags.map((tag) => {
          return <Chip className={classes.chip} color='primary' key={tag.id} label={tag.title} />;
        })}
        <Typo variant='body2'>{task.task.description}</Typo>
      </>
    </Modal>
  );
};

export default InfoModal;
