import React, { useCallback, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Checkboxes, TextField } from 'mui-rff';
import { Form } from 'react-final-form';
import { Alert } from '@material-ui/lab';
import Link from '@material-ui/core/Link';
import { connect } from 'react-redux';
import { useHistory, useLocation, Link as RouterLink } from 'react-router-dom';

import * as duck from '../ducks/user';
import { CustomLocation, RootState, User } from '../types';
import { FORGOTTEN_PASSWORD } from '../constants/routes';

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

type LoginProps = {
  user?: User;
  loading: boolean;
  errors: string[];
  login: (username: string, password: string, rememberMe?: boolean) => void;
  setErrors: () => void;
};

const Login = ({ user, loading, errors, login, setErrors }: LoginProps) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    setErrors();
  }, [setErrors]);

  useEffect(() => {
    if (user) {
      const from = (location as CustomLocation).state.from || { pathname: '/' };
      history.replace(from);
    }
  }, [user, history, location]);

  const onSubmit = useCallback(
    (values) => {
      login(values.username, values.password, values.rememberMe);
    },
    [login],
  );

  return (
    <div className={classes.container}>
      <Form onSubmit={onSubmit}>
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
              disabled={loading}
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

const mapStateToProps = (state: RootState) => ({
  user: state.user.current,
  loading: state.user.loading,
  errors: state.user.errors,
});

const mapDispatchToProps = {
  login: duck.login,
  setErrors: duck.setErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
