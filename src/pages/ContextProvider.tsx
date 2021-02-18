import { CssBaseline, ThemeProvider } from '@material-ui/core';
import Layout from 'components/Layout';
import { ProgressbarProvider } from 'context/Progressbar';
import { SnackbarProvider } from 'context/Snackbar';
import theme from 'theme';

const ContextProvider = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <ProgressbarProvider>
            <CssBaseline />
            <Layout>{children}</Layout>
          </ProgressbarProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
};

export default ContextProvider;
