import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from 'mui-rff';
import { Form } from 'react-final-form';
import { Alert } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { green } from '@material-ui/core/colors';

import * as duck from '../ducks/user';
import { LOGIN } from '../constants/routes';
import { useQuery } from '../routes/utils';
import { RootState } from '../types';

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

type ValidateValues = {
  password?: string;
  confirmation?: string;
};

const validate = (values: ValidateValues) => {
  const errors: Partial<ValidateValues> = {};
  if (!values.password) {
    errors.password = 'Le nouveau mot de passe est obligatoire';
  }
  if (!values.confirmation) {
    errors.confirmation = 'La confirmation du mot de passe est obligatoire';
  }
  if (values.password && values.confirmation && values.password !== values.confirmation) {
    errors.confirmation = 'Les deux mots de passe doivent être identiques';
  }
  return errors;
};

type NewPasswordProps = {
  updating: boolean;
  updated: boolean;
  errors: string[];
  updatePassword: (token: string | null, password: string, confirmation: string) => void;
  setErrors: () => void;
};

const NewPassword = ({
  updating,
  updated,
  errors,
  updatePassword,
  setErrors,
}: NewPasswordProps) => {
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const buttonClass = success ? classes.buttonSuccess : classes.button;

  useEffect(() => {
    setErrors();
  }, [setErrors]);
  useEffect(() => {
    if (submitted && updated) {
      setSuccess(true);
      setTimeout(() => history.push(LOGIN), 1000);
    }
  }, [history, submitted, updated]);

  const onSubmit = useCallback(
    (values) => {
      setSubmitted(true);
      updatePassword(query.get('token'), values.password, values.confirmation);
    },
    [updatePassword, query],
  );

  return (
    <div className={classes.container}>
      <Form onSubmit={onSubmit} validate={validate}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className={classes.form}>
            <img
              src={`${process.env.PUBLIC_URL}/images/logo.png`}
              alt='Logo'
              className={classes.logo}
            />
            <div className={classes.intro}>
              <Typography variant='h4'>Changez votre mot de passe</Typography>
            </div>
            {errors.length > 0 && (
              <Alert variant='filled' severity='error'>
                {errors.join('\n')}
              </Alert>
            )}
            <TextField label='Nouveau mot de passe' type='password' name='password' />
            <TextField label='Confirmez votre mot de passe' type='password' name='confirmation' />
            <Button
              type='submit'
              variant='contained'
              color='primary'
              className={buttonClass}
              disabled={updating}
            >
              {success ? 'Mot de passe modifié' : 'Changer mon mot de passe'}
            </Button>
          </form>
        )}
      </Form>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  updating: state.user.passwordUpdating,
  updated: state.user.passwordUpdated,
  errors: state.user.errors,
});

const mapDispatchToProps = {
  updatePassword: duck.updatePassword,
  setErrors: duck.setErrors,
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);
