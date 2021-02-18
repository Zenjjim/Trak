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

const EmployeeSelectorComponent = ({ employees, setValue, label, value }: EmployeeSelectorComponentProps) => {
  return (
    <Autocomplete
      defaultValue={value}
      getOptionLabel={(employee: IEmployee) => `${employee.firstName} ${employee.lastName}`}
      noOptionsText={'Ingen ansatte funnet'}
      onChange={(_, employee) => setValue(employee)}
      options={employees}
      popupIcon={<></>}
      renderInput={(params) => <TextField {...params} label={label} variant='standard' />}
    />
  );
};

export default EmployeeSelector;
