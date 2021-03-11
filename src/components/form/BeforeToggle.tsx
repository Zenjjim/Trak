import { MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Control, Controller } from 'react-hook-form';
import theme from 'theme';

const useStyles = makeStyles({
  marginRight: {
    marginRight: theme.spacing(1),
  },
});

type BeforeToogleProps = {
  control: Control;
  name: string;
};

const BeforeToogle = ({ control, name }: BeforeToogleProps) => {
  return (
    <Controller control={control} defaultValue='true' name={name} render={({ value, onChange }) => <SelectComponent setValue={onChange} value={value} />} />
  );
};

type ToggleComponentProps = {
  setValue: (string) => void;
  value: string;
};
const SelectComponent = ({ setValue, value }: ToggleComponentProps) => {
  const classes = useStyles();
  return (
    <Select className={classes.marginRight} onChange={() => setValue(value === 'true' ? 'false' : 'true')} value={value}>
      <MenuItem value={'true'}>før</MenuItem>
      <MenuItem value={'false'}>etter</MenuItem>
    </Select>
  );
};

export default BeforeToogle;
