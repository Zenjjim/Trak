import { Box, Button } from '@material-ui/core';
import { Control, Controller } from 'react-hook-form';
import { IProfession } from 'utils/types';

type ToggleButtonGroupProps = {
  professions: IProfession[];
  control: Control;
  name: string;
};

const ToggleButtonGroup = ({ professions = [], control, name }: ToggleButtonGroupProps) => {
  return (
    <Controller
      control={control}
      defaultValue={professions}
      name={name}
      render={({ value, onChange }) => <ToggleButtonGroupComponent professions={professions} setValue={onChange} value={value} />}
    />
  );
};

type ToggleButtonGroupComponentProps = {
  professions: IProfession[];
  value: IProfession[];
  setValue: (IProfession) => void;
};

const ToggleButtonGroupComponent = ({ professions, value = [], setValue }: ToggleButtonGroupComponentProps) => {
  return (
    <Box display='flex' flexWrap='wrap'>
      <Button color={value.length > 1 ? 'secondary' : 'primary'} onClick={() => setValue(professions)} type='button'>
        Alle
      </Button>
      {professions.map((profession) => (
        <Button
          color={value.length === 1 && value[0].id === profession.id ? 'secondary' : 'primary'}
          id={profession.id}
          key={profession.id}
          onClick={() => setValue([profession])}
          type='button'>
          {profession.title}
        </Button>
      ))}
    </Box>
  );
};

export default ToggleButtonGroup;
