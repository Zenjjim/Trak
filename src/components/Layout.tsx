import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import LogIn from 'components/LogIn';
import Sidebar from 'components/Sidebar';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useEffect } from 'react';
import theme from 'theme';
import urls from 'URLS';

const useStyles = makeStyles({
  center: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%,-50%)',
  },
  root: {
    marginLeft: '30px',
    marginRight: '30px',
    marginTop: '60px',
    [theme.breakpoints.down('md')]: {
      marginLeft: '10px',
    },
  },
});

type LayoutProps = {
  children: JSX.Element;
};

const Layout = ({ children }: LayoutProps) => {
  const classes = useStyles();
  const [session, loading] = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      if (session?.user) {
        if (router.pathname === '/' || router.pathname === '/#') {
          router.push(urls[0].links[0].link);
        }
      } else {
        router.push('/');
      }
    }
  }, [loading, session?.user]);
  return (
    <>
      {session?.user ? (
        <Box display='flex'>
          <Sidebar />
          <Box className={classes.root} flexGrow={1}>
            {children}
          </Box>
        </Box>
      ) : (
        <Box className={classes.center} display='flex' justifyContent='center'>
          <LogIn />
        </Box>
      )}
    </>
  );
};

export default Layout;
