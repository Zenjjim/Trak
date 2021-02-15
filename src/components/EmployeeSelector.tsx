import { Autocomplete } from '@material-ui/core';
import TextField from 'components/TextField';
import { UseFormMethods } from 'react-hook-form';

type EmployeeSelectorProps = {
  employees: {
    id: number;
    first_name: string;
    last_name: string;
    image_url: string;
  }[];
  name: string;
  label: string;
} & Pick<UseFormMethods, 'register' | 'errors'>;

const EmployeeSelector = ({ employees, errors, register, name, label }: EmployeeSelectorProps) => {
  return (
    <div>
      <Autocomplete
        options={employees.map((option) => `${option.first_name} ${option.last_name}`)}
        popupIcon={<></>}
        renderInput={(params) => <TextField {...params} errors={errors} label={label} name={name} register={register} />}
      />
    </div>
  );
};

export default EmployeeSelector;
