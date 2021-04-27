/**
 * @typedef {object} IEmployee
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string?} title
 * @property {string} email
 * @property {Date} birthDate
 * @property {Date?} dateOfEmployment
 * @property {Date?} terminationDate
 * @property {string?} imageUrl
 * @property {IProfession} profession
 * @property {IEmployee} hrManager
 * @property {number?} hrManagerId
 * @property {numberDate} activeYear
 * @property {IEmployee[]} employees
 * @property {IEmployeeSettings} employeeSettings
 * @property {IEmployeeTask[]} employeeTask
 * @property {INotification[]} notifications
 */
export type IEmployee = {
  id: number;
  firstName: string;
  lastName: string;
  title?: string;
  email: string;
  birthDate: Date;
  dateOfEmployment?: Date;
  terminationDate?: Date;
  imageUrl?: string;
  profession: IProfession;
  hrManager: IEmployee;
  hrManagerId?: number;
  employees: IEmployee[];
  employeeSettings: IEmployeeSettings;
  employeeTask: IEmployeeTask[];
  notifications?: INotification[];
};
/**
 * @typedef {object} IEmployeeSettings
 * @property {number?} employeeId
 * @property {string?} slack
 * @property {('DELEGATE' | 'DEADLINE' | 'WEEK_BEFORE_DEADLINE' | 'TERMINATION' | 'HIRED')[]} notificationSettings
 */
export type IEmployeeSettings = {
  employeeId?: number;
  slack?: string;
  notificationSettings: ('DELEGATE' | 'DEADLINE' | 'WEEK_BEFORE_DEADLINE' | 'TERMINATION' | 'HIRED')[];
};
/** @enum {string} */
export enum NotificationType {
  DELEGATE = 'jeg blir delegert en oppgave',
  DEADLINE = 'en fase utløper',
  WEEK_BEFORE_DEADLINE = 'en fase utløper om en uke',
  TERMINATION = 'en av mine ansatte skal slutte',
  HIRED = 'jeg får ansvaret for en ny ansatt',
}

/** @enum {string} */
export enum NotificationTypeEnum {
  DELEGATE = 'DELEGATE',
  DEADLINE = 'DEADLINE',
  WEEK_BEFORE_DEADLINE = 'WEEK_BEFORE_DEADLINE',
  TERMINATION = 'TERMINATION',
  HIRED = 'HIRED',
}
/**
 * @typedef {object} IEmployeeTask
 * @property {string} id
 * @property {boolean} completed
 * @property {ITask?} task
 * @property {string?} taskId
 * @property {IEmployee?} employee
 * @property {number?} employeeId
 * @property {IEmployee?} responsible
 * @property {number?} responsibleId
 * @property {Date} dueDate
 */
export type IEmployeeTask = {
  id: string;
  completed: boolean;
  task?: ITask;
  taskId?: string;
  employee?: IEmployee;
  responsible?: IEmployee;
  employeeId?: number;
  responsibleId?: number;
  dueDate: Date;
  completedBy?: IEmployee;
  completedById?: number;
  completedDate?: Date;
};
/**
 * @typedef {object} INotification
 * @property {string} id
 * @property {number} employeeId
 * @property {Date} createdAt
 * @property {boolean} read
 * @property {string} description
 * @property {IEmployee} employee
 */
export type INotification = {
  id: string;
  employeeId: number;
  createdAt: Date;
  read: boolean;
  description: string;
  employee: IEmployee;
};
/**
 * @typedef {object} IPhase
 * @property {string} id
 * @property {string} title
 * @property {IProcessTemplate?} processTemplate
 * @property {ITask[]?} tasks
 * @property {Date?} dueDate
 * @property {number?} dueDateDayOffset
 */
export type IPhase = {
  id: string;
  title: string;
  processTemplateId: string;
  processTemplate?: IProcessTemplate;
  tasks?: ITask[];
  dueDate?: Date;
  dueDateDayOffset?: number;
};
/**
 * @typedef {object} IProcessTemplate
 * @property {string} id
 * @property {string} title
 * @property {string} slug
 * @property {IPhase[]?} phases
 */
export type IProcessTemplate = {
  id: string;
  title: string;
  slug: string;
  phases?: IPhase[];
};
/**
 * @typedef {object} IProfession
 * @property {string} id
 * @property {string} title
 * @property {ITask[]?} tasks
 */
export type IProfession = {
  id: string;
  title: string;
  tasks?: ITask[];
};
/**
 * @typedef {object} ITag
 * @property {string} id
 * @property {string} title
 * @property {ITask[]?} tasks
 */
export type ITag = {
  id: string;
  title: string;
  tasks?: ITask[];
};
/**
 * @typedef {object} ITag
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string?} link
 * @property {boolean} global
 * @property {string} phaseId
 * @property {IPhase} phase
 * @property {IProfession[]?} professions
 * @property {ITag[]?} tags
 * @property {IEmployeeTask[]} employeeTask
 * @property {IEmployee?} responsible
 * @property {number?} responsibleId
 */
export type ITask = {
  id: string;
  title: string;
  description: string;
  link?: string;
  global: boolean;
  phaseId: string;
  phase: IPhase;
  professions?: IProfession[];
  tags?: ITag[];
  employeeTask: IEmployeeTask[];
  responsible?: IEmployee;
  responsibleId?: number;
};

/** @enum {string} */
export enum Offset {
  Before = 'before',
  After = 'after',
}

/** @enum {string} */
export enum Actions {
  UpdateDueDate = 'updateDueDate',
}

/** @enum {string} */
export enum Process {
  ONBOARDING = 'onboarding',
  LOPENDE = 'lopende',
  OFFBOARDING = 'offboarding',
}

export type IEmployeeExtended = IEmployee & { tasksFinished: number; totalTasks: number };
/**
 * @typedef {object} ITag
 * @property {string} id
 * @property {string} title
 * @property {IEmployeeExtended[]} employees
 */
export type IPhaseWithEmployees = {
  id: string;
  title: string;
  employees: IEmployeeExtended[];
};
