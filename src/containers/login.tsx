import React from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Checkboxes, TextField } from 'mui-rff';
import { Form } from 'react-final-form';
import { Alert } from '@material-ui/lab';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';

import { FORGOTTEN_PASSWORD } from '../constants/routes';
import useAuth from '../hooks/use-auth';

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
  const { login, isLoading, errors } = useAuth();

  return (
    <div className={classes.container}>
      <Form onSubmit={login}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className={classes.form}>
            <img
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
              alt='Logo'
              className={classes.logo}
            />
            {errors.length > 0 && (
              <Alert variant='filled' severity='error'>
                {errors.join('\n')}
              </Alert>
            )}
            <TextField label="Nom d'utilisateur" name='username' required />
            <TextField label='Mot de passe' type='password' name='password' required />
            <Checkboxes
              name='rememberMe'
              color='primary'
              data={[{ label: 'Se rappeler de moi', value: true }]}
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
        )}
      </Form>
    </div>
  );
};
export default Login;
