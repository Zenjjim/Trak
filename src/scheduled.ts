const CRON_SECRET = process.env.CRON_SECRET;
const BASE_URI = 'api/cron/';

fetch(`${BASE_URI}/phases`, {
  headers: {
    CRON_SECRET: CRON_SECRET,
  },
});
export {};
