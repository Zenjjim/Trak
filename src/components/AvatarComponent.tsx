import { Avatar, AvatarProps } from '@material-ui/core';
type AvatarComponentProps = {
  firstName: string;
  lastName: string;
  image?: string;
} & AvatarProps;

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}.${lastName.charAt(0)}`;
};

const AvatarComponent = ({ firstName, lastName, image, ...args }: AvatarComponentProps) => {
  return (
    <Avatar src={image} {...args}>
      {getInitials(firstName, lastName)}
    </Avatar>
  );
};

export default AvatarComponent;
