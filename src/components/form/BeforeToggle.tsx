import { InputLabel, MenuItem, Select } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Control, Controller } from 'react-hook-form';
import theme from 'theme';
import { Offset } from 'utils/types';

const useStyles = makeStyles({
  select: {
    marginRight: theme.spacing(1),
  },
});

/**
 * @typedef {object} BeforeToogleProps
 * @property {Control} control
 * @property {string} name
 */
export type BeforeToogleProps = {
  control: Control;
  name: string;
};

/**
 * Component to toogle with before/after
 * @param {BeforeToogleProps} Props to BeforeToogle
 * @returns Before ToogleComponent
 */
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

/**
 * @typedef {object} ToogleComponentProps
 * @property {function} function
 * @property {string} value
 */
export type ToggleComponentProps = {
  setValue: (string) => void;
  value: string;
};

/**
 * Component to be rendered in the Controller
 * @param {ToogleComponentProps} Props to SelectComponent
 * @returns SelectComponent
 */
export const SelectComponent = ({ setValue, value }: ToggleComponentProps) => {
  const classes = useStyles();
  return (
    <>
      <InputLabel htmlFor='select-before' style={{ display: 'none' }}>
        Før/etter
      </InputLabel>
      <Select
        className={classes.select}
        inputProps={{ name: 'before-toogle', id: 'select-before', 'aria-label': 'Før/etter' }}
        onChange={() => setValue(value === Offset.Before ? Offset.After : Offset.Before)}
        value={value}>
        <MenuItem value={Offset.Before}>før</MenuItem>
        <MenuItem value={Offset.After}>etter</MenuItem>
      </Select>
    </>
  );
};

export default BeforeToogle;
