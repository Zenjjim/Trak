import { Autocomplete, TextField } from '@material-ui/core';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { ITag } from 'utils/types';

export type TagSelectorProps = {
  label: string;
  placeholder: string;
  control: Control<Record<string, unknown>>;
  options: ITag[];
};
const TagSelector = ({ label, options, placeholder, control }: TagSelectorProps) => {
  // TODO
  // If editing a task this will be updated with that data, otherwise empty
  const [tags] = useState<ITag[]>();
  return (
    <Controller
      as={({ onChange }) => (
        <Autocomplete
          clearOnBlur
          defaultValue={tags}
          freeSolo
          getOptionLabel={(option) => option.title}
          handleHomeEndKeys
          multiple
          noOptionsText={'Ingen tags'}
          onChange={(_, newValue) => {
            const updatedTags = newValue.map((stringValues) => {
              if (typeof stringValues === 'string') {
                const newTag: ITag = { id: 'UUID', title: stringValues };
                return newTag;
              }
              return stringValues;
            });

            onChange(updatedTags);
          }}
          options={options}
          //onChange={(_, value) => onChange(value)}
          renderInput={(params) => <TextField variant='standard' {...params} label={label} placeholder={placeholder} />}
          selectOnFocus
        />
      )}
      control={control}
      name={'tagSelector'}
    />
  );
};

export default TagSelector;
