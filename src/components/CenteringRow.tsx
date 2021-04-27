import { Box, BoxProps } from '@material-ui/core';

/**
 * @typedef {object} CenteringRowProps
 * @property {JSX.Element[]} children
 */
export type CenteringRowProps = {
  children: JSX.Element[];
} & BoxProps;

/**
 * Component which will center all children in a row
 * @param {CenteringRowProps} params
 * @returns CenteringRow
 */
const CenteringRow = ({ children, ...args }: CenteringRowProps) => {
  return (
    <Box {...args} alignItems='center' display='flex' flexDirection='row'>
      {children}
    </Box>
  );
};

export default CenteringRow;
