import { Typography, TypographyProps } from '@material-ui/core';

type ITypo = {
  variant?: 'h1' | 'h2' | 'body1' | 'body2';
} & TypographyProps;

const Typo = ({ color = 'textPrimary', variant = 'body1', children, ...args }: ITypo) => {
  return (
    <Typography color={color} {...args} variant={variant}>
      {children}
    </Typography>
  );
};

export default Typo;
