import { createContext, useContext } from 'react';
import useSWR, { responseInterface } from 'swr';
import { IEmployee, IProfession, ITag } from 'utils/types';
import { fetcher } from 'utils/utils';

const DataContext = createContext(undefined);
function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error(`useData must be used within a DataProvider`);
  }
  return context;
}
function DataProvider(props) {
  const { data: professions }: responseInterface<IProfession[], unknown> = useSWR(`/api/professions`, fetcher);
  const { data: tags }: responseInterface<ITag[], unknown> = useSWR(`/api/tags`, fetcher);
  const { data: employees }: responseInterface<IEmployee[], unknown> = useSWR(`/api/employees`, fetcher);

  return <DataContext.Provider value={{ professions: professions, tags: tags, employees: employees }} {...props} />;
}
export { DataProvider, useData };
