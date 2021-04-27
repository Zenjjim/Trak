import { IconButton, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import Typo from 'components/Typo';
import PhaseModal from 'components/views/prosessmal/PhaseModal';
import PhaseTable from 'components/views/prosessmal/PhaseTable';
import { useState } from 'react';
import { IPhase, IProcessTemplate } from 'utils/types';

/**
 * @typedef {object} PhaseProps
 * @property {IPhase} phase
 * @property {IProcessTemplate} processTemplate
 */
export type PhaseProps = {
  phase: IPhase;
  processTemplate: IProcessTemplate;
};

const useStyles = makeStyles({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
});

/**
 * Display a specific phase in a processTemplate
 * @param {PhaseProps} params
 * @returns Phase
 */
const Phase = ({ phase, processTemplate }: PhaseProps) => {
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  return (
    <div>
      <div className={classes.flexCenter}>
        <Typo variant='body1'>{phase.title}</Typo>
        <IconButton aria-label={`Endre fase ${phase.title}`} onClick={() => setModalIsOpen(true)}>
          <Edit />
        </IconButton>
        {modalIsOpen && <PhaseModal closeModal={() => setModalIsOpen(false)} modalIsOpen={modalIsOpen} phase_id={phase.id} processTemplate={processTemplate} />}
      </div>
      <PhaseTable phase={phase} />
    </div>
  );
};

export default Phase;
