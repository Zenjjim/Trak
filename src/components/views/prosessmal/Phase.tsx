import { IconButton, makeStyles } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import Typo from 'components/Typo';
import { IEmployee, IPhase, IProfession, ITag } from 'utils/types';

import TemplateTable from './TemplateTable';

type PhaseProps = {
  phase: IPhase;
  professions: IProfession[];
  employees: IEmployee[];
  tags: ITag[];
};

const useStyles = makeStyles({
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
});

const Phase = ({ phase, professions, employees, tags }: PhaseProps) => {
  const classes = useStyles();
  return (
    <div>
      <div className={classes.flexCenter}>
        <Typo variant='h2'>{phase.title}</Typo>
        <IconButton aria-label='edit'>
          <Edit />
        </IconButton>
      </div>
      <TemplateTable employees={employees} phase={phase} professions={professions} tags={tags} />
    </div>
  );
};

export default Phase;
