import { CssBaseline, ThemeProvider } from '@material-ui/core';
import Layout from 'components/Layout';
import { DataProvider } from 'context/Data';
import { ProgressbarProvider } from 'context/Progressbar';
import { SnackbarProvider } from 'context/Snackbar';
import { UserProvider } from 'context/User';
import { Provider } from 'next-auth/client';
import theme from 'theme';
const ContextProvider = ({ children, pageProps }) => {
  return (
    <>
      <Provider session={pageProps.session}>
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
      </Provider>
    </>
  );
};

export default ContextProvider;
