import { Box, Hidden, makeStyles, TableCell, TableRow } from '@material-ui/core';
import Avatar from 'components/Avatar';
import Typo from 'components/Typo';
import { useRouter } from 'next/router';
import theme from 'theme';
import { IEmployee, IEmployeeTask, IProfession } from 'utils/types';

const useStyles = makeStyles({
  pointer: {
    cursor: 'pointer',
  },
  userRow: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    '&:focus': {
      outline: `0.1px solid ${theme.palette.text.disabled}`,
    },
  },
  avatar: {
    width: '25px',
    height: '25px',
    marginRight: theme.spacing(1),
  },
});
export type EmployeeRow = {
  id: number;
  firstName: string;
  lastName: string;
  profession: IProfession;
  imageUrl?: string;
  hrManager: IEmployee;
  tasksFinished: number;
  totalTasks: number;
  employeeTask: IEmployeeTask[];
};

type UserRowProps = {
  employee: EmployeeRow;
  slug: string;
};

const UserRow = ({ employee, slug }: UserRowProps) => {
  const classes = useStyles();
  const typoVariant = 'body2';
  const router = useRouter();

  return (
    <TableRow className={classes.pointer} hover>
      <TableCell onClick={() => router.push(`/ansatt/${employee.id}?år=${new Date().getFullYear()}&prosess=${slug}`)}>
        <div className={classes.userRow}>
          <Avatar className={classes.avatar} firstName={employee.firstName} image={employee.imageUrl} lastName={employee.lastName} />
          <Typo noWrap variant={typoVariant}>
            {employee.firstName} {employee.lastName}
          </Typo>
        </div>
      </TableCell>
      <Hidden mdDown>
        <TableCell>
          <Typo variant={typoVariant}>
            <b>{employee.tasksFinished}</b> av <b>{employee.totalTasks}</b>
          </Typo>
        </TableCell>
      </Hidden>
      <Hidden lgDown>
        <TableCell>
          <Typo variant={typoVariant}>{employee.profession.title}</Typo>
        </TableCell>
      </Hidden>
      <Hidden smDown>
        <TableCell>
          <Box alignItems='center' display='flex' flexDirection='row'>
            <Avatar
              className={classes.avatar}
              firstName={employee.hrManager.firstName}
              image={employee.hrManager.imageUrl}
              lastName={employee.hrManager.lastName}
            />
            <Typo noWrap variant={typoVariant}>
              {employee.hrManager.firstName} {employee.hrManager.lastName}
            </Typo>
          </Box>
        </TableCell>
      </Hidden>
    </TableRow>
  );
};

export default UserRow;
