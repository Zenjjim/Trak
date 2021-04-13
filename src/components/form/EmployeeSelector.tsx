import { Autocomplete, TextField } from '@material-ui/core';
import { Control, Controller } from 'react-hook-form';
import { IEmployee } from 'utils/types';

type EmployeeSelectorProps = {
  employees: IEmployee[];
  control: Control;
  name: string;
  label: string;
  required?: boolean;
};

const EmployeeSelector = ({ employees, control, name, label, required = false }: EmployeeSelectorProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => <EmployeeSelectorComponent employees={employees} label={label} required={required} setValue={onChange} value={value} />}
      rules={{ required: required }}
    />
  );
};

type EmployeeSelectorComponentProps = {
  employees: IEmployee[];
  setValue: (IEmployee) => void;
  label: string;
  value: IEmployee;
  required: boolean;
};

const EmployeeSelectorComponent = ({
  employees,
  setValue,
  label,
  required,
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
    employeeSettings: undefined,
    activeYear: new Date(),
  },
}: EmployeeSelectorComponentProps) => {
  return (
    <Autocomplete
      getOptionLabel={(employee: IEmployee) => `${employee.firstName} ${employee.lastName}`.trim()}
      noOptionsText={'Ingen ansatte funnet'}
      onChange={(_, employee) => setValue(employee)}
      options={employees}
      popupIcon={<></>}
      renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: true }} fullWidth label={label} required={required} variant='standard' />}
      value={value}
    />
  );
};

export default EmployeeSelector;
