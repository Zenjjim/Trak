import { useSession } from 'next-auth/client';
import { createContext, useContext } from 'react';
import useSWR, { responseInterface } from 'swr';
import { IEmployee, IProcessTemplate, IProfession, ITag } from 'utils/types';
import { fetcher } from 'utils/utils';

const DataContext = createContext(undefined);
/**
 * hook to get the DataContext
 * @returns DataContext
 */
function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error(`useData must be used within a DataProvider`);
  }
  return context;
}
/**
 * Provider for miscellaneous data from the database
 * @param props
 * @returns DataContext Provider
 */
function DataProvider(props) {
  const [session] = useSession();

  const { data: professions }: responseInterface<IProfession[], unknown> = useSWR(session?.user ? `/api/professions` : null, fetcher);
  const { data: tags }: responseInterface<ITag[], unknown> = useSWR(session?.user ? `/api/tags` : null, fetcher);
  const { data: employees }: responseInterface<IEmployee[], unknown> = useSWR(session?.user ? `/api/employees` : null, fetcher);
  const { data: processTemplates }: responseInterface<IProcessTemplate[], unknown> = useSWR(session?.user ? `/api/processTemplates` : null, fetcher);
  return <DataContext.Provider value={{ professions: professions, tags: tags, employees: employees, processTemplates: processTemplates }} {...props} />;
}
export { DataProvider, useData };
