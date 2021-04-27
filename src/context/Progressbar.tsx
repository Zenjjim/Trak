import { CircularProgress, makeStyles, Snackbar, Theme } from '@material-ui/core';
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  snackbar: {
    [theme.breakpoints.down('sm')]: {
      left: theme.spacing(1),
      right: theme.spacing(1),
      bottom: theme.spacing(1),
      transform: 'none',
    },
  },
}));

type ProgressbarProps = (loading: boolean) => void;

const ProgressbarContext = createContext<ProgressbarProps | undefined>(undefined);

/**
 * Provider for Progessbar
 * @param {ReactNode} children
 * @returns ProgressbarProvider
 */
const ProgressbarProvider = ({ children }: { children: ReactNode }) => {
  const classes = useStyles();
  const [progressbarLoading, setProgressbarLoading] = useState(false);

  const showProgressbar = useCallback((loading) => {
    setProgressbarLoading(loading);
  }, []);

  const value = useMemo(() => showProgressbar, [showProgressbar]);

  return (
    <ProgressbarContext.Provider value={value}>
      {children}
      <Snackbar className={classes.snackbar} open={progressbarLoading}>
        <CircularProgress />
      </Snackbar>
    </ProgressbarContext.Provider>
  );
};

/**
 * Hook to access the progressbar context
 * @returns
 */
const useProgressbar = () => {
  const context = useContext(ProgressbarContext);
  if (context === undefined) {
    throw new Error('useProgressbar must be used within a ProgressbarProvider');
  }
  return context;
};

export default useProgressbar;
export { ProgressbarProvider, useProgressbar };
