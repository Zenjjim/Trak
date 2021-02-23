import { createContext, useContext } from 'react';
import useSWR, { responseInterface } from 'swr';
import { IEmployee, IProfession, ITag } from 'utils/types';
import { fetcher } from 'utils/utils';

const TaskModalContext = createContext(undefined);
function useTaskModal() {
  const context = useContext(TaskModalContext);
  if (!context) {
    throw new Error(`useTaskModal must be used within a TaskModalProvider`);
  }
  return context;
}
function TaskModalProvider(props) {
  const { data: professions }: responseInterface<IProfession[], unknown> = useSWR(`/api/professions`, fetcher);
  const { data: tags }: responseInterface<ITag[], unknown> = useSWR(`/api/tags`, fetcher);
  const { data: employees }: responseInterface<IEmployee[], unknown> = useSWR(`/api/employees`, fetcher);

  return <TaskModalContext.Provider value={{ professions: professions, tags: tags, employees: employees }} {...props} />;
}
export { TaskModalProvider, useTaskModal };
