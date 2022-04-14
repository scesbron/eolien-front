import React, { useCallback, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from 'mui-rff';
import { Form } from 'react-final-form';
import { Alert } from '@material-ui/lab';
import Typography from '@material-ui/core/Typography';
import { useHistory } from 'react-router-dom';
import { green } from '@material-ui/core/colors';

import { LOGIN } from '../constants/routes';
import { useQuery } from '../routes/utils';
import useUpdatePassword from '../queries/user/use-update-password';
import { getErrors } from '../queries/utils';

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

const NewPassword = () => {
  const classes = useStyles();
  const history = useHistory();
  const query = useQuery();
  const { isSuccess, isLoading, error, mutate: updatePassword } = useUpdatePassword();

  const buttonClass = isSuccess ? classes.buttonSuccess : classes.button;

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => history.push(LOGIN), 1000);
    }
  }, [history, isSuccess]);

  const onSubmit = useCallback(
    ({ password, confirmation }) => {
      updatePassword({ token: query.get('token'), password, confirmation });
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
            {!!error && (
              <Alert variant='filled' severity='error'>
                {getErrors(error).join('\n')}
              </Alert>
            )}
            <TextField label='Nouveau mot de passe' type='password' name='password' />
            <TextField label='Confirmez votre mot de passe' type='password' name='confirmation' />
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
        )}
      </Form>
    </div>
  );
};

export default NewPassword;
