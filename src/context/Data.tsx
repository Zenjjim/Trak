import { useSession } from 'next-auth/client';
import { createContext, useContext } from 'react';
import useSWR, { responseInterface } from 'swr';
import { IEmployee, IProcessTemplate, IProfession, ITag } from 'utils/types';
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
  const [session] = useSession();

  const { data: professions }: responseInterface<IProfession[], unknown> | { data: undefined } = session?.user
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useSWR(`/api/professions`, fetcher)
    : { data: undefined };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: tags }: responseInterface<ITag[], unknown> | { data: undefined } = session?.user ? useSWR(`/api/tags`, fetcher) : { data: undefined };
  const { data: employees }: responseInterface<IEmployee[], unknown> | { data: undefined } = session?.user
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useSWR(`/api/employees`, fetcher)
    : { data: undefined };
  const { data: processTemplates }: responseInterface<IProcessTemplate[], unknown> | { data: undefined } = session?.user
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useSWR(`/api/processTemplates`, fetcher)
    : { data: undefined };
  return <DataContext.Provider value={{ professions: professions, tags: tags, employees: employees, processTemplates: processTemplates }} {...props} />;
}
export { DataProvider, useData };
