import { Autocomplete, createFilterOptions, TextField } from '@material-ui/core';
import { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { ITag, ITask } from 'utils/types';
import { getUniqueTags } from 'utils/utilFunctions';

type FilterOptions = {
  id: string;
  title: string;
  inputValue?: string;
  tasks?: ITask[];
};

export type TagSelectorProps = {
  label: string;
  control: Control<Record<string, unknown>>;
  options: FilterOptions[];
  name: string;
};
const TagSelector = ({ label, options, control, name }: TagSelectorProps) => {
  const filter = createFilterOptions<FilterOptions>();
  // TODO
  // If editing a task this will be updated with that data, otherwise empty
  const [tags, setTags] = useState<FilterOptions[]>([]);
  return (
    <Controller
      as={({ onChange }) => (
        <Autocomplete
          autoSelect
          clearOnBlur
          defaultValue={tags}
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (!filtered.length && params.inputValue !== '') {
              filtered.push({
                id: null,
                inputValue: params.inputValue,
                title: `Legg til "${params.inputValue}"`,
              });
            }
            return filtered;
          }}
          freeSolo
          getOptionLabel={(option) => {
            return option.title;
          }}
          handleHomeEndKeys
          multiple
          noOptionsText={'Ingen tags'}
          onChange={(_, newValue) => {
            const updatedTags = newValue.map((tag) => {
              if (typeof tag === 'string') {
                const newTag: ITag = { id: null, title: tag.toLowerCase() };
                return newTag;
              } else if (tag.inputValue) {
                const newTag: ITag = { id: null, title: tag.inputValue.toLowerCase() };
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
