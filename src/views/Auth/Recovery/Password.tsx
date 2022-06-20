import { SyntheticEvent, useCallback, useState } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent } from '@mui/material';
import { AppButton, AppAlert, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../../utils/form';

import * as yup from 'yup';

const formSchema = {
  email: yup.string().email('Email inválido'),
};

interface FormStateValues {
  email: string;
}

interface Props {
  email?: string;
}

/**
 * Renders "Recover Password" view for Login flow
 * url: /auth/recovery/password
 * @param {string} [props.email] - pre-populated email in case the user already enters it
 */
const RecoveryPasswordView = ({ email = '' }: Props) => {
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: formSchema,
    initialValues: { email } as FormStateValues,
  });
  const [message, setMessage] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleFormSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    // await api.auth.recoverPassword(values);

    //Show message with instructions for the user
    setMessage('Um email com instruções foi enviado para você');
  };

  const handleCloseError = useCallback(() => setMessage(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader title="Recuperar Senha" />
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

          {message ? (
            <AppAlert severity="success" onClose={handleCloseError}>
              {message}
            </AppAlert>
          ) : null}

          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!formState.isValid}>
              Enviar email de recuperação de senha
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default RecoveryPasswordView;
