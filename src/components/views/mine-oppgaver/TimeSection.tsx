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
  index: number;
};

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
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

const TimeSection = ({ section, index }: TimeSectionProps) => {
  const classes = useStyles();
  const DEFAULT_OPEN_SECTIONS = 3;
  const isDefaultOpen = index < DEFAULT_OPEN_SECTIONS;
  const [open, setOpen] = useState<boolean>(isDefaultOpen);
  const first = index === 0;
  if (!section) {
    return <></>;
  }
  return (
    <div className={classes.grid}>
      <div className={classes.centeringRow}>
        <Typo>
          <b style={section.error && { color: theme.palette.error.main }}>{section.title}</b>
          <span className={classes.disabled}>
            {section.title && section.date && ' - '}
            {section.date}
          </span>
        </Typo>
        <IconButton onClick={() => setOpen(!open)} size='small'>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </div>
      <Typo color='disabled' variant='body2'>
        {first && 'Gjelder'}
      </Typo>
      <Typo color='disabled' variant='body2'>
        {first && 'Ansvarlig'}
      </Typo>
      <Typo color='disabled' variant='body2'>
        {first && 'Forfallsdato'}
      </Typo>
      <Typo color='disabled' variant='body2'>
        {first && 'Prosess'}
      </Typo>
      {open && section.data.map((data) => <TaskRow data={data} key={data.id} />)}
      <Divider style={{ gridColumn: 'span 3' }} />
    </div>
  );
};

export default TimeSection;
