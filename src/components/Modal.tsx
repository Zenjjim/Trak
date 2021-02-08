import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Typo from './Typo';

const useStyles = makeStyles({
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

type ModalProps = {
  header?: React.ReactChild | string;
  subheader?: React.ReactChild | string;
  buttonGroup?: React.ReactChild[];
  open: boolean;
  onClose: () => void;
  children?: React.ReactChild;
};

const Modal = ({ header, subheader, buttonGroup, open, onClose, children }: ModalProps) => {
  const classes = useStyles();
  return (
    <Dialog aria-labelledby='modal' maxWidth='xs' onBackdropClick={onClose} onClose={onClose} open={open}>
      {header && (
        <DialogTitle id='modal-title'>
          <Typo variant='h1'>{header}</Typo>
          {subheader && <Typo variant='body2'>{subheader}</Typo>}
        </DialogTitle>
      )}
      {children && <DialogContent>{children}</DialogContent>}
      {buttonGroup && <DialogActions className={classes.buttonGroup}>{buttonGroup.map((button) => button)}</DialogActions>}
    </Dialog>
  );
};

export default Modal;
