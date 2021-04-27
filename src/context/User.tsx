import { useSession } from 'next-auth/client';
import { createContext, useContext } from 'react';
import useSWR, { responseInterface } from 'swr';
import { IEmployee } from 'utils/types';
import { fetcher } from 'utils/utils';

const UserContext = createContext(undefined);
/**
 * Hook for accessing the userContext
 * @returns UserContext
 */
function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
}

/**
 * UserProvider for the current user
 * @param props
 * @returns UserProvider
 */
function UserProvider(props) {
  const [session] = useSession();
  const { data: user }: responseInterface<IEmployee, unknown> = useSWR(session?.user ? `/api/employee/${session?.user?.id}` : null, fetcher);

  return <UserContext.Provider value={{ user: user }} {...props} />;
}
export { UserProvider, useUser };
