import axios from 'axios';
import capitalize from 'capitalize-first-letter';
import Fuse from 'fuse.js';
import { compact, differenceBy } from 'lodash';
import moment from 'moment';
import { TimeSectionType } from 'pages/mine-oppgaver';
import { Dispatch, SetStateAction } from 'react';
import { thisMonth, thisWeek, today, tomorrow } from 'sortof';
import { IEmployeeTask } from 'utils/types';

moment.locale('nb');

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

export const splitIntoTimeSections = (tasks) => {
  const todaysDate = moment().startOf('day').toDate();
  const taskPast = tasks.filter((task) => moment(task.dueDate).isBefore(todaysDate));
  const withoutPast = differenceBy(tasks, taskPast, 'id');
  const taskToday = today(withoutPast, 'dueDate');
  const withoutToday = differenceBy(withoutPast, taskToday, 'id');
  const taskTomorrow = tomorrow(withoutToday, 'dueDate');
  const withoutTomorrow = differenceBy(withoutToday, taskTomorrow, 'id');
  const taskThisWeek = thisWeek(withoutTomorrow, 'dueDate');
  const withoutThisWeek = differenceBy(withoutTomorrow, taskThisWeek, 'id');
  const taskThisMonth = thisMonth(withoutThisWeek, 'dueDate');
  const withoutThisMonth = differenceBy(withoutThisWeek, taskThisMonth, 'id');
  const taskNextMonth = thisMonth(withoutThisMonth, 'dueDate', '', (moment().month() + 1) % 12);
  const taskNextNextMonth = thisMonth(withoutThisMonth, 'dueDate', '', (moment().month() + 2) % 12);
  const data = [
    taskPast.length && {
      title: 'Forfalt',
      data: taskPast,
      error: true,
      defaultOpen: true,
    },
    taskToday.length && {
      title: 'I dag',
      data: taskToday,
      date: moment(taskToday[0]?.dueDate).format('ddd d MMM'),
      defaultOpen: true,
    },
    taskTomorrow.length && {
      title: 'I morgen',
      data: taskTomorrow,
      date: moment(taskTomorrow[0]?.dueDate).format('ddd d MMM'),
      defaultOpen: true,
    },
    taskThisWeek.length && {
      title: 'Denne uken',
      data: taskThisWeek,
      date: `uke ${moment(taskThisWeek[0]?.dueDate).isoWeek()}`,
      defaultOpen: true,
    },
    taskThisMonth.length && {
      title: 'Denne måneden',
      data: taskThisMonth,
      date: capitalize(moment(taskThisMonth[0]?.dueDate).format('MMMM')),
    },
    taskNextMonth.length && {
      title: 'Neste måned',
      data: taskNextMonth,
      date: capitalize(moment(taskNextMonth[0]?.dueDate).format('MMMM')),
    },
    taskNextNextMonth.length && {
      data: taskNextNextMonth,
      date: capitalize(moment(taskNextNextMonth[0]?.dueDate).format('MMMM')),
    },
  ];
  return compact(data);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const searchEmployees = (text: string, phases: any) => {
  const searchOptions = {
    keys: ['firstName', 'lastName'],
    threshold: 0.5,
  };
  const filteredEmployees = phases.map((phase) => {
    if (!text) {
      return phase;
    }
    const fuse = new Fuse(phase.employees, searchOptions);
    return {
      ...phase,
      employees: fuse.search(text).map((item) => item.item),
    };
  });
  return filteredEmployees;
};

export const searchTask = (text: string, timeSections: TimeSectionType[]) => {
  const searchOptions = {
    keys: ['task.title', 'employee.searchName', 'employee.firstName', 'employee.lastName'],
    threshold: 0.3,
  };

  const result = timeSections.map((timeSection) => {
    if (!text) {
      return timeSection;
    }
    const modifiedSearchData = timeSection.data.map((section) => {
      return { ...section, employee: { ...section.employee, searchName: `${section.employee.firstName} ${section.employee.lastName}` } };
    });

    const fuse = new Fuse(modifiedSearchData, searchOptions);
    return {
      ...timeSection,
      data: fuse.search(text).map((item) => item.item),
    };
  });
  return result;
};
