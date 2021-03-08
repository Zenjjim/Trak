import { Avatar, Badge, Box, Divider, Drawer, IconButton, List, ListItem, ListItemText } from '@material-ui/core';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import Typo from 'components/Typo';
import { useUser } from 'context/User';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { Dispatch, useState } from 'react';
import theme from 'theme';
import urls, { link, section } from 'URLS';
import { INotification } from 'utils/types';

const SIDEBAR_WIDTH = 190;

const useStyles = makeStyles({
  drawer: {
    width: SIDEBAR_WIDTH,
    flexShrink: 0,
  },
  drawerPaper: {
    width: SIDEBAR_WIDTH,
    backgroundColor: theme.palette.secondary.light,
  },
  gutterBottom: {
    marginBottom: theme.spacing(2),
  },
  nested: {
    paddingLeft: theme.spacing(1),
  },
  listRoot: {
    width: '100%',
  },
  link: {
    lineHeight: theme.spacing(0.2),
    color: theme.palette.text.disabled,
  },
  pointerCursor: {
    cursor: 'pointer',
  },
  icon: {
    height: '8px',
    width: '8px',
    marginRight: theme.spacing(0.5),
  },
  marginRight: {
    marginRight: theme.spacing(1),
  },
  notificationBox: {
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: '0px',
    },
  },
});
const LinkGroup = ({ title, links, divider }: section) => {
  const classes = useStyles();
  return (
    <>
      <ListItemText color='disabled' primary={title} />
      <List component='div' disablePadding>
        {links.map((url: link) => {
          return (
            <Link href={url.link} key={url.title}>
              <ListItem button className={classes.nested}>
                <ListItemText aria-label={url.aria_label} classes={{ secondary: classes.link }} secondary={url.title} />
              </ListItem>
            </Link>
          );
        })}
        {divider ? <Divider /> : null}
      </List>
    </>
  );
};

type NotificationProps = {
  notification: INotification;
};

const Notification = ({ notification }: NotificationProps) => {
  const updateNotification = async () => {
    await axios.put(`api/notification/${notification.id}`, { data: { read: !notification.read } });
  };
  if (!notification.read) {
    updateNotification();
  }
  return (
    <>
      <Box p={theme.spacing(1)} style={{ backgroundColor: notification.read ? theme.palette.background.paper : theme.palette.primary.light }}>
        <Box alignItems='center' display='flex' flexDirection='row'>
          <Typo style={{ color: notification.read ? theme.palette.text.primary : theme.palette.primary.main }} variant='body2'>
            {notification.description}
          </Typo>
        </Box>
        <Box display='flex' justifyContent='flex-end'>
          <Typo variant='body2'>{moment(notification.createdAt).format('DD.MM.YYYY HH:mm')}</Typo>
        </Box>
      </Box>
      <Divider />
    </>
  );
};

type LoggedInUserCardProps = {
  firstName: string;
  lastName: string;
  image?: string;
  notifications: INotification[];
  displayNotifications: boolean;
  setDisplayNotifications: Dispatch<boolean>;
};

const LoggedInUserCard = ({ firstName, lastName, image, notifications, displayNotifications, setDisplayNotifications }: LoggedInUserCardProps) => {
  const classes = useStyles();
  const name = `${firstName} ${lastName[0]}.`;
  const unreadNotifications = notifications.filter((notification: INotification) => !notification.read).length;

  return (
    <Box
      bgcolor={theme.palette.background.paper}
      boxShadow={'0px 4px 4px rgba(0,0,0,0.25)'}
      className={classes.gutterBottom}
      minHeight={displayNotifications ? '60vh' : '10vh'}
      mx={'-' + theme.spacing(2)}
      padding={theme.spacing(2)}>
      <Box className={classes.pointerCursor} display='flex' onClick={() => setDisplayNotifications(!displayNotifications)}>
        <Box flex={3} mb={theme.spacing(1)}>
          <Badge badgeContent={unreadNotifications} color='error'>
            <Avatar alt={'Logged in user photo'} src={image ? image : '/dummy_avatar.png'} />
          </Badge>
        </Box>
        <Box alignItems='center' display='flex' flex={4}>
          <Typo variant='body2'>{name}</Typo>
        </Box>
      </Box>

      {displayNotifications && (
        <>
          <Box alignItems='center' className={classes.gutterBottom} display='flex'>
            <SettingsIcon className={classes.marginRight} />
            <Typo variant='body2'>Innstillinger</Typo>
          </Box>
          <Box className={classes.notificationBox} maxHeight='60vh' mx={'-' + theme.spacing(2)} style={{ overflowX: 'hidden', overflowY: 'auto' }}>
            {notifications.map((notification: INotification) => {
              return <Notification key={notification.id} notification={notification} />;
            })}
          </Box>
          <Box alignItems='flex-end' display='flex' flexDirection='column-reverse'>
            <IconButton onClick={() => setDisplayNotifications(!displayNotifications)}>
              <ArrowUpwardIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

const Sidebar = () => {
  const { user } = useUser();

  const classes = useStyles();

  const [displayNotifications, setDisplayNotifications] = useState(false);
  if (!user) {
    return <Typo>Loading...</Typo>;
  }
  return (
    <Drawer anchor='left' className={classes.drawer} classes={{ paper: classes.drawerPaper }} variant='permanent'>
      <Box display='flex' flexDirection='column' padding={theme.spacing(2)}>
        <Box className={classes.gutterBottom}>
          <Image height={34} src={'/trak_logo.png'} width={120} />
        </Box>
        <LoggedInUserCard
          displayNotifications={displayNotifications}
          firstName={user.firstName}
          image={user.imageUrl}
          lastName={user.lastName}
          notifications={user.notifications}
          setDisplayNotifications={setDisplayNotifications}
        />
        <Divider />
        {!displayNotifications && (
          <List className={classes.listRoot} component='nav'>
            {urls.map((url) => {
              return <LinkGroup divider={url.divider} key={url.title} links={url.links} title={url.title} />;
            })}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;
