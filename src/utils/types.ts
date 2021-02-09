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
  professions?: IProfession[];
  tags?: ITag[];
};

export type IEmployee = {
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
  // TODO
  // Do something else than this
  employeesTask: undefined;
};
