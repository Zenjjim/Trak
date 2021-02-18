import { Autocomplete, TextField } from '@material-ui/core';
import { Control, Controller } from 'react-hook-form';
import { IEmployee } from 'utils/types';

type EmployeeSelectorProps = {
  employees: IEmployee[];
  control: Control;
  name: string;
  label: string;
  employee: IEmployee;
};

const EmployeeSelector = ({ employees, control, name, label, employee }: EmployeeSelectorProps) => {
  return (
    <Controller
      control={control}
      defaultValue={employee}
      name={name}
      render={({ onChange, value }) => <EmployeeSelectorComponent employees={employees} label={label} setValue={onChange} value={value} />}
    />
  );
};

type EmployeeSelectorComponentProps = {
  employees: IEmployee[];
  setValue: (IEmployee) => void;
  label: string;
  value: IEmployee;
};

const EmployeeSelectorComponent = ({
  employees,
  setValue,
  label,
  value = {
    firstName: '',
    lastName: '',
    id: null,
    email: undefined,
    birthDate: null,
    profession: undefined,
    hrManager: undefined,
    employees: undefined,
    employeeTask: undefined,
  },
}: EmployeeSelectorComponentProps) => {
  return (
    <Autocomplete
      getOptionLabel={(employee: IEmployee) => `${employee.firstName} ${employee.lastName}`.trim()}
      noOptionsText={'Ingen ansatte funnet'}
      onChange={(_, employee) => setValue(employee)}
      options={employees}
      popupIcon={<></>}
      renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: true }} label={label} variant='standard' />}
      value={value}
    />
  );
};

export default EmployeeSelector;
