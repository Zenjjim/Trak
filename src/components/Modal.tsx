import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';

const useStyles = makeStyles({
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

/**
 * @typedef {object} ModalProps
 * @property {React.ReactChild | string} header
 * @property {React.ReactChild | string} subheader
 * @property {React.ReactChild[]} buttonGroup
 * @property {boolean} open
 * @property {function} onClose
 * @property {function} onSubmit
 * @property {React.ReactChild} children
 */
export type ModalProps = {
  header?: React.ReactChild | string;
  subheader?: React.ReactChild | string;
  buttonGroup?: React.ReactChild[];
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  children?: React.ReactChild;
};

/**
 * Modal to display different data
 * @param {ModalProps} params
 * @returns Modal
 */
const Modal = ({ header, subheader, buttonGroup, open, onClose, onSubmit, children }: ModalProps) => {
  const classes = useStyles();
  return (
    <Dialog aria-labelledby='modal-title' fullWidth onClose={onClose} open={open}>
      <form noValidate onSubmit={onSubmit}>
        {header && (
          <DialogTitle disableTypography id='modal-title'>
            <Typo variant='h1'>{header}</Typo>
            {subheader && <Typo variant='body2'>{subheader}</Typo>}
          </DialogTitle>
        )}
        {children && <DialogContent>{children}</DialogContent>}
        {buttonGroup && <DialogActions className={classes.buttonGroup}>{buttonGroup.map((button) => button)}</DialogActions>}
      </form>
    </Dialog>
  );
};

export default Modal;
