import { Avatar, Badge, Box, Divider, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import theme from 'theme';

import Typo from './Typo';

const sidebarWidth = 190;

const urls: LinkGroupProps[] = [
  {
    title: 'Mine oppgaver',
    links: [
      {
        title: 'Aktive oppgaver',
        link: '/',
        aria_label: 'Til mine aktive oppgaver',
      },
      {
        title: 'Fullførte oppgaver',
        link: '/',
        aria_label: 'Til mine fullførte oppgaver',
      },
    ],
  },
  {
    title: 'Mine ansatte',
    links: [
      {
        title: 'Onboarding',
        link: '/',
        aria_label: 'Til mine ansatte på onboarding',
      },
      {
        title: 'Løpende',
        link: '/',
        aria_label: 'Til mine ansatte på løpende',
      },
      {
        title: 'Offboarding',
        link: '/',
        aria_label: 'Til mine ansatte på offboarding',
        divider: true,
      },
    ],
  },
  {
    title: 'Alle oppgaver',
    links: [
      {
        title: 'Aktive oppgaver',
        link: '/',
        aria_label: 'Til alle aktive oppgaver',
      },
      {
        title: 'Fullførte oppgaver',
        link: '/',
        aria_label: 'Til alle fullførte oppgaver',
      },
    ],
  },
  {
    title: 'Alle ansatte',
    links: [
      {
        title: 'Onboarding',
        link: '/',
        aria_label: 'Til alle ansatte på onboarding',
      },
      {
        title: 'Løpende',
        link: '/',
        aria_label: 'Til alle ansatte på løpende',
      },
      {
        title: 'Offboarding',
        link: '/',
        aria_label: 'Til alle ansatte på offboarding',
        divider: true,
      },
    ],
  },
  {
    title: 'Prosessmal',
    links: [
      {
        title: 'Onboarding',
        link: '/prosessmal/onboarding',
        aria_label: 'Til onboarding prosessmalen',
      },
      {
        title: 'Løpende',
        link: '/prosessmal/lopende',
        aria_label: 'Til løpende prosessmalen',
      },
      {
        title: 'Offboarding',
        link: '/prosessmal/offboarding',
        aria_label: 'Til offboarding prosessmalen',
        divider: true,
      },
    ],
  },
];

const useStyles = makeStyles({
  drawer: {
    width: sidebarWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: sidebarWidth,
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

type LinkData = {
  title: string;
  link: string;
  divider?: boolean;
  aria_label: string;
};

type LinkGroupProps = {
  title: string;
  links: LinkData[];
};

const LinkGroup = ({ title, links }: LinkGroupProps) => {
  const classes = useStyles();
  return (
    <>
      <ListItemText color='disabled' primary={title} />
      <List component='div' disablePadding>
        {links.map((url: LinkData) => {
          return (
            <ListItem button className={classes.nested} component='a' divider={url.divider} key={url.title} role='nav'>
              <Link href={url.link}>
                <ListItemText aria-label={url.aria_label} classes={{ secondary: classes.link }} secondary={url.title} />
              </Link>
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

const LoggedInUserCard = () => {
  const classes = useStyles();
  return (
    <Box
      alignItems='center'
      bgcolor={theme.palette.background.paper}
      boxShadow={'0px 4px 4px rgba(0,0,0,0.25)'}
      className={classes.gutterBottom}
      display='flex'
      height='70px'
      mx={'-' + theme.spacing(2)}
      padding={theme.spacing(1)}>
      <Box flexGrow={1}>
        <Badge badgeContent={4} className={classes.badge} color='error'>
          <Avatar alt='M.S' src='/dummy_avatar.png' />
        </Badge>
      </Box>
      <Box flexGrow={4}>
        <Typo variant='body2'>Even K.</Typo>
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
        <LoggedInUserCard />
        <Divider />
        <List className={classes.listRoot} component='nav'>
          {urls.map((url) => {
            return <LinkGroup key={url.title} links={url.links} title={url.title} />;
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
