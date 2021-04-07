import axios from 'axios';
import capitalize from 'capitalize-first-letter';
import Fuse from 'fuse.js';
import { compact, differenceBy } from 'lodash';
import moment from 'moment';
import { TimeSectionType } from 'pages/mine-oppgaver';
import qs from 'qs';
import { Dispatch, SetStateAction } from 'react';
import { thisMonth, thisWeek, today, tomorrow } from 'sortof';
import { IEmployee, IEmployeeExtended, IEmployeeTask, IPhaseWithEmployees, ITag } from 'utils/types';

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
    },
    taskToday.length && {
      title: 'I dag',
      data: taskToday,
      date: moment(taskToday[0]?.dueDate).format('ddd d MMM'),
    },
    taskTomorrow.length && {
      title: 'I morgen',
      data: taskTomorrow,
      date: moment(taskTomorrow[0]?.dueDate).format('ddd d MMM'),
    },
    taskThisWeek.length && {
      title: 'Denne uken',
      data: taskThisWeek,
      date: `uke ${moment(taskThisWeek[0]?.dueDate).isoWeek()}`,
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

type EmployeeFilter = {
  professions: string[];
};

export const searchEmployees = (text: string, phases: IPhaseWithEmployees[], withResponsible = false) => {
  const searchOptions = {
    keys: ['searchName', 'firstName', 'lastName', ...(withResponsible ? ['hrManager.searchName', 'hrManager.firstName', 'hrManager.lastName'] : [])],
    threshold: 0.3,
  };
  const filteredEmployees = phases.map((phase) => {
    if (!text) {
      return phase;
    }
    const modifiedSearchData = phase.employees.map((employee: IEmployee) => {
      return {
        ...employee,
        hrManager: { ...employee.hrManager, searchName: `${employee.hrManager.firstName} ${employee.hrManager.lastName}` },
        searchName: `${employee.firstName} ${employee.lastName}`,
      };
    });
    const fuse = new Fuse(modifiedSearchData, searchOptions);
    return {
      ...phase,
      employees: fuse.search(text).map((item) => item.item),
    };
  });
  return filteredEmployees;
};

export const searchTask = (text: string, timeSections: TimeSectionType[], withResponsible = false) => {
  const searchOptions = {
    keys: [
      'task.title',
      'employee.searchName',
      'employee.firstName',
      'employee.lastName',
      ...(withResponsible ? ['responsible.searchName', 'responsible.firstName', 'responsible.lastName'] : []),
    ],
    threshold: 0.3,
  };

  const result = timeSections.map((timeSection) => {
    if (!text) {
      return timeSection;
    }
    const modifiedSearchData = timeSection.data.map((section) => {
      return {
        ...section,
        responsible: { ...section.responsible, searchName: `${section.responsible.firstName} ${section.responsible.lastName}` },
        employee: { ...section.employee, searchName: `${section.employee.firstName} ${section.employee.lastName}` },
      };
    });

    const fuse = new Fuse(modifiedSearchData, searchOptions);
    return {
      ...timeSection,
      data: fuse.search(text).map((item) => item.item),
    };
  });
  return result;
};

const filterTasks = (taskFilters: TaskFilters, timeSections: TimeSectionType[]) => {
  const result = timeSections.map((timeSection) => {
    const tagsId = taskFilters.tags.map((element) => element.id);
    return {
      ...timeSection,
      data: timeSection.data.filter((data) => {
        const dataTagsId = data.task.tags.map((tag) => tag.id);
        if (taskFilters.processTemplates.length && taskFilters.tags.length) {
          const tasksInProcess = taskFilters.processTemplates.includes(data.task.phase.processTemplate.title);
          if (tasksInProcess) {
            return tagsId.some((tag) => dataTagsId.includes(tag));
          } else {
            return false;
          }
        }
        if (taskFilters.processTemplates.length && !taskFilters.tags.length) {
          return taskFilters.processTemplates.includes(data.task.phase.processTemplate.title);
        }
        if (!taskFilters.processTemplates.length && taskFilters.tags.length) {
          return tagsId.some((tag) => dataTagsId.includes(tag));
        }
      }),
    };
  });
  return result;
};

export type TaskFilters = {
  tags: ITag[];
  processTemplates: string[];
};

export const filterAndSearchTasks = (searchText: string, taskFilters: TaskFilters, timeSections: TimeSectionType[], withResponsible = false) => {
  const noSearchText = !searchText;
  const noFilters = !taskFilters.processTemplates.length && !taskFilters.tags.length;
  if (noFilters && noSearchText) {
    return timeSections;
  }

  if (noSearchText) {
    const result = filterTasks(taskFilters, timeSections);
    return result;
  } else if (noFilters) {
    const result = searchTask(searchText, timeSections, withResponsible);
    return result;
  } else {
    const filteredTasks = filterTasks(taskFilters, timeSections);
    const result = searchTask(searchText, filteredTasks, withResponsible);
    return result;
  }
};
// eslint-disable-next-line
const filterEmployees = (employeeFilter: EmployeeFilter, phases: IPhaseWithEmployees[]) => {
  const result = phases.map((phase) => {
    return { ...phase, employees: phase.employees.filter((employee: IEmployeeExtended) => employeeFilter.professions.includes(employee.profession.title)) };
  });
  return result;
};

export const filterAndSearchEmployees = (searchText: string, employeeFilters: EmployeeFilter, phases: IPhaseWithEmployees[], withResponsible = false) => {
  const noSearchText = !searchText;
  const noFilters = !employeeFilters.professions.length;

  if (noSearchText && noFilters) {
    return phases;
  }

  if (noSearchText) {
    const result = filterEmployees(employeeFilters, phases);
    return result;
  }
  if (noFilters) {
    const result = searchEmployees(searchText, phases, withResponsible);
    return result;
  }

  const filteredEmployees = filterEmployees(employeeFilters, phases);
  const result = searchEmployees(searchText, filteredEmployees, withResponsible);
  return result;
};

export const slackMessager = async (channel, text) => {
  try {
    await axios.post(
      'https://slack.com/api/chat.postMessage',
      qs.stringify({
        token: process.env.SLACK_TOKEN,
        channel: channel,
        text: text,
      }),
    );
  } catch (err) {
    // eslint-disable-next-line
    console.log(err);
  }
};
