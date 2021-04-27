import { Box, Button } from '@material-ui/core';
import { Control, Controller } from 'react-hook-form';
import { IProfession } from 'utils/types';

/**
 * @type {object} ToogleButtonGroupProps
 * @property {IProffesion[]} professions
 * @property {Control} control
 * @property {string} name
 */
export type ToggleButtonGroupProps = {
  professions: IProfession[];
  control: Control;
  name: string;
};

/**
 * Toogle between professions
 * @param {ToogleButtonGroupsProps} props
 * @returns ToogleButtonGroup
 */
export const ToggleButtonGroup = ({ professions = [], control, name }: ToggleButtonGroupProps) => {
  return (
    <Controller
      control={control}
      defaultValue={professions}
      name={name}
      render={({ value, onChange }) => <ToggleButtonGroupComponent professions={professions} setValue={onChange} value={value} />}
    />
  );
};

/**
 * @typedef {object} ToogleButtonGroupComponentProps
 * @property {IProfession[]} professions
 * @property {function} setValue
 */
export type ToggleButtonGroupComponentProps = {
  professions: IProfession[];
  value: IProfession[];
  setValue: (IProfession) => void;
};

/**
 * Toogle between professions
 * @param {ToogleButtonGroupComponentProps} params
 * @returns ToogleButtonGroupComponent
 */
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
