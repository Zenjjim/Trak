// eslint-disable-next-line
const axios = require('axios');

const APP_URL = process.env.APP_URL;
const BASE_URI = 'api/cron/';
const CRON_SECRET = process.env.CRON_SECRET;

axios
  .post(
    `${APP_URL}${BASE_URI}phases`,
    {},
    {
      headers: {
        CRON_SECRET: CRON_SECRET ?? 'secret',
      },
    },
  )
  // eslint-disable-next-line
  .then((res) => console.log(res))
  // eslint-disable-next-line
  .catch((err) => console.log(err.toJSON()));
