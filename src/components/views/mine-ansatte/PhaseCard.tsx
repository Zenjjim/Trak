import { Box, ButtonBase, Hidden, makeStyles, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@material-ui/icons';
import CenteringRow from 'components/CenteringRow';
import Typo from 'components/Typo';
import UserRow from 'components/views/mine-ansatte/UserRow';
import { EmployeeRow } from 'components/views/mine-ansatte/UserRow';
import React, { useState } from 'react';

const useStyles = makeStyles({
  pointer: {
    cursor: 'pointer',
  },
});

/**
 * @typedef {object} PhaseCardProps
 * @property {string} id
 * @property {string} title
 * @property {number} amount
 * @property {EmployeeRow} employees
 * @property {string} slug
 */
export type PhaseCardProps = {
  id: string;
  title: string;
  amount: number;
  employees: EmployeeRow[];
  slug: string;
};

/**
 * Card to display all employees in a specific phase
 * @param {PhaseCardProps} params
 * @returns PhaseCard
 */
const PhaseCard = ({ title, amount, employees, slug }: PhaseCardProps) => {
  const classes = useStyles();
  const [hidden, setIsHidden] = useState(!employees.length);
  return (
    <>
      <ButtonBase aria-expanded={hidden} aria-label={`Ansatte i ${title}`} focusRipple onClick={() => setIsHidden(!hidden)}>
        <CenteringRow className={classes.pointer}>
          <Typo variant='body1'>
            {title} (<b>{amount}</b>)
          </Typo>
          {hidden ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </CenteringRow>
      </ButtonBase>
      <Box display={hidden ? 'none' : 'block'}>
        {employees.length > 0 ? (
          <Table aria-label='Mine ansatte tabell'>
            <TableHead>
              <TableRow>
                <TableCell style={{ width: '37.5rem' }}>Navn</TableCell>
                <Hidden mdDown>
                  <TableCell style={{ width: '18.75rem' }}>Oppgaver gjennomført</TableCell>
                </Hidden>
                <Hidden lgDown>
                  <TableCell style={{ width: '18.75rem' }}>Stilling</TableCell>
                </Hidden>
                <Hidden smDown>
                  <TableCell style={{ width: '18.75rem' }}>Ansvarlig</TableCell>
                </Hidden>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((employee) => {
                return <UserRow employee={employee} key={employee.id} slug={slug} />;
              })}
            </TableBody>
          </Table>
        ) : (
          <Typo variant='body2'>Ingen ansatte i denne fasen</Typo>
        )}
      </Box>
    </>
  );
};

export default PhaseCard;
