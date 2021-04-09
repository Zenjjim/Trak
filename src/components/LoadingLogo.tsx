import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Image from 'next/image';
import theme from 'theme';

const useStyles = makeStyles({
  root: {
    transform: 'translate(-50%,-50%)',
    left: '50%',
    position: 'absolute',
    top: '50%',
  },
  animateLogo: {
    animation: `$pulse 1500ms ${theme.transitions.easing.easeIn} infinite`,
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(0.9)',
    },
    '50%': {
      transform: 'scale(1)',
    },
    '100%': {
      transform: 'scale(0.9)',
    },
  },
});

const LoadingLogo = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Image className={classes.animateLogo} height={80} priority src='/trak_logo.svg' width={240} />
    </Box>
  );
};

export default LoadingLogo;
