import { useSession } from 'next-auth/client';
import { createContext, useContext } from 'react';
import useSWR, { responseInterface } from 'swr';
import { IEmployee } from 'utils/types';
import { fetcher } from 'utils/utils';

const UserContext = createContext(undefined);
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
}
function UserProvider(props) {
  const [session] = useSession();
  const { data: user }: responseInterface<IEmployee, unknown> = useSWR(`/api/employee/${session?.user?.id}`, fetcher);

  return <UserContext.Provider value={{ user: user }} {...props} />;
}
export { UserProvider, useUser };
