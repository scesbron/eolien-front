import React, { useCallback, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import { green } from '@material-ui/core/colors';
import { Controller, useForm } from 'react-hook-form';

import { LOGIN } from '../constants/routes';
import { useQuery } from '../routes/utils';
import useCreatePassword from '../queries/user/use-create-password';
import { getErrors } from '../queries/utils';
import { CreatePasswordProps } from '../types';

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

const ForgottenPassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const query = useQuery();
  const { isSuccess, isLoading, error, mutate: createPassword } = useCreatePassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePasswordProps>({
    defaultValues: {
      username: query.get('username') || '',
    },
  });

  const buttonClass = isSuccess ? classes.buttonSuccess : classes.button;

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => navigate(LOGIN), 1000);
    }
  }, [navigate, isSuccess]);

  const onSubmit = useCallback(
    ({ username }: CreatePasswordProps) => {
      createPassword({ username });
    },
    [createPassword],
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
          <Typography variant='h4'>Mot de passe oublié</Typography>
          <Typography>
            Indiquez votre nom d&apos;utilisateur pour recevoir par email un lien pour réinitialiser
            votre mot de passe.
          </Typography>
        </div>
        {!!error && (
          <Alert variant='filled' severity='error'>
            {getErrors(error).join('\n')}
          </Alert>
        )}
        <Controller
          name='username'
          control={control}
          rules={{
            required: "Le nom d'utilisateur est obligatoire",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Nom d'utilisateur"
              error={!!errors.username}
              helperText={errors.username?.message}
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
          {isSuccess ? 'Email de réinitialisation envoyé' : 'Envoyer'}
        </Button>
        <Link component={RouterLink} to={LOGIN} className={classes.link}>
          Connexion
        </Link>
      </form>
    </div>
  );
};
export default ForgottenPassword;
