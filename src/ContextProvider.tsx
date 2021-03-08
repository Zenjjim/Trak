import { CssBaseline, ThemeProvider } from '@material-ui/core';
import Layout from 'components/Layout';
import { ProgressbarProvider } from 'context/Progressbar';
import { SnackbarProvider } from 'context/Snackbar';
import { UserProvider } from 'context/User';
import theme from 'theme';

const ContextProvider = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <ProgressbarProvider>
            <UserProvider>
              <CssBaseline />
              <Layout>{children}</Layout>
            </UserProvider>
          </ProgressbarProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
};

export default ContextProvider;
