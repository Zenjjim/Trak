import { Avatar, Badge, Box, Divider, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import classNames from 'classnames';
import Typo from 'components/Typo';
import Image from 'next/image';
import Link from 'next/link';
import theme from 'theme';
import urls, { link, section } from 'URLS';

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
  badge: {
    cursor: 'pointer',
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

type LoggedInUserCardProps = {
  fullName: string;
  image?: string;
};

const LoggedInUserCard = ({ fullName, image }: LoggedInUserCardProps) => {
  const classes = useStyles();
  const names = fullName.split(' ');
  const name = names[0] + ' ' + names[1][0] + '.';

  return (
    <Box
      alignItems='center'
      bgcolor={theme.palette.background.paper}
      boxShadow={'0px 4px 4px rgba(0,0,0,0.25)'}
      className={classNames(classes.gutterBottom, classes.badge)}
      display='flex'
      height='70px'
      mx={'-' + theme.spacing(2)}
      padding={theme.spacing(1)}>
      <Box flexGrow={1}>
        <Badge badgeContent={4} color='error'>
          <Avatar alt={'Logged in user photo'} src={image ? image : '/dummy_avatar.png'} />
        </Badge>
      </Box>
      <Box flexGrow={4}>
        <Typo variant='body2'>{name}</Typo>
      </Box>
    </Box>
  );
};

const Sidebar = () => {
  const classes = useStyles();
  return (
    <Drawer anchor='left' className={classes.drawer} classes={{ paper: classes.drawerPaper }} variant='permanent'>
      <Box display='flex' flexDirection='column' padding={theme.spacing(2)}>
        <Box className={classes.gutterBottom}>
          <Image height={34} src={'/trak_logo.png'} width={120} />
        </Box>
        <LoggedInUserCard fullName={'Max Torre Schau'} />
        <Divider />
        <List className={classes.listRoot} component='nav'>
          {urls.map((url) => {
            return <LinkGroup divider={url.divider} key={url.title} links={url.links} title={url.title} />;
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
