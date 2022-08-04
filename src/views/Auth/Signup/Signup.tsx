import { SyntheticEvent, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { AppButton, AppIconButton, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';

import * as yup from 'yup';
import { usersService } from '../../../services/users.service';
import { useAppMessage } from '../../../utils/message';

const createUserSchema = {
  email: yup.string().email('Email inválido'),
  phone: yup.string().required('O campo é obrigatório'),
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras são permitidas')
    .required('O campo é obrigatório'),
  CPF: yup.string(),
  // password: yup.string().min(6, 'Mínimo de 6 caracteres').max(12, 'Máximo de 12 caracteres'),\
  password: yup.string().min(6, 'Mínimo de 6 caracteres').max(12, 'Máximo de 12 caracteres').required(),
  password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'As senhas não conferem!'),
  sex: yup.string().required('O campo é obrigatório'),
  birth: yup.date().required('O campo é obrigatório'),
};

interface FormStateValues {
  name: string;
  sex: 'M' | 'F' | '';
  birth: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation?: string;
}

/**
 * Renders "Signup" view
 * url: /auth/signup
 */
const SignupView = () => {
  const history = useHistory();

  const [isSaving, setIsSaving] = useState(false);

  const [AppMessage, setMessage] = useAppMessage();

  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: createUserSchema,
    initialValues: {
      name: '',
      sex: '',
      birth: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
    } as FormStateValues,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleShowPasswordClick = useCallback(() => {
    setShowPassword((oldValue) => !oldValue);
  }, []);

  const handleAgreeClick = useCallback(() => {
    setAgree((oldValue) => !oldValue);
  }, []);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      setIsSaving(true);

      try {
        await usersService.initialRegistration(values);
        return history.replace('/auth/signup/confirm-registration');
      } catch (err: any) {
        console.log(err);
        setMessage({ type: 'error', text: err.response.data.message });
        setIsSaving(false);
      }
    },
    [values, history]
  );

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Grid marginTop={5}></Grid>
      <Card>
        <CardHeader title="Cadastro de Responsável pela Escola" />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                required
                label="Nome Completo"
                name="name"
                value={values.name}
                error={fieldHasError('name')}
                helperText={fieldGetError('name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required
                // disabled={}
                select
                label="Sexo"
                name="sex"
                value={values.sex}
                onChange={onFieldChange}
                error={fieldHasError('sex')}
                helperText={fieldGetError('sex') || ' '}
                {...SHARED_CONTROL_PROPS}
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Feminino</MenuItem>
              </TextField>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required
                type="date"
                InputLabelProps={{ shrink: true }}
                label="Nascimento"
                name="birth"
                value={values.birth}
                onChange={onFieldChange}
                error={fieldHasError('birth')}
                helperText={fieldGetError('birth') || ' '}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                required
                label="Telefone"
                name="phone"
                value={values.phone}
                error={fieldHasError('phone')}
                helperText={fieldGetError('phone') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
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
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
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
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              {!showPassword && (
                <TextField
                  required
                  type="password"
                  label="Confirm Password"
                  name="password_confirmation"
                  value={values.password_confirmation}
                  error={fieldHasError('password_confirmation')}
                  helperText={fieldGetError('password_confirmation') || ' '}
                  onChange={onFieldChange}
                  {...SHARED_CONTROL_PROPS}
                />
              )}
            </Grid>
            <Grid item md={12} sm={12} xs={12}>
              <FormControlLabel
                control={<Checkbox required name="agree" checked={agree} onChange={handleAgreeClick} />}
                label="Concordo com os termos de uso e políticas de privacidade *"
              />
            </Grid>

            {/* {error ? (
            <AppAlert severity="error" onClose={handleCloseError}>
              {error}
            </AppAlert>
          ) : null} */}
            <Grid item md={12} sm={12} xs={12}>
              <AppMessage />
            </Grid>

            <Grid container justifyContent="center" alignItems="center">
              <AppButton type="submit" loading={isSaving} disabled={!(formState.isValid && agree) || isSaving}>
                Confirmar e Cadastrar
              </AppButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default SignupView;
