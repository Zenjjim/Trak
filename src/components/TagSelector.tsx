import { Autocomplete, TextField } from '@material-ui/core';
import { useState } from 'react';

export type TagSelectorProps = {
  label: string;
  placeholder: string;
};
const TagSelector = ({ label, placeholder }: TagSelectorProps) => {
  const values = ['Design', 'Innkjøp', 'Teknolog', 'Administrativt', 'Lønn', 'Bespisning', 'Samtale', 'Alle ansatte'];

  const [tags, setTags] = useState<string[]>([values[0]]);
  return (
    <div>
      <Autocomplete
        defaultValue={tags}
        multiple
        onChange={(e, value) => setTags(value)}
        options={values}
        renderInput={(params) => <TextField variant='standard' {...params} label={label} placeholder={placeholder} />}></Autocomplete>
    </div>
  );
};

export default TagSelector;
