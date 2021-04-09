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

const LogIn = () => {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Box className={classes.gutterBottom} display='flex' justifyContent='center'>
        <Image height={34} src={'/trak_logo.svg'} width={124} />
      </Box>
      <GoogleButton onClick={signIn} type='light' />
    </Paper>
  );
};

export default LogIn;
