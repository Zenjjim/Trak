import {
  Avatar,
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer as MuiDrawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import { Menu } from '@material-ui/icons';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { makeStyles } from '@material-ui/styles';
import axios from 'axios';
import classnames from 'classnames';
import Typo from 'components/Typo';
import { useUser } from 'context/User';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/client';
import { Dispatch, useEffect, useState } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import theme from 'theme';
import urls, { link, section } from 'URLS';
import { IEmployee, INotification } from 'utils/types';
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
  linkActive: {
    lineHeight: theme.spacing(0.2),
    color: theme.palette.primary.main,
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
  removeScrollbar: {
    '&::-webkit-scrollbar': {
      background: 'transparent',
      width: '0px',
    },
  },
  showScrollBarOnHover: {
    overflow: 'hidden',
    '&:hover': {
      overflowY: 'auto',
    },
  },
});
const LinkGroup = ({ title, links, divider, setDrawer }: section & { setDrawer: (boolean) => void }) => {
  const router = useRouter();
  const classes = useStyles();
  return (
    <>
      <ListItemText color='disabled' primary={title} />
      <List component='div' disablePadding>
        {links.map((url: link) => {
          return (
            <Link href={url.link} key={url.title} passHref>
              <ListItem button className={classes.nested} component='a' onClick={() => setDrawer(false)}>
                <ListItemText
                  aria-label={url.aria_label}
                  classes={{ secondary: router.asPath === url.link ? classes.linkActive : classes.link }}
                  secondary={url.title}
                />
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
  setNotifications: Dispatch<INotification[]>;
  notifications: INotification[];
};

const Notification = ({ notification, setNotifications, notifications }: NotificationProps) => {
  useEffect(() => {
    if (!notification.read) {
      axios.put(`/api/notification/${notification.id}`);
    }
    return () => {
      const index = notifications.find((element: INotification) => notification.id === element.id).id;
      const newArray = [...notifications];
      newArray[index] = { ...notification, read: true };
      notification.read = true;
      setNotifications(newArray);
    };
  }, []);
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
  displayNotifications: boolean;
  setDisplayNotifications: Dispatch<boolean>;
  userId: number;
};

const LoggedInUserCard = ({ firstName, lastName, image, displayNotifications, setDisplayNotifications, userId }: LoggedInUserCardProps) => {
  const classes = useStyles();
  const router = useRouter();
  const name = `${firstName} ${lastName[0]}.`;
  const [notifications, setNotifications] = useState<INotification[]>([]);

  useEffect(() => {
    axios.get(`/api/employee/${userId}/notifications`).then((res) => {
      setNotifications([...res.data]);
    });
  }, [userId, displayNotifications]);

  if (!notifications) {
    return <CircularProgress />;
  }
  return (
    <Box
      bgcolor={theme.palette.background.paper}
      boxShadow={'0px 4px 4px rgba(0,0,0,0.25)'}
      className={classes.gutterBottom}
      mx={'-' + theme.spacing(2)}
      padding={theme.spacing(2)}>
      <Box className={classes.pointerCursor} display='flex' onClick={() => setDisplayNotifications(!displayNotifications)}>
        <Box flex={3} mb={theme.spacing(1)}>
          <Badge badgeContent={notifications.filter((notification) => !notification.read).length} color='error'>
            <Avatar alt={'Logged in user photo'} src={image ? image : '/dummy_avatar.png'} />
          </Badge>
        </Box>
        <Box alignItems='center' display='flex' flex={4}>
          <Typo variant='body2'>{name}</Typo>
        </Box>
      </Box>

      {displayNotifications && (
        <>
          <Box alignItems='center' className={classes.gutterBottom} display='flex' flexDirection='column'>
            <Button
              onClick={() => {
                router.push('/innstillinger');
                setDisplayNotifications(false);
              }}>
              Innstillinger
            </Button>
            <Button onClick={signOut}>Logg ut</Button>
          </Box>

          {notifications.length === 0 ? (
            <Typo variant='body2'>Ingen varsler</Typo>
          ) : (
            <>
              <Box maxHeight='60vh' mx={'-' + theme.spacing(2)} style={{ overflowX: 'hidden', overflowY: 'auto' }}>
                <ScrollableFeed className={classes.showScrollBarOnHover}>
                  {notifications.map((notification: INotification) => {
                    return <Notification key={notification.id} notification={notification} notifications={notifications} setNotifications={setNotifications} />;
                  })}
                </ScrollableFeed>
              </Box>
            </>
          )}

          <Box alignItems='flex-end' display='flex' flexDirection='column-reverse'>
            <IconButton onClick={() => setDisplayNotifications(false)}>
              <ExpandLessIcon />
            </IconButton>
          </Box>
        </>
      )}
    </Box>
  );
};

type DrawerType = {
  drawer: boolean;
  setDrawer: (boolean) => void;
  displayNotifications: boolean;
  setDisplayNotifications: (boolean) => void;
  variant: 'permanent' | 'persistent' | 'temporary';
  user: IEmployee;
};
const Drawer = ({ drawer, setDrawer, displayNotifications, setDisplayNotifications, variant, user }: DrawerType) => {
  const classes = useStyles();

  return (
    <MuiDrawer
      anchor='left'
      className={classes.drawer}
      classes={{ paper: classnames(classes.drawerPaper, classes.removeScrollbar) }}
      onClose={() => setDrawer(false)}
      open={drawer}
      variant={variant}>
      <Box className={classes.removeScrollbar} display='flex' flexDirection='column' padding={theme.spacing(2)}>
        <Box className={classes.gutterBottom}>
          <Image height={34} src={'/trak_logo.svg'} width={120} />
        </Box>
        {!user ? (
          <CircularProgress />
        ) : (
          <LoggedInUserCard
            displayNotifications={displayNotifications}
            firstName={user.firstName}
            image={user.imageUrl}
            lastName={user.lastName}
            setDisplayNotifications={setDisplayNotifications}
            userId={user.id}
          />
        )}
        <Divider />
        {!displayNotifications && (
          <List className={classes.listRoot} component='nav'>
            {urls.map((url) => {
              return <LinkGroup divider={url.divider} key={url.title} links={url.links} setDrawer={setDrawer} title={url.title} />;
            })}
          </List>
        )}
      </Box>
    </MuiDrawer>
  );
};

const Sidebar = () => {
  const [drawer, setDrawer] = useState<boolean>(false);
  const [displayNotifications, setDisplayNotifications] = useState<boolean>(false);
  const { user } = useUser();

  return (
    <>
      <Hidden mdUp>
        <div>
          <IconButton onClick={() => setDrawer(true)} style={{ width: '50px', height: '50px' }}>
            <Menu />
          </IconButton>
        </div>
        <Drawer
          displayNotifications={displayNotifications}
          drawer={drawer}
          setDisplayNotifications={setDisplayNotifications}
          setDrawer={setDrawer}
          user={user}
          variant={'temporary'}
        />
      </Hidden>
      <Hidden mdDown>
        <Drawer
          displayNotifications={displayNotifications}
          drawer={true}
          setDisplayNotifications={setDisplayNotifications}
          setDrawer={() => undefined}
          user={user}
          variant={'permanent'}
        />
      </Hidden>
    </>
  );
};

export default Sidebar;
