import axios from 'axios';
import { Dispatch, SetStateAction } from 'react';
import { IEmployeeTask } from 'utils/types';

export const fetcher = (url) => fetch(url).then((res) => res.json());

export const axiosBuilder = (axiosFunc: Promise<unknown>, text: string, router, showProgressbar, showSnackbar, closeModal) => {
  showProgressbar(true);
  axiosFunc
    .then(() => {
      closeModal();
      router.replace(router.asPath).finally(() => {
        showProgressbar(false);
        showSnackbar(text, 'success');
      });
    })
    .catch((error) => {
      showProgressbar(false);
      showSnackbar(error.response.data.message, 'error');
    });
};

export const toggleCheckBox = (
  employeeTask: IEmployeeTask,
  completed: boolean,
  setCompleted: Dispatch<SetStateAction<boolean>>,
  showSnackbar: (arg0: string, arg1: string) => void,
) => {
  axios
    .put(`/api/employeeTasks/${employeeTask.id}`, {
      completed: !completed,
      dueDate: employeeTask.dueDate,
      responsibleId: employeeTask.responsible.id,
    })
    .then(() => {
      showSnackbar(`Oppgave markert som ${completed ? 'ikke' : ''} fullført`, 'success');
      setCompleted(!completed);
    })
    .catch((error) => {
      showSnackbar(error.response.data?.message, 'error');
    });
};

export const addDays = (date: Date, days: number) => {
  const copy = new Date(Number(date));
  copy.setDate(date.getDate() + days);
  return copy;
};
