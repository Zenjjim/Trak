import { Box, Button, makeStyles, Tooltip } from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import axios from 'axios';
import BeforeToogle from 'components/form/BeforeToggle';
import TextField from 'components/form/TextField';
import Modal from 'components/Modal';
import Typo from 'components/Typo';
import useProgressbar from 'context/Progressbar';
import useSnackbar from 'context/Snackbar';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IProcessTemplate } from 'utils/types';
import { axiosBuilder } from 'utils/utils';

type PhaseModalProps = {
  processTemplate: IProcessTemplate;
  modalIsOpen: boolean;
  closeModal: () => void;
  phase_id?: string;
};

type PhaseData = {
  title: string;
  before: 'true' | 'false';
  dueDateDayOffset: number;
  dueDate: string;
  cronDate?: string;
};

const useStyles = makeStyles((theme) => ({
  grid: {
    display: 'grid',
    gridTemplateRows: 'auto',
    rowGap: 32,
  },
  error: {
    color: theme.palette.error.main,
  },
}));

const PhaseModal = ({ processTemplate, modalIsOpen, closeModal, phase_id = undefined }: PhaseModalProps) => {
  const classes = useStyles();
  const router = useRouter();
  const showSnackbar = useSnackbar();
  const showProgressbar = useProgressbar();
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

  const [phase, setPhase] = useState<PhaseData | undefined>(undefined);
  const { register, handleSubmit, control, errors, reset } = useForm({
    reValidateMode: 'onChange',
    defaultValues: useMemo(
      () => ({
        title: phase?.title,
        dueDateDayOffset: phase?.dueDateDayOffset,
        before: phase?.before,
        dueDate: phase?.dueDate,
        cronDate: phase?.cronDate,
      }),
      [phase],
    ),
  });

  useEffect(() => {
    if (phase_id) {
      axios.get(`/api/phases/${phase_id}`).then((res) => {
        setPhase({
          ...res.data,
          dueDate: moment(res.data.dueDate).format('yyyy-MM-DD'),
          before: res.data.dueDateDayOffset <= 0 ? 'true' : 'false',
          dueDateDayOffset: Math.abs(res.data.dueDateDayOffset),
          cronDate: moment(res.data.cronDate).format('yyyy-MM-DD'),
        });
      });
    }
  }, [phase_id]);

  useEffect(() => {
    reset({
      title: phase?.title,
      dueDateDayOffset: phase?.dueDateDayOffset,
      before: phase?.before,
      dueDate: phase?.dueDate,
      cronDate: phase?.cronDate,
    });
  }, [phase]);

  const axiosPhaseModal = (axiosFunc: Promise<unknown>, text: string) => {
    axiosBuilder(axiosFunc, text, router, showProgressbar, showSnackbar, closeModal);
  };

  const onSubmit = handleSubmit((formData: PhaseData) => {
    const data = {
      data: {
        ...formData,
        dueDate: new Date(formData.dueDate),
        dueDateDayOffset: formData.before === 'true' ? -Math.abs(formData.dueDateDayOffset) : Math.abs(formData.dueDateDayOffset),
        cronDate: new Date(formData.cronDate),
      },
      processTemplateId: processTemplate.id,
    };
    if (phase_id) {
      axiosPhaseModal(axios.put(`/api/phases/${phase_id}`, data), 'Fasen ble oppdatert');
    } else {
      axiosPhaseModal(axios.post('/api/phases', data), 'Fasen ble opprettet');
    }
  });
  const buttonGroup = confirmDelete
    ? [
        <Typo key={'text'}>Er du sikker?</Typo>,
        <Button key={'cancel'} onClick={() => setConfirmDelete(false)} type='button'>
          Avbryt
        </Button>,
        <Button
          className={classes.error}
          color='inherit'
          key={'delete'}
          onClick={() => axiosPhaseModal(axios.delete(`/api/phases/${phase_id}`), 'Fase slettet')}
          type='button'>
          Slett
        </Button>,
      ]
    : [
        <Button key={'cancel'} onClick={closeModal} type='button'>
          Avbryt
        </Button>,
        phase_id && (
          <Button className={classes.error} color='inherit' key={'delete'} onClick={() => setConfirmDelete(true)} type='button'>
            Slett
          </Button>
        ),
        <Button key={'create'} type='submit'>
          {phase_id ? 'Oppdater' : 'Opprett'}
        </Button>,
      ];
  return (
    <Modal
      buttonGroup={buttonGroup}
      header={phase_id ? 'Oppdater prosess' : 'Lag prosess'}
      onClose={closeModal}
      onSubmit={onSubmit}
      open={modalIsOpen}
      subheader={
        <>
          til <b>{processTemplate.title}</b>
        </>
      }>
      <div className={classes.grid}>
        <TextField
          errors={errors}
          label='Prosesstittel'
          name='title'
          register={register}
          required
          rules={{
            required: 'Prosesstittel er påkrevd',
          }}
        />
        {(processTemplate.slug === 'onboarding' || processTemplate.slug === 'offboarding') && (
          <div>
            <Typo variant='body1'>
              Forfaller{' '}
              <Tooltip
                title={`Når oppgavene i fasen skal ha forfallsdato basert på ${processTemplate.slug === 'onboarding' ? `ansettelsdato` : `termineringsdato`} `}>
                <HelpIcon fontSize='small' />
              </Tooltip>
            </Typo>
            <Box display='flex'>
              <TextField
                errors={errors}
                inputProps={{ min: 0 }}
                label=''
                name='dueDateDayOffset'
                placeholder='dager...'
                register={register}
                required
                rules={{
                  min: {
                    value: 0,
                    message: 'Må være stlrre eller lik 0',
                  },
                }}
                type='number'
              />
              <BeforeToogle control={control} name='before' />
              <Typo variant='body1'>{processTemplate.slug === 'onboarding' ? 'ansettelsesdato' : 'termineringsdato'}</Typo>
            </Box>
          </div>
        )}
        {processTemplate.slug === 'lopende' && (
          <>
            <TextField
              defaultValue={moment().format('yyyy-MM-DD')}
              errors={errors}
              inputProps={{ min: `${new Date().getFullYear()}-01-01`, max: `${new Date().getFullYear()}-12-31` }}
              label={
                <>
                  Forfallsdato{' '}
                  <Tooltip title='Forfallsdato for alle tilhørende oppgaver'>
                    <HelpIcon />
                  </Tooltip>
                </>
              }
              name={'dueDate'}
              register={register}
              type='date'
            />
            <TextField
              defaultValue={moment().format('yyyy-MM-DD')}
              errors={errors}
              inputProps={{ min: `${new Date().getFullYear()}-01-01`, max: `${new Date().getFullYear()}-12-31` }}
              label={
                <>
                  Automatisk opprettelse
                  <Tooltip title='Dato for automatisk opprettelse av oppgaver i fasen. På denne datoen vil alle oppgavene i fasen bli opprettet for alle ansatte'>
                    <HelpIcon />
                  </Tooltip>
                </>
              }
              name={'cronDate'}
              register={register}
              type='date'
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default PhaseModal;
