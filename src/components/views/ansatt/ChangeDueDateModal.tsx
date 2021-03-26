import { Button } from '@material-ui/core';
import axios from 'axios';
import TextField from 'components/form/TextField';
import Modal from 'components/Modal';
import useProgressbar from 'context/Progressbar';
import useSnackbar from 'context/Snackbar';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Actions, IEmployeeTask } from 'utils/types';
import { axiosBuilder } from 'utils/utils';

type ChangeDueDateModalProps = {
  modalIsOpen: boolean;
  employeeTasks: IEmployeeTask[];
  closeModal: () => void;
};
const ChangeDueDateModal = ({ modalIsOpen, closeModal, employeeTasks }: ChangeDueDateModalProps) => {
  const { register, errors, handleSubmit } = useForm();
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const showProgressbar = useProgressbar();

  const axiosChangeDueDateModal = (axionsFunction: Promise<unknown>, text: string) => {
    axiosBuilder(axionsFunction, text, router, showProgressbar, showSnackbar, closeModal);
  };

  const buttonGroup = [
    <Button key='cancel' onClick={closeModal} type='button'>
      Avbryt
    </Button>,
    <Button key='update' type='submit'>
      Oppdater
    </Button>,
  ];

  const onSubmit = handleSubmit((formData) => {
    const data = {
      action: Actions.UpdateDueDate,
      dueDate: moment(formData.dueDate).toISOString(),
      employeeTasksId: employeeTasks.map((employeeTask: IEmployeeTask) => employeeTask.id),
    };
    axiosChangeDueDateModal(axios.patch('/api/employeeTask', data), 'Forfallsdato ble oppdatert');
  });

  return (
    <Modal buttonGroup={buttonGroup} header={'Endre forfallsdato'} onClose={closeModal} onSubmit={onSubmit} open={modalIsOpen}>
      <TextField
        defaultValue={moment(employeeTasks[0]?.dueDate).format('yyyy-MM-DD')}
        errors={errors}
        name='dueDate'
        register={register}
        rules={{ required: 'Du må skrive inn en gyldig dato' }}
        type='date'
      />
    </Modal>
  );
};

export default ChangeDueDateModal;
