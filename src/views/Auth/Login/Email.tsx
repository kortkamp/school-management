import { SyntheticEvent, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Grid, TextField, Card, CardHeader, CardContent, InputAdornment } from '@mui/material';
import { useAppStore } from '../../../store';
import { AppButton, AppLink, AppIconButton, AppAlert, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';
import { sessionService } from '../../../services/auth.service';

import * as yup from 'yup';

const formSchema = {
  email: yup.string().email('Email inválido'),
  password: yup.string().min(6, 'Mínimo de 6 caracteres').max(12, 'Máximo de 12 caracteres'),
};

interface FormStateValues {
  email: string;
  password: string;
}

/**
 * Renders "Login with Email" view for Login flow
 * url: /auth/login/email/*
 */
const LoginEmailView = () => {
  const history = useHistory();
  const [, dispatch] = useAppStore();
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: formSchema,
    initialValues: { email: '', password: '' } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      try {
        const result = await sessionService.loginWithEmail(values);
        dispatch({ type: 'LOG_IN', payload: result });

        if (result.schools.length === 1) {
          dispatch({ type: 'SELECT_SCHOOL', payload: result.schools[0] });
        }

        history.replace('/');
      } catch (err) {
        setError('Please check email and password');
      }
    },
    [dispatch, values, history]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Grid marginTop={10}>
        <Card>
          <CardHeader title="Entrar com Email" />
          <CardContent>
            <TextField
              required
              label="Email"
              name="email"
              value={values.email}
              error={fieldHasError('email')}
              helperText={fieldGetError('email') || ' '}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
            />
            <TextField
              required
              type={showPassword ? 'text' : 'password'}
              label="Password"
              name="password"
              value={values.password}
              error={fieldHasError('password')}
              helperText={fieldGetError('password') || ' '}
              onChange={onFieldChange}
              {...SHARED_CONTROL_PROPS}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <AppIconButton
                      aria-label="toggle password visibility"
                      icon={showPassword ? 'visibilityon' : 'visibilityoff'}
                      title={showPassword ? 'Hide Password' : 'Show Password'}
                      onClick={handleShowPasswordClick}
                      onMouseDown={eventPreventDefault}
                    />
                  </InputAdornment>
                ),
              }}
            />
            {error ? (
              <AppAlert severity="error" onClose={handleCloseError}>
                {error}
              </AppAlert>
            ) : null}
            <Grid container justifyContent="center" alignItems="center">
              <AppButton type="submit" disabled={!formState.isValid}>
                Entrar com Email
              </AppButton>
              <Button variant="text" color="inherit" component={AppLink} to="/auth/recovery/password">
                Esqueci minha senha
              </Button>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </AppForm>
  );
};

export default LoginEmailView;
