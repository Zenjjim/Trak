import { Divider, IconButton } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';
import TaskRow from 'components/views/mine-oppgaver/TaskRow';
import { TimeSectionType } from 'pages/mine-oppgaver';
import { useState } from 'react';
import theme from 'theme';

type TimeSectionProps = {
  section: TimeSectionType;
  first: boolean;
};

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    alignItems: 'end',
    marginRight: '30px',
    marginBottom: theme.spacing(1),
  },
  centeringRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
});

const TimeSection = ({ section, first }: TimeSectionProps) => {
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(true);
  if (!section) {
    return <></>;
  }
  return (
    <div className={classes.grid}>
      <div className={classes.centeringRow}>
        <Typo>
          <b>{section.title}</b>
          <span className={classes.disabled}>
            {section.title && ' - '}
            {section.date}
          </span>
        </Typo>
        <IconButton onClick={() => setOpen(!open)} size='small'>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>
      <Typo color='disabled' variant='body2'>
        {first && 'Prosess'}
      </Typo>
      <Typo color='disabled' variant='body2'>
        {first && 'Gjelder'}
      </Typo>
      {open && section.data.map((data) => <TaskRow data={data} key={data.id} />)}
      <Divider style={{ gridColumn: 'span 3' }} />
    </div>
  );
};

export default TimeSection;
