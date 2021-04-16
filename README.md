![Trak](./public/trak_logo.svg)

![CI](https://github.com/blitz-js/superjson/workflows/CI/badge.svg)
![CI](https://img.shields.io/github/license/Zenjjim/Trak)

![Jokes Card](https://readme-jokes.vercel.app/api)

## Om Trak
Trak (\ ˈtrack \) er et minimalistisk HR-system som har fokus på at de HR skal få mest mulig hjelp til å passe på sine ansatte. Trak hovedfunksjonalitet er å ha oversikt over arbeidsoppgaver, automatisk opprettelse av oppgaver og sende ut notifikasjoner.

## Installasjon
### Forutsetninger
- Node 15.6.0 eller høyere
- Yarn 1.22.10 eller høyere
- Docker eller ekstern PostgreSQL database

### Oppsett
Start med å clone prosjektet og installere avhengigheter:
```
git clone https://github.com/Zenjjim/Trak.git
cd Trak
yarn
```

Deretter kan du lage en ```.env``` i root og fylle med egne legitimasjoner:
```
DATABASE_URL=SUPER_SECRET_SECRET

CRON_SECRET=SUPER_SECRET_SECRET
JWT_SECRET=SUPER_SECRET_SECRET

SLACK_TOKEN=xoxb-SUPER_SECRET_SECRET

GOOGLE_ID=SUPER_SECRET_SECRET
GOOGLE_SECRET=SUPER_SECRET_SECRET
```
> Google legitimasjon kan lages på [google console](https://console.cloud.google.com/) under *APIs & Services* > *Credentials* > *OAuth 2.0 Client IDs*

> Hvis du bruker Docker: `DATABASE_URL=postgres://postgres:password@localhost:5432/trak` 

(Optional) Dersom du bruker Docker:
```
yarn createdb
```

Migrering av database:
```
npx prisma generate
yarn push
```

(Optional) Legg inn fixtures:
```
yarn loaddata
```

Da gjenstår det kun å starte serveren:
```
yarn dev
```

