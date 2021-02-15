import { Box, Button } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import { IProfession } from 'utils/types';

type ToggleButtonGroupProps = {
  professions: IProfession[];
  control: any;
  name: string;
};

const ToggleButtonGroup = ({ professions, control, name }: ToggleButtonGroupProps) => {
  return (
    <Controller
      control={control}
      defaultValue={professions.map((profession) => profession.id)}
      name={name}
      render={({ value, onChange }) => <ToggleButtonGroupComponent professions={professions} setValue={onChange} value={value} />}
    />
  );
};

type ToggleButtonGroupComponentProps = {
  professions: IProfession[];
  value: string | string[];
  setValue: (string) => void;
};

const ToggleButtonGroupComponent = ({ professions, value, setValue }: ToggleButtonGroupComponentProps) => {
  return (
    <Box display='flex'>
      <Button color={value instanceof Array ? 'secondary' : 'primary'} onClick={() => setValue(professions.map((profession) => profession.id))} type='button'>
        Alle
      </Button>
      {professions.map((profession) => (
        <Button
          color={value === profession.id ? 'secondary' : 'primary'}
          id={profession.id}
          key={profession.id}
          onClick={() => setValue(profession.id)}
          type='button'>
          {profession.title}
        </Button>
      ))}
    </Box>
  );
};

export default ToggleButtonGroup;
