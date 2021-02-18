import { Autocomplete, createFilterOptions, TextField } from '@material-ui/core';
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
  defaultValue: FilterOptions[];
};

const TagSelector = ({ label, options, control, name, defaultValue }: TagSelectorProps) => {
  return (
    <Controller
      control={control}
      defaultValue={defaultValue}
      name={name}
      render={({ onChange, value }) => <TagSelectorComponent label={label} options={options} setValue={onChange} value={value} />}
    />
  );
};

export type TagSelectorComponentProps = {
  label: string;
  options: FilterOptions[];
  value: FilterOptions[];
  setValue: (FilterOptions) => void;
};

const TagSelectorComponent = ({ label, options, value, setValue }: TagSelectorComponentProps) => {
  const filter = createFilterOptions<FilterOptions>();
  return (
    <Autocomplete
      autoSelect
      clearOnBlur
      defaultValue={value}
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
            const newTag: ITag = { id: '', title: tag.toLowerCase() };
            return newTag;
          } else if (tag.inputValue) {
            const newTag: ITag = { id: '', title: tag.inputValue.toLowerCase() };
            return newTag;
          } else {
            return tag;
          }
        });
        const uniqueTags = getUniqueTags(updatedTags, 'title');
        setValue(uniqueTags);
      }}
      options={options}
      renderInput={(params) => <TextField {...params} variant='standard' {...params} label={label} />}
      selectOnFocus
    />
  );
};

export default TagSelector;
