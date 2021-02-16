export type section = {
  title: string;
  links: link[];
  divider?: boolean;
};

export type link = {
  title: string;
  link: string;
  aria_label: string;
};

export const urls: section[] = [
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
        link: '/mine-ansatte/onboarding',
        aria_label: 'Til mine ansatte på onboarding',
      },
      {
        title: 'Løpende',
        link: '/mine-ansatte/lopende',
        aria_label: 'Til mine ansatte på løpende',
      },
      {
        title: 'Offboarding',
        link: '/mine-ansatte/offboarding',
        aria_label: 'Til mine ansatte på offboarding',
      },
    ],
    divider: true,
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
      },
    ],
    divider: true,
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
      },
    ],
    divider: true,
  },
];

export default urls;
