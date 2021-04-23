import { Box, BoxProps } from '@material-ui/core';

export type CenteringRowProps = {
  children: JSX.Element | JSX.Element[];
} & BoxProps;

const CenteringRow = ({ children, ...args }: CenteringRowProps) => {
  return (
    <Box {...args} alignItems='center' display='flex' flexDirection='row'>
      {children}
    </Box>
  );
};

export default CenteringRow;
