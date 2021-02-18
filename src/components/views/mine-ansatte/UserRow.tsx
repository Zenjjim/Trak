import { Avatar, Box, makeStyles, TableCell, TableRow } from '@material-ui/core';
import Typo from 'components/Typo';
import theme from 'theme';
import { IEmployee, IProfession } from 'utils/types';

const useStyles = makeStyles({
  pointer: {
    cursor: 'pointer',
  },
  userRow: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    '&:focus': {
      outline: `0.1px solid ${theme.palette.text.disabled}`,
    },
  },
  avatar: {
    width: '25px',
    height: '25px',
  },
});
export type EmployeeRow = {
  id: number;
  firstName: string;
  lastName: string;
  profession: IProfession;
  hrManager: IEmployee;
  tasksFinished: number;
  totalTasks: number;
};

type UserRowProps = {
  employee: EmployeeRow;
};

const UserRow = ({ employee }: UserRowProps) => {
  const classes = useStyles();
  const typoVariant = 'body2';
  return (
    <TableRow className={classes.pointer} hover>
      <TableCell>
        <div className={classes.userRow} tabIndex={0}>
          <Avatar alt={'Logged in user photo'} className={classes.avatar} src={'/dummy_avatar.png'} />
          <Typo variant={typoVariant}>
            {employee.firstName} {employee.lastName}
          </Typo>
        </div>
      </TableCell>
      <TableCell>
        <Typo variant={typoVariant}>
          <b>{employee.tasksFinished}</b> av <b>{employee.totalTasks}</b>
        </Typo>
      </TableCell>
      <TableCell>
        <Typo variant={typoVariant}>{employee.profession.title}</Typo>
      </TableCell>
      <TableCell>
        <Box alignItems='flex-end' display='flex' flexDirection='row'>
          <Avatar alt={'Logged in user photo'} className={classes.avatar} src={'/dummy_avatar.png'} />
          <Typo variant={typoVariant}>
            {employee.hrManager.firstName} {employee.hrManager.lastName}
          </Typo>
        </Box>
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
