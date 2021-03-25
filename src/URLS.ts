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
        link: '/mine-oppgaver?fullfort=false',
        aria_label: 'Til mine aktive oppgaver',
      },
      {
        title: 'Fullførte oppgaver',
        link: '/mine-oppgaver?fullfort=true',
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
        link: '/alle-oppgaver?fullfort=false',
        aria_label: 'Til alle aktive oppgaver',
      },
      {
        title: 'Fullførte oppgaver',
        link: '/alle-oppgaver?fullfort=true',
        aria_label: 'Til alle fullførte oppgaver',
      },
    ],
  },
  {
    title: 'Alle ansatte',
    links: [
      {
        title: 'Onboarding',
        link: '/alle-ansatte/onboarding',
        aria_label: 'Til alle ansatte på onboarding',
      },
      {
        title: 'Løpende',
        link: '/alle-ansatte/lopende',
        aria_label: 'Til alle ansatte på løpende',
      },
      {
        title: 'Offboarding',
        link: '/alle-ansatte/offboarding',
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
