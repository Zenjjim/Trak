import { Autocomplete, TextField } from '@material-ui/core';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { ITag } from 'utils/types';
import { getUniqueTags } from 'utils/utilFunctions';

export type TagSelectorProps = {
  label: string;
  control: Control<Record<string, unknown>>;
  options: ITag[];
  name: string;
};
const TagSelector = ({ label, options, control, name }: TagSelectorProps) => {
  // TODO
  // If editing a task this will be updated with that data, otherwise empty

  const [tags, setTags] = useState<ITag[]>([]);
  return (
    <Controller
      as={({ onChange }) => (
        <Autocomplete
          autoSelect
          clearOnBlur
          defaultValue={tags}
          freeSolo
          getOptionLabel={(option) => option.title}
          handleHomeEndKeys
          multiple
          noOptionsText={'Ingen tags'}
          onChange={(_, newValue) => {
            const updatedTags = newValue.map((tag) => {
              if (typeof tag === 'string') {
                const newTag: ITag = { id: null, title: tag.toLowerCase() };
                return newTag;
              } else {
                return tag;
              }
            });
            const uniqueTags = getUniqueTags(updatedTags, 'title');
            setTags(uniqueTags);
            onChange(uniqueTags);
          }}
          options={options}
          renderInput={(params) => <TextField {...params} variant='standard' {...params} label={label} />}
          selectOnFocus
        />
      )}
      control={control}
      name={name}
    />
  );
};

export default TagSelector;
