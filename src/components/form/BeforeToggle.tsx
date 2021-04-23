import { MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Control, Controller } from 'react-hook-form';
import theme from 'theme';
import { Offset } from 'utils/types';

const useStyles = makeStyles({
  select: {
    marginRight: theme.spacing(1),
  },
});

type BeforeToogleProps = {
  control: Control;
  name: string;
};

const BeforeToogle = ({ control, name }: BeforeToogleProps) => {
  return (
    <Controller
      control={control}
      defaultValue={Offset.Before}
      name={name}
      render={({ value, onChange }) => <SelectComponent setValue={onChange} value={value} />}
    />
  );
};

type ToggleComponentProps = {
  setValue: (string) => void;
  value: string;
};
const SelectComponent = ({ setValue, value }: ToggleComponentProps) => {
  const classes = useStyles();
  return (
    <Select className={classes.select} onChange={() => setValue(value === Offset.Before ? Offset.After : Offset.Before)} value={value}>
      <MenuItem value={Offset.Before}>før</MenuItem>
      <MenuItem value={Offset.After}>etter</MenuItem>
    </Select>
  );
};

export default BeforeToogle;
