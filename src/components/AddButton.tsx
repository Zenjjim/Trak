import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';

type AddButtonProps = {
  text: string;
  onClick: () => void;
};

const AddButton = ({ onClick, text }: AddButtonProps) => {
  return (
    <Button onClick={onClick} startIcon={<Add />}>
      {text}
    </Button>
  );
};

export default AddButton;
