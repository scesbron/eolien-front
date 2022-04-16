import React, { useCallback, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import { green } from '@material-ui/core/colors';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';

import { LOGIN } from '../constants/routes';
import { useQuery } from '../routes/utils';
import useUpdatePassword from '../queries/user/use-update-password';
import { getErrors } from '../queries/utils';
import { UpdatePasswordProps } from '../types';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
  },
  form: {
    maxWidth: '30rem',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  button: {
    marginTop: '1rem',
  },
  buttonSuccess: {
    marginTop: '1rem',
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  intro: {
    textAlign: 'center',
    marginTop: '1rem',
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
  },
});

const NewPassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const query = useQuery();
  const { isSuccess, isLoading, error, mutate: updatePassword } = useUpdatePassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<UpdatePasswordProps>({
    defaultValues: {
      password: '',
      confirmation: '',
    },
  });

  const buttonClass = isSuccess ? classes.buttonSuccess : classes.button;

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => navigate(LOGIN), 1000);
    }
  }, [navigate, isSuccess]);

  const onSubmit = useCallback(
    ({ password, confirmation }: UpdatePasswordProps) => {
      updatePassword({ token: query.get('token'), password, confirmation });
    },
    [updatePassword, query],
  );

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <img
          src={`${process.env.PUBLIC_URL}/images/logo.png`}
          alt='Logo'
          className={classes.logo}
        />
        <div className={classes.intro}>
          <Typography variant='h4'>Changez votre mot de passe</Typography>
        </div>
        {!!error && (
          <Alert variant='filled' severity='error'>
            {getErrors(error).join('\n')}
          </Alert>
        )}
        <Controller
          name='password'
          control={control}
          rules={{
            required: 'Le nouveau mot de passe est obligatoire',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label='Nouveau mot de passe'
              type='password'
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
        <Controller
          name='confirmation'
          control={control}
          rules={{
            required: 'La confirmation du mot de passe est obligatoire',
            validate: {
              matchesPreviousPassword: (value) => {
                const { password } = getValues();
                return password === value || 'Les deux mots de passe doivent être identiques';
              },
            },
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label='Confirmez votre mot de passe'
              type='password'
              error={!!errors.confirmation}
              helperText={errors.confirmation?.message}
            />
          )}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          className={buttonClass}
          disabled={isLoading}
        >
          {isSuccess ? 'Mot de passe modifié' : 'Changer mon mot de passe'}
        </Button>
      </form>
    </div>
  );
};

export default NewPassword;
