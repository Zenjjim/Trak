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
  slack?: string;
  profession: IProfession;
  hrManager: IEmployee;
  employees: IEmployee[];
  employeeTask: IEmployeeTask[];
};

export type IEmployeeTask = {
  id: string;
  task?: ITask;
  taskId?: string;
  employee?: IEmployee;
  completed: boolean;
  responsible?: IEmployee;
  employeeId?: number;
  responsibleId?: number;
  year: Date;
};

export type IPhase = {
  id: string;
  title: string;
  processTemplateId: string;
  tasks?: ITask[];
};

export type IProcessTemplate = {
  id: string;
  title: string;
  slug: string;
  phases?: IPhase[];
};

export type IProfession = {
  id: string;
  title: string;
  tasks?: ITask[];
};

export type ITag = {
  id: string;
  title: string;
  tasks?: ITask[];
};

export type ITask = {
  id: string;
  title: string;
  description: string;
  global: boolean;
  phaseId: string;
  phase: IPhase;
  professions?: IProfession[];
  tags?: ITag[];
  employeeTask: IEmployeeTask[];
  responsible?: IEmployee;
};
