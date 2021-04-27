import { Typography, TypographyProps } from '@material-ui/core';

/**
 * @typedef {object} TypeProps
 * @property {string} variant
 */
export type TypoProps = {
  variant?: 'h1' | 'h2' | 'body1' | 'body2';
} & TypographyProps;

/**
 * Typo based on Material UI´s Typography
 * @param {TypoProps} params
 * @returns Typo
 */
const Typo = ({ color = 'textPrimary', variant = 'body1', children, ...args }: TypoProps) => {
  return (
    <Typography color={color} {...args} variant={variant}>
      {children}
    </Typography>
  );
};

export default Typo;
