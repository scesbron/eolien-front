import React from 'react';
import { Button, Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import { FORGOTTEN_PASSWORD } from '../constants/routes';
import useAuth from '../hooks/use-auth';
import { LoginProps } from '../types';

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
  link: {
    textAlign: 'center',
    marginTop: '1rem',
  },
});

const Login = () => {
  const classes = useStyles();
  const { login, isLoading, errors: authErrors } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginProps>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit(login)} className={classes.form}>
        <img
          src={`${process.env.PUBLIC_URL}/images/logo.png`}
          alt='Logo'
          className={classes.logo}
        />
        {authErrors.length > 0 && (
          <Alert variant='filled' severity='error'>
            {authErrors.join('\n')}
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
        <Controller
          name='password'
          control={control}
          rules={{
            required: 'Le mot de passe est obligatoire',
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label='Mot de passe'
              type='password'
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          )}
        />
        <Controller
          name='rememberMe'
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <FormControlLabel
              control={<Checkbox {...field} color='primary' />}
              label='Se rappeler de moi'
            />
          )}
        />
        <Button
          type='submit'
          variant='contained'
          color='primary'
          className={classes.button}
          disabled={isLoading}
        >
          Connexion
        </Button>
        <Link component={RouterLink} to={FORGOTTEN_PASSWORD} className={classes.link}>
          Mot de passe oublié ?
        </Link>
      </form>
    </div>
  );
};
export default Login;
