import { Autocomplete, Chip, createFilterOptions, TextField } from '@material-ui/core';
import { uniqBy } from 'lodash';
import { Control, Controller } from 'react-hook-form';
import { ITag, ITask } from 'utils/types';

/**
 * @typedef {object} FilterOptions
 * @property {string} id
 * @property {string} title
 * @property {string} inputValue
 * @property {ITask[]} tasks
 */
export type FilterOptions = {
  id: string;
  title: string;
  inputValue?: string;
  tasks?: ITask[];
};

/**
 * @typedef {object} TagSelectorProps
 * @property {string} label
 * @property {Control} control
 * @property {FilterOptions[]} options
 * @property {string} name
 */
export type TagSelectorProps = {
  label: string;
  control: Control;
  options: FilterOptions[];
  name: string;
};

/**
 * Select a multiple tags with React Hook Form
 * @param param - Props to TagSelector
 * @returns - TagSelector
 */
export const TagSelector = ({ label, options, control, name }: TagSelectorProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, value }) => <TagSelectorComponent label={label} options={options} setValue={onChange} value={value} />}
    />
  );
};

/**
 * @typedef {object} TagSelectorComponentProps
 * @property {string} label
 * @property {FilterOptions[]} options
 * @property {FilterOptions[]} value
 * @property {function} setValue
 */
export type TagSelectorComponentProps = {
  label: string;
  options: FilterOptions[];
  value: FilterOptions[];
  setValue: (FilterOptions) => void;
};

/**
 * Select multiple tags
 * @param param Props to TagSelectorComponent
 * @returns TagSelectorComponent
 */
export const TagSelectorComponent = ({ label, options, value = [], setValue }: TagSelectorComponentProps) => {
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
        const uniqueTags = uniqBy(updatedTags, 'title');
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
export default TagSelector;
