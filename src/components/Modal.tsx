import { Dialog, DialogActions, DialogContent, DialogTitle } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Typo from 'components/Typo';

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
  onSubmit: () => void;
  children?: React.ReactChild;
};

const Modal = ({ header, subheader, buttonGroup, open, onClose, onSubmit, children }: ModalProps) => {
  const classes = useStyles();
  return (
    <Dialog aria-labelledby='modal' fullWidth onClose={onClose} open={open}>
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
