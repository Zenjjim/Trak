import { Box, ButtonBase, makeStyles, Table, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import classNames from 'classnames';
import Typo from 'components/Typo';
import UserRow from 'components/views/mine-ansatte/UserRow';
import { EmployeeRow } from 'components/views/mine-ansatte/UserRow';
import React, { useState } from 'react';

const useStyles = makeStyles({
  centeringRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointer: {
    cursor: 'pointer',
  },
});

export type PhaseCardProps = {
  id: string;
  title: string;
  amount: number;
  employees: EmployeeRow[];
  slug: string;
};
const PhaseCard = ({ title, amount, employees, slug }: PhaseCardProps) => {
  const classes = useStyles();
  const [hidden, setIsHidden] = useState(!employees.length);
  return (
    <>
      <ButtonBase focusRipple onClick={() => setIsHidden(!hidden)}>
        <div className={classNames(classes.centeringRow, classes.pointer)}>
          <Typo variant='h2'>
            {title} (<b>{amount}</b>)
          </Typo>
          {hidden ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </div>
      </ButtonBase>
      <Box display={hidden ? 'none' : 'block'}>
        {employees.length > 0 ? (
          <Table aria-label='Mine ansatte tabell'>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '37.5rem' }}>Navn</TableCell>
                <TableCell style={{ width: '18.75rem' }}>Oppgaver gjennomført</TableCell>
                <TableCell style={{ width: '18.75rem' }}>Stilling</TableCell>
                <TableCell style={{ width: '18.75rem' }}>Ansvarlig</TableCell>
              </TableRow>
            </TableHead>
            {employees.map((employee) => {
              return <UserRow employee={employee} key={employee.id} slug={slug} />;
            })}
          </Table>
        ) : (
          <Typo variant='body2'>Ingen ansatte i denne fasen</Typo>
        )}
      </Box>
    </>
  );
};

export default PhaseCard;
