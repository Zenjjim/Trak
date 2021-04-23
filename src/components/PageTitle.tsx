import { makeStyles } from '@material-ui/core';
import classNames from 'classnames';
import Typo from 'components/Typo';
import theme from 'theme';
export type PageTitleProps = {
  title: string;
  subtitle?: string;
};

const useStyles = makeStyles({
  title: {
    lineHeight: 0.7,
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
});

const PageTitle = ({ title, subtitle }: PageTitleProps) => {
  const classes = useStyles();
  return (
    <div>
      <Typo className={classNames(classes.title, classes.gutterBottom)} variant='h1'>
        {title}
      </Typo>
      <Typo variant='h2'>{subtitle}</Typo>
    </div>
  );
};

export default PageTitle;
