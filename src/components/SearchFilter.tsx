import { Autocomplete, Box, Button, Fade, makeStyles, Popover, TextField } from '@material-ui/core';
import { Search, Tune } from '@material-ui/icons';
import Typo from 'components/Typo';
import { useData } from 'context/Data';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import theme from 'theme';
import { ITag } from 'utils/types';
const useStyles = makeStyles({
  centeringRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  textField: {
    height: theme.spacing(4),
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
});

type SearchFilterProps = {
  filterByTags: (value: ITag[]) => void;
  // eslint-disable-next-line
  search: (element: any) => void;
};
const SearchFilter = ({ filterByTags, search }: SearchFilterProps) => {
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    setDisplaySearch(false);
  }, [router.query]);

  const [displaySearch, setDisplaySearch] = useState(false);
  const [choosenTags, setChoosenTags] = useState<ITag[]>([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { tags } = useData();
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <div className={classes.centeringRow}>
      {displaySearch ? (
        <Fade in timeout={100}>
          <TextField
            InputProps={{ className: classes.textField }}
            autoFocus
            onBlur={(e) => !e.target.value && setDisplaySearch(false)}
            onChange={(e) => search(e.target.value)}
            size='small'
          />
        </Fade>
      ) : (
        <Button aria-label='Søk' color='primary' onClick={() => setDisplaySearch(true)} startIcon={<Search />}>
          Søk
        </Button>
      )}
      <Button aria-label='Filter' color='primary' onClick={handleClick} startIcon={<Tune />}>
        Filter
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        id={id}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}>
        <Box display='flex' flexDirection='column' marginRight={2} minWidth='300px'>
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
              filterByTags(value);
            }}
            options={tags}
            renderInput={(params) => <TextField {...params} size='small' />}
            value={choosenTags}
          />
          <Typo gutterBottom variant='h2'>
            Prosess
          </Typo>
        </Box>
      </Popover>
    </div>
  );
};

export default SearchFilter;
