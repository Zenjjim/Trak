import { Avatar, IconButton, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import AddButton from 'components/AddButton';
import { useState } from 'react';
import { IEmployee, IPhase, IProfession, ITag, ITask } from 'utils/types';

import CreateTaskModal from './CreateTaskModal';

type TemplateTableProps = {
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

const TemplateTable = ({ phase, professions, tags, employees }: TemplateTableProps) => {
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
          <TableRow className={classes.hideLastBorder} key={task.id}>
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>
              {task.responsible && (
                <div className={classes.flexCenter}>
                  <Avatar className={classes.avatarSize} src={task.responsible.imageUrl}>
                    X
                  </Avatar>
                  {`${task.responsible.firstName} ${task.responsible.lastName}`}
                </div>
              )}
            </TableCell>
            <TableCell>
              <IconButton aria-label='edit'>
                <Edit />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
        <TableRow className={classes.hideLastBorder}>
          <TableCell>
            <AddButton onClick={() => setModalIsOpen(true)} text='Legg til oppgave' />
            <CreateTaskModal
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

export default TemplateTable;
