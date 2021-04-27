import { Autocomplete, TextField } from '@material-ui/core';
import { Control, Controller } from 'react-hook-form';
import { IEmployee } from 'utils/types';

/**
 * @typedef {object} EmployeeSelectorProps
 * @property {IEmployee[]} employees
 * @property {Control} control
 * @property {string} name
 * @property {string} label
 * @property {boolean} required
 */
export type EmployeeSelectorProps = {
  employees: IEmployee[];
  control: Control;
  name: string;
  label: string;
  required?: boolean;
};

/**
 * Select an employee with React Hook Form
 * @param params Props to EmployeeSelector
 * @returns EmployeeSelector
 */
export const EmployeeSelector = ({ employees, control, name, label, required = false }: EmployeeSelectorProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => <EmployeeSelectorComponent employees={employees} label={label} required={required} setValue={onChange} value={value} />}
      rules={{ required: required }}
    />
  );
};

/**
 * @typedef {object} EmployeeSelectorComponentProps
 * @property {IEmployee[]} employees
 * @property {function} setValue
 * @property {string} label
 * @property {IEmployee} value
 * @property {boolean} required
 */
export type EmployeeSelectorComponentProps = {
  employees: IEmployee[];
  setValue: (IEmployee) => void;
  label: string;
  value: IEmployee;
  required: boolean;
};

/**
 * Select employee with Autocompkete
 * @param param Props to EmployeeSelectorComponent
 * @returns EmployeeSelectorComponent
 */
export const EmployeeSelectorComponent = ({
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
