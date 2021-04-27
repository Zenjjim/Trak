import { Divider, Hidden, IconButton } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import CenteringRow from 'components/CenteringRow';
import Typo from 'components/Typo';
import TaskRow from 'components/views/mine-oppgaver/TaskRow';
import { TimeSectionType } from 'pages/mine-oppgaver';
import { useState } from 'react';
import theme from 'theme';

/**
 * @typedef {object} TimeSectionProps
 * @property {TimeSectionType} section
 * @property {index} number
 */
export type TimeSectionProps = {
  section: TimeSectionType;
  index: number;
};

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridGap: theme.spacing(0.5),
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
    alignItems: 'end',
    marginBottom: theme.spacing(1),
    [theme.breakpoints.down('lg')]: {
      gridTemplateColumns: '2fr 1fr 1fr',
    },
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  span: {
    gridColumn: 'span 5',
    [theme.breakpoints.down('lg')]: {
      gridColumn: 'span 3',
    },
    [theme.breakpoints.down('md')]: {
      gridColumn: 'span 2',
    },
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
});

/**
 * Card to display tasks in a specific time-range
 * @param {TimeSectionProps} params
 * @returns TimeSection
 */
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
      <CenteringRow>
        <Typo>
          <b style={section.error && { color: theme.palette.error.main }}>{section.title}</b>
          <span className={classes.disabled}>
            {section.title && section.date && ' - '}
            {section.date}
          </span>
        </Typo>
        <IconButton
          aria-controls={`${section.title || section.date} oppgaver`}
          aria-expanded={open}
          aria-label={`${section.title || section.date} oppgaver`}
          onClick={() => setOpen(!open)}
          size='small'>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </CenteringRow>
      <Typo color='disabled' variant='body2'>
        {first && 'Gjelder'}
      </Typo>
      <Hidden lgDown>
        <Typo color='disabled' variant='body2'>
          {first && 'Ansvarlig'}
        </Typo>
      </Hidden>
      <Hidden mdDown>
        <Typo color='disabled' variant='body2'>
          {first && 'Forfallsdato'}
        </Typo>
      </Hidden>
      <Hidden lgDown>
        <Typo color='disabled' variant='body2'>
          {first && 'Prosess'}
        </Typo>
      </Hidden>
      {open && section.data.map((data) => <TaskRow data={data} key={data.id} />)}
      <Divider className={classes.span} />
    </div>
  );
};

export default TimeSection;
