module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/mine-oppgaver?fullfort=false',
        permanent: true,
      },
    ];
  },
};
