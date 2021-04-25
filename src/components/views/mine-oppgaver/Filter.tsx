import { Autocomplete, Box, Button, TextField, ToggleButton, ToggleButtonGroup } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import Typo from 'components/Typo';
import { useData } from 'context/Data';
import theme from 'theme';
import { IProcessTemplate, ITag } from 'utils/types';

const useStyles = makeStyles({
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
  selectedButton: {
    '&.MuiToggleButton-root': {
      color: theme.palette.primary.main,
    },
    '&.Mui-selected': {
      color: theme.palette.secondary.main,
    },
  },
  wrap: {
    flexWrap: 'wrap',
  },
});

type FilterProps = {
  choosenTags: ITag[];
  setChoosenTags: (tag: ITag[]) => void;
  choosenProcessTemplates: string[];
  setChoosenProcessTemplates: (element: string[]) => void;
};
const Filter = ({ choosenTags, setChoosenTags, choosenProcessTemplates, setChoosenProcessTemplates }: FilterProps) => {
  const { tags, processTemplates } = useData();
  const clearFilters = () => {
    setChoosenTags([]);
    setChoosenProcessTemplates([]);
  };

  const handleFormat = (_, newFormats) => {
    if (newFormats.length === processTemplates.length) {
      setChoosenProcessTemplates([]);
    } else {
      setChoosenProcessTemplates(newFormats);
    }
  };
  const classes = useStyles();
  return (
    <Box display='flex' flexDirection='column' maxWidth='400px' minWidth='300px' padding={2}>
      <Typo gutterBottom variant='h2'>
        Tags
      </Typo>
      <Autocomplete
        className={classes.gutterBottom}
        getOptionLabel={(option: ITag) => option.title}
        multiple
        noOptionsText='Finner ingen tags'
        onChange={(_, value: ITag[]) => {
          setChoosenTags(value);
        }}
        options={tags}
        renderInput={(params) => {
          const paramsWithAriaLabel = { ...params, inputProps: { ...params.InputProps, 'aria-label': 'Tags' } };

          return <TextField {...paramsWithAriaLabel} size='small' />;
        }}
        value={choosenTags}
      />
      <Typo gutterBottom variant='h2'>
        Prosess
      </Typo>
      <ToggleButtonGroup className={classNames(classes.gutterBottom, classes.wrap)} onChange={handleFormat} value={choosenProcessTemplates}>
        {processTemplates?.map((processTemplate: IProcessTemplate) => {
          return (
            <ToggleButton className={classes.selectedButton} key={processTemplate.id} value={processTemplate.title}>
              {processTemplate.title}
            </ToggleButton>
          );
        })}
      </ToggleButtonGroup>
      <Button disabled={!choosenProcessTemplates.length && !choosenTags.length} onClick={clearFilters} variant='outlined'>
        Tøm filtre
      </Button>
    </Box>
  );
};

export default Filter;
