import { Box, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Image from 'next/image';
import { signIn } from 'next-auth/client';
import GoogleButton from 'react-google-button';
import theme from 'theme';
const useStyles = makeStyles({
  root: {
    marginTop: theme.spacing(2),
    padding: `${theme.spacing(12)} ${theme.spacing(8)}`,
    display: 'flex',
    flexDirection: 'column',
  },
  gutterBottom: {
    marginBottom: theme.spacing(4),
  },
});

/**
 * Card to use for log in
 * @returns LogIN
 */
const LogIn = () => {
  const classes = useStyles();

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      signIn();
    }
  };

  return (
    <Paper className={classes.root}>
      <Box className={classes.gutterBottom} display='flex' justifyContent='center'>
        <Image height={34} src={'/trak_logo.svg'} width={124} />
      </Box>
      <GoogleButton label='Logg inn med Google' onClick={() => signIn()} onKeyDown={(e) => handleKeyDown(e)} type='light' />
    </Paper>
  );
};

export default LogIn;
