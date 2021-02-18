import { Autocomplete, TextField } from '@material-ui/core';
import { Control, Controller } from 'react-hook-form';
import { IEmployee } from 'utils/types';

type EmployeeSelectorProps = {
  employees: IEmployee[];
  control: Control;
  name: string;
  label: string;
};

const EmployeeSelector = ({ employees, control, name, label }: EmployeeSelectorProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange }) => <EmployeeSelectorComponent employees={employees} label={label} setValue={onChange} />}
    />
  );
};

type EmployeeSelectorComponentProps = {
  employees: IEmployee[];
  setValue: (IEmployee) => void;
  label: string;
};

const EmployeeSelectorComponent = ({ employees, setValue, label }: EmployeeSelectorComponentProps) => {
  return (
    <Autocomplete
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
