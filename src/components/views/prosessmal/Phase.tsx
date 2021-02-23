import { IconButton, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import Typo from 'components/Typo';
import PhaseTable from 'components/views/prosessmal/PhaseTable';
import { IPhase } from 'utils/types';

type PhaseProps = {
  phase: IPhase;
};

const useStyles = makeStyles({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
});

const Phase = ({ phase }: PhaseProps) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.flexCenter}>
        <Typo variant='h2'>{phase.title}</Typo>
        <IconButton aria-label='edit'>
          <Edit />
        </IconButton>
      </div>
      <PhaseTable phase={phase} />
    </div>
  );
};

export default Phase;
