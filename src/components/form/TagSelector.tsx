import { Autocomplete, Chip, createFilterOptions, TextField } from '@material-ui/core';
import { Control, Controller } from 'react-hook-form';
import { ITag, ITask } from 'utils/types';

type FilterOptions = {
  id: string;
  title: string;
  inputValue?: string;
  tasks?: ITask[];
};

export type TagSelectorProps = {
  label: string;
  control: Control;
  options: FilterOptions[];
  name: string;
};

const TagSelector = ({ label, options, control, name }: TagSelectorProps) => {
  return (
    <Controller
      control={control}
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

const TagSelectorComponent = ({ label, options, value = [], setValue }: TagSelectorComponentProps) => {
  const filter = createFilterOptions<FilterOptions>();
  return (
    <Autocomplete
      autoSelect
      clearOnBlur
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        if (!filtered.length && params.inputValue) {
          filtered.push({
            id: '',
            inputValue: params.inputValue.toLowerCase(),
            title: `Legg til "${params.inputValue}"`,
          });
        }
        return filtered;
      }}
      filterSelectedOptions
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
      renderInput={(params) => <TextField {...params} InputLabelProps={{ shrink: true }} label={label} variant='standard' />}
      renderTags={(value, getTagProps) => {
        return value.map((option, index) => <Chip {...getTagProps({ index })} key={index} label={option.inputValue || option.title} />);
      }}
      selectOnFocus
      value={value}
    />
  );
};

function getUniqueTags(arr: ITag[], key: string): ITag[] {
  return arr.filter(
    (tag, index, tagArray) =>
      tagArray.findIndex((t) => t[key].toLowerCase() === tag[key].toLowerCase() && t[key].toLowerCase() === tag[key].toLowerCase()) === index,
  );
}

export default TagSelector;
