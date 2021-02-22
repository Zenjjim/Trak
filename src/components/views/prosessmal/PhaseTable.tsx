import { makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import AddButton from 'components/AddButton';
import TaskRow from 'components/views/prosessmal//TaskRow';
import TaskModal from 'components/views/prosessmal/TaskModal';
import { useState } from 'react';
import { IEmployee, IPhase, IProfession, ITag, ITask } from 'utils/types';

type PhaseTableProps = {
  phase: IPhase;
  professions: IProfession[];
  employees: IEmployee[];
  tags: ITag[];
};

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  hideLastBorder: {
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  },
  headerCell: {
    color: theme.palette.text.disabled,
    paddingBottom: 0,
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  avatarSize: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: theme.spacing(1),
  },
}));

const PhaseTable = ({ phase, professions, tags, employees }: PhaseTableProps) => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const classes = useStyles();
  return (
    <Table aria-label='Prosessmal tabel' className={classes.table}>
      <TableHead>
        <TableRow>
          <TableCell className={classes.headerCell} size='small'>
            Tittel
          </TableCell>
          <TableCell className={classes.headerCell} size='small'>
            Beskrivelse
          </TableCell>
          <TableCell className={classes.headerCell} size='small'>
            Ansvarlig
          </TableCell>
          <TableCell className={classes.headerCell} size='small'></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {phase.tasks.map((task: ITask) => (
          <TaskRow employees={employees} key={task.id} phase={phase} professions={professions} tags={tags} task={task} />
        ))}
        <TableRow className={classes.hideLastBorder}>
          <TableCell>
            <AddButton
              onClick={() => {
                setModalIsOpen(true);
              }}
              text='Legg til oppgave'
            />
            <TaskModal
              closeModal={() => setModalIsOpen(false)}
              employees={employees}
              modalIsOpen={modalIsOpen}
              phase={phase}
              professions={professions}
              tags={tags}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default PhaseTable;
