import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';

type IAddButton = {
  text: string;
  onClick: () => void;
};

const AddButton = ({ onClick, text }: IAddButton) => {
  return (
    <Button onClick={onClick} startIcon={<Add />}>
      {text}
    </Button>
  );
};

export default AddButton;
