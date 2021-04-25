import { Badge, Button, Fade, IconButton, InputAdornment, makeStyles, Popover, TextField } from '@material-ui/core';
import { Search, Tune } from '@material-ui/icons';
import ClearIcon from '@material-ui/icons/Clear';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import theme from 'theme';
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
  filterComponent: React.ReactNode;
  search: (element: string) => void;
  activeFilters: boolean;
};
const SearchFilter = ({ filterComponent, search, activeFilters }: SearchFilterProps) => {
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    setDisplaySearch(false);
  }, [router.query]);

  const [displaySearch, setDisplaySearch] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchValue, setSearchValue] = useState('');

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    search(searchValue);
  }, [searchValue]);

  const open = Boolean(anchorEl);
  const id = open ? 'filter' : undefined;
  return (
    <div className={classes.centeringRow}>
      {displaySearch ? (
        <Fade in timeout={100}>
          <TextField
            InputProps={{
              className: classes.textField,
              ...(searchValue.length && {
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      onClick={() => {
                        setSearchValue('');
                      }}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }),
            }}
            inputProps={{ 'aria-label': 'Søk' }}
            onBlur={(e) => !e.target.value && setDisplaySearch(false)}
            onChange={(e) => setSearchValue(e.target.value)}
            size='small'
            value={searchValue}
          />
        </Fade>
      ) : (
        <Button aria-label='Søk' color='primary' onClick={() => setDisplaySearch(true)} startIcon={<Search />}>
          Søk
        </Button>
      )}
      <Button
        aria-label='Filter'
        color='primary'
        onClick={handleClick}
        startIcon={
          <Badge color='secondary' invisible={!activeFilters} variant='dot'>
            <Tune />
          </Badge>
        }>
        Filter
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        id={id}
        onClose={handleClose}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}>
        {filterComponent}
      </Popover>
    </div>
  );
};

export default SearchFilter;
