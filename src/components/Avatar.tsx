import { Avatar as MuiAvatar, AvatarProps as MuiAvatarProps } from '@material-ui/core';
import Typo from 'components/Typo';

/**
 * @typedef {object} AvatarProps
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} image
 */
export type AvatarProps = {
  firstName: string;
  lastName: string;
  image?: string;
} & MuiAvatarProps;

/**
 * Get the initials of a full name
 * @param firstName
 * @param lastName
 * @returns the initials
 */
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}.${lastName.charAt(0)}`;
};

/**
 * Avatar for an user. Displaying the image if present or else it will display the initials
 * @param {AvatarProps} params
 * @returns Avatar
 */
const Avatar = ({ firstName, lastName, image, ...args }: AvatarProps) => {
  return (
    <MuiAvatar alt={`Profilbilde av ${firstName} ${lastName}`} src={image} {...args}>
      <Typo variant='body2'>{getInitials(firstName, lastName)}</Typo>
    </MuiAvatar>
  );
};

export default Avatar;
