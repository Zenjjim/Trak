import { CssBaseline, ThemeProvider } from '@material-ui/core';
import Layout from 'components/Layout';
import { DataProvider } from 'context/Data';
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
              <DataProvider>
                <CssBaseline />
                <Layout>{children}</Layout>
              </DataProvider>
            </UserProvider>
          </ProgressbarProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
};

export default ContextProvider;
