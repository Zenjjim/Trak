import { Button, Checkbox as MuiCheckbox, FormControlLabel, FormGroup, makeStyles } from '@material-ui/core';
import axios from 'axios';
import Typo from 'components/Typo';
import useSnackbar from 'context/Snackbar';
import { useUser } from 'context/User';
import prisma from 'lib/prisma';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { getSession } from 'next-auth/client';
import { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import theme from 'theme';
import { NotificationType } from 'utils/types';

const useStyles = makeStyles({
  root: {
    marginLeft: '30px',
    marginTop: '60px',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    lineHeight: 0.7,
  },
  grid: {
    display: 'grid',
  },
});

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  try {
    const mySettings = await prisma.employeeSettings.upsert({
      where: {
        employeeId: session?.user?.id,
      },
      update: {},
      create: {
        employeeId: session?.user?.id,
      },
    });
    return { props: { mySettings } };
  } catch (err) {
    return { props: {} };
  }
};

const Settings = ({ mySettings }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  const { user } = useUser();
  const showSnackbar = useSnackbar();

  const defaultNotificationSettingsValue = mySettings.notificationSettings.reduce((object, key) => ((object[key] = true), object), {});

  const { control, handleSubmit } = useForm({
    reValidateMode: 'onChange',
    defaultValues: useMemo(
      () => ({
        slack: mySettings.slack,
        ...defaultNotificationSettingsValue,
      }),
      [mySettings],
    ),
  });

  const onSubmit = handleSubmit((data) => {
    const NotificationTypeArray = Object.keys(NotificationType);
    const notificationSettings = NotificationTypeArray.filter((notificationType) => {
      return Object.entries(data).some((arr) => {
        const data_name = arr[0];
        const data_value = arr[1];
        if (data_name === notificationType) {
          return data_value;
        }
      });
    });
    const updateData = {
      slack: data.slack,
      notificationSettings: notificationSettings,
    };
    axios
      .put(`/api/employee/${user?.id}/settings`, updateData)
      .then(() => {
        showSnackbar('Innstillinger er oppdatert', 'success');
      })
      .catch((error) => {
        showSnackbar(error.response?.data?.message, 'error');
      });
  });

  return (
    <>
      <Head>
        <title>Innstillinger</title>
      </Head>
      <div className={classes.root}>
        <div className={classes.header}>
          <Typo className={classes.title} variant='h1'>
            Innstillinger
          </Typo>
        </div>
        <form noValidate onSubmit={onSubmit}>
          <div>
            <Checkbox control={control} key={'slack'} label='Jeg ønsker varslinger på Slack' name={'slack'} />
            <div style={{ padding: `${theme.spacing(4)} 0` }}>
              <Typo variant='h2'>Send notifikasjon når:</Typo>
              <FormGroup>
                {Object.keys(NotificationType).map((key) => {
                  return <Checkbox control={control} key={key} label={NotificationType[key]} name={key} />;
                })}
              </FormGroup>
            </div>
            <Button color='primary' size='large' type='submit' variant='outlined'>
              Lagre
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

const Checkbox = ({ name, label, control }) => {
  return (
    <FormControlLabel
      control={
        <Controller
          control={control}
          defaultValue={false}
          name={name}
          render={({ onChange, value }) => <MuiCheckbox checked={value} onChange={(e) => onChange(e.target.checked)} />}
        />
      }
      label={label}
    />
  );
};

export default Settings;
