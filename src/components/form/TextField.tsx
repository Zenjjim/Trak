import MuiTextField, { StandardTextFieldProps as MUITextFieldProps } from '@material-ui/core/TextField';
import { RegisterOptions, UseFormMethods } from 'react-hook-form';

/**
 * @typedef {object} TextFieldProps
 * @property {Pick<UseFormMethods, string>}
 */
export type TextFieldProps = MUITextFieldProps &
  Pick<UseFormMethods, 'register' | 'errors'> & {
    rules?: RegisterOptions;
    name: string;
  };

/**
 * TextField component to use with React Hook Form
 * @param {TextFieldProps} props to TextField
 * @returns TextField
 */
const TextField = ({ register, name, errors = {}, rules = {}, ...args }: TextFieldProps) => {
  return (
    <MuiTextField
      InputLabelProps={{ shrink: true }}
      error={Boolean(errors[name])}
      fullWidth
      helperText={errors[name]?.message}
      inputRef={register && register(rules)}
      label={args.label || 'Skriv her'}
      name={name}
      variant='standard'
      {...args}
    />
  );
};

export default TextField;
