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
} from '@mui/material';
import { AppIconButton, AppForm } from '../../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../../utils/form';

import * as yup from 'yup';
import { usersService } from '../../../services/users.service';

import { useApi } from '../../../api/useApi';
import { AppSaveButton } from '../../../components/AppCustomButton';

const createUserSchema = {
  email: yup.string().email('Email inválido'),
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras são permitidas')
    .required('O campo é obrigatório'),
  tenant_name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras são permitidas')
    .required('O campo é obrigatório'),
  school_name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras são permitidas')
    .required('O campo é obrigatório'),
  password: yup.string().min(6, 'Mínimo de 6 caracteres').max(12, 'Máximo de 12 caracteres').required(),
  password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'As senhas não conferem!'),
};

interface FormStateValues {
  name: string;
  email: string;
  tenant_name: string;
  school_name: string;
  password: string;
  password_confirmation?: string;
}

/**
 * Renders "Signup" view
 * url: /auth/signup
 */
const SignupView = () => {
  const history = useHistory();

  const [, , isSaving, createUser] = useApi(usersService.initialRegistration, { isRequest: true });

  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: createUserSchema,
    initialValues: {
      name: '',
      email: '',
      tenant_name: '',
      school_name: '',
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

      console.log(values);

      const response = await createUser(values);

      if (response?.success) {
        return history.replace('/auth/signup/confirm-registration');
      }
    },
    [values, history]
  );

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Grid marginTop={5}></Grid>
      <Card>
        <CardHeader title="Cadastro Inicial da Instituição" />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item md={12} sm={12} xs={12}>
              <TextField
                required
                label="Nome Completo do Responsável"
                name="name"
                value={values.name}
                error={fieldHasError('name')}
                helperText={fieldGetError('name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <TextField
                required
                label="Nome da Rede de Ensino ou Pessoa Jurídica"
                name="tenant_name"
                value={values.tenant_name}
                error={fieldHasError('tenant_name')}
                helperText={fieldGetError('tenant_name') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <TextField
                required
                label="Nome da Instituição de Ensino"
                name="school_name"
                value={values.school_name}
                error={fieldHasError('school_name')}
                helperText={fieldGetError('school_name') || ' '}
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

            <Grid container justifyContent="center" alignItems="center">
              <AppSaveButton
                type="submit"
                loading={isSaving}
                disabled={!(formState.isValid && agree) || isSaving}
                label="Cadastrar"
              ></AppSaveButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default SignupView;
