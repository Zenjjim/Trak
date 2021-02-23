import { IconButton, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import Typo from 'components/Typo';
import PhaseTable from 'components/views/prosessmal/PhaseTable';
import { useState } from 'react';
import { IPhase, IProcessTemplate } from 'utils/types';

import PhaseModal from './PhaseModal';

type PhaseProps = {
  phase: IPhase;
  processTemplate: IProcessTemplate;
};

const useStyles = makeStyles({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
});

const Phase = ({ phase, processTemplate }: PhaseProps) => {
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div className={classes.flexCenter}>
        <Typo variant='h2'>{phase.title}</Typo>
        <IconButton aria-label='edit' onClick={() => setModalIsOpen(true)}>
          <Edit />
        </IconButton>
        {modalIsOpen && <PhaseModal closeModal={() => setModalIsOpen(false)} modalIsOpen={modalIsOpen} phase_id={phase.id} processTemplate={processTemplate} />}
      </div>
      <PhaseTable phase={phase} />
    </div>
  );
};

export default Phase;
