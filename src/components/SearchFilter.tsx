import { Box, Button, Fade, makeStyles, TextField } from '@material-ui/core';
import { Search, Tune } from '@material-ui/icons';
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
});

type SearchFilterProps = {
  //eslint-disable-next-line
  search: (element: any) => void;
};

const SearchFilter = ({ search }: SearchFilterProps) => {
  const classes = useStyles();
  const router = useRouter();

  useEffect(() => {
    setDisplaySearch(false);
  }, [router.query]);

  const [displaySearch, setDisplaySearch] = useState(false);

  return (
    <Box className={classes.centeringRow} justifyContent='flex-end'>
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

      <Button aria-label='Filter' color='primary' startIcon={<Tune />}>
        Filter
      </Button>
    </Box>
  );
};

export default SearchFilter;
