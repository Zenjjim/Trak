import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#260A3F',
      light: '#DDC3F3',
    },
    secondary: {
      main: '#23BFC1',
      light: '#A5C8D1',
    },
    error: {
      main: '#EA526F',
    },
    success: {
      main: '#50C878',
    },
    background: {
      default: '#FFFFFF',
      paper: '#EADEF4',
    },
    text: {
      primary: '#2F2F2F',
      secondary: '#F2F2F2',
      disabled: '#6A6A6A',
    },
  },
  typography: {
    h1: {
      fontSize: '2.75rem',
    },
    h2: {
      fontSize: '1.75rem',
    },
    body1: {
      fontSize: '1.25rem',
    },
    body2: {
      fontSize: '0.75rem',
    },
  },
});

theme.components = {
  ...theme.components,
  MuiDialog: {
    styleOverrides: {
      root: {
        color: theme.palette.text.primary,
      },
    },
  },
  MuiDialogContent: {
    styleOverrides: {
      root: {
        paddingTop: 16,
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        color: theme.palette.text.disabled,
        top: '-15px !important',
        marginLeft: 6,
        '&$focused': {
          marginLeft: 0,
          color: theme.palette.secondary.main,
        },
      },
      shrink: {
        marginLeft: 0,
      },
    },
  },
  MuiInput: {
    styleOverrides: {
      formControl: {
        'label + &': {
          marginTop: 0,
        },
      },
      root: {},
      underline: {
        '&:after': {
          borderBottom: `2px solid ${theme.palette.secondary.main}`,
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      input: {
        marginLeft: 6,
        marginRight: 6,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.background.default,
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      noOptions: {
        color: theme.palette.text.primary,
      },
      tag: {
        backgroundColor: theme.palette.background.paper,
      },
      paper: {
        backgroundColor: theme.palette.background.default,
        border: `0.6px solid ${theme.palette.primary.main} `,
        fontSize: '1rem',
      },
    },
  },
  MuiMenuItem: {
    styleOverrides: {
      root: {
        fontSize: '1rem',
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        minWidth: '32px',
      },
    },
  },
};

export default theme;
