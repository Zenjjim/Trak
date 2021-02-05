import { Box, Divider, Drawer, List, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import Image from 'next/image';
import React from 'react';
import theme from 'theme';
const sidebarWidth = 200;

const urls = [
  {
    title: 'Mine oppgaver',
    links: [
      {
        title: 'Aktive oppgaver',
        link: '/',
      },
      {
        title: 'Fullførte oppgaver',
        link: '/',
      },
    ],
  },
  {
    title: 'Mine ansatte',
    links: [
      {
        title: 'Onboarding',
        link: '/',
      },
      {
        title: 'Løpende',
        link: '/',
      },
      {
        title: 'Offboarding',
        link: '/',
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
      },
      {
        title: 'Fullførte oppgaver',
        link: '/',
      },
    ],
  },
  {
    title: 'Alle ansatte',
    links: [
      {
        title: 'Onboarding',
        link: '/',
      },
      {
        title: 'Løpende',
        link: '/',
      },
      {
        title: 'Offboarding',
        link: '/',
        divider: true,
      },
    ],
  },
  {
    title: 'Prosessmal',
    links: [
      {
        title: 'Onboarding',
        link: '/',
      },
      {
        title: 'Løpende',
        link: '/',
      },
      {
        title: 'Offboarding',
        link: '/',
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
    backgroundColor: '#A5C8D1',
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
  },
});

type LinkData = {
  title: string;
  url: string;
  divider: boolean;
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
            <ListItem button className={classes.nested} divider={url.divider} key={url.title}>
              <ListItemText className={classes.link} classes={{ secondary: classes.link }} secondary={url.title} />
            </ListItem>
          );
        })}
      </List>
    </>
  );
};

const Sidebar = () => {
  const classes = useStyles();
  return (
    <Drawer anchor='left' className={classes.drawer} classes={{ paper: classes.drawerPaper }} variant='permanent'>
      <Box display='flex' flexDirection='column' padding={theme.spacing(2)}>
        <Image height={34} src={'/trak_logo.png'} width={120} />
        <Box border='1px dotted black' boxShadow={'0px 4px 4px rgba(0,0,0,0.25)'} className={classes.gutterBottom} height='70px' width='100%'>
          <h5>Bilde kommer</h5>
        </Box>
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
