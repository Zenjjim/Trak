export const fetcher = (url) => fetch(url).then((res) => res.json());

export const axiosBuilder = (axiosFunc: Promise<unknown>, text: string, router, showProgressbar, showSnackbar, closeModal) => {
  showProgressbar(true);
  axiosFunc
    .then(() => {
      closeModal();
      router.replace(router.asPath).finally(() => {
        showProgressbar(false);
        showSnackbar(text, 'success');
      });
    })
    .catch((error) => {
      showProgressbar(false);
      showSnackbar(error.response.data.message, 'error');
    });
};
