import { Button, Checkbox as MuiCheckbox, FormControlLabel, FormGroup, makeStyles } from '@material-ui/core';
import axios from 'axios';
import TextField from 'components/form/TextField';
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
    const mySettings = await prisma.employeeSettings.findUnique({
      where: {
        employeeId: session?.user?.id,
      },
    });
    return { props: { mySettings } };
  } catch (err) {
    const mySettings = await prisma.employeeSettings.create({
      data: {
        employeeId: session?.user?.id,
      },
    });
    return { props: { mySettings } };
  }
};

const Settings = ({ mySettings }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const classes = useStyles();
  const { user } = useUser();
  const showSnackbar = useSnackbar();

  const defaultNotificationSettingsValue = mySettings.notificationSettings.reduce((object, key) => ((object[key] = true), object), {});

  const { register, errors, control, handleSubmit } = useForm({
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
    const notificationSettings = Object.keys(NotificationType).filter((key) => {
      return Object.entries(data).some((arr) => {
        if (arr[0] === key) {
          return arr[1];
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
            <TextField errors={errors} fullWidth={false} label='Slack member id' name='slack' register={register} />
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
