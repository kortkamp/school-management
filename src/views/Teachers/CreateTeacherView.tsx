import { SyntheticEvent, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, CardHeader, MenuItem } from '@mui/material';

import * as yup from 'yup';

import { AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import AppStepSelector from '../../components/AppStepSelector';
import { teachersService } from '../../services/teachers.service';
import { useAppMessage } from '../../utils/message';
import AppAddressForm from '../../components/AppAddressForm/AppAddressForm';

const createTeacherMainSchema = {
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras')
    .required('O campo é obrigatório'),
  birth: yup.date().required('O campo é obrigatório'),
  CPF: yup.string().required('O campo é obrigatório'),
  phone: yup.string().required('O campo é obrigatório'),
  sex: yup.string().required('O campo é obrigatório'),
};

const complementaryDataSchema = {
  email: yup.string().email('Email inválido').required('O campo é obrigatório'),
  password: yup
    .string()
    .min(6, 'Mínimo de 6 caracteres')
    .max(12, 'Máximo de 12 caracteres')
    .required('O campo é obrigatório'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As senhas não conferem!')
    .required('O campo é obrigatório'),
};

interface FormStateValues {
  email: string;
  name: string;
  enroll_id?: string; // unique
  CPF?: string; // unique
  phone?: string;
  sex: 'M' | 'F' | '';
  birth: string;
  willLogin: boolean;
  password: string;
  password_confirmation: string;
  segment_id?: string;
  grade_id?: string;
  class_group_id?: string;
}

/**
 * Renders "Create Teacher" view
 * url: /professores/criar
 */
function CreateTeacherView() {
  const history = useHistory();

  const [AppMessage, setMessage] = useAppMessage();

  const [isSaving, setIsSaving] = useState(false);

  const [stepValidationSchema, setStepValidationSchema] = useState<object>(createTeacherMainSchema);

  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError, isFieldRequired] = useAppForm({
    validationSchema: stepValidationSchema,
    initialValues: {
      email: '',
      name: '',
      enroll_id: '',
      CPF: '',
      phone: '',
      sex: '',
      birth: '',
      password: '',
      password_confirmation: '',
      segment_id: '',
      grade_id: '',
      class_group_id: '',
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues;

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      setIsSaving(true);

      const data = values;

      try {
        await teachersService.create(data);
        history.replace(`/professores`);
      } catch (err: any) {
        console.log(err);
        setMessage({ type: 'error', text: err.response.data.message });
      }
      setIsSaving(false);
    },
    [values, history]
  );

  const stepsTitles = [
    {
      name: 'Professor',
      isValid: ['name', 'birth', 'CPF', 'phone', 'sex'].every((field) => !fieldHasError(field)),
    },
    { name: 'Endereço', isValid: [].every((field) => fieldHasError(field)) },
    { name: 'Outros', isValid: [].every((field) => fieldHasError(field)) },
  ];

  const stepsValidationSchema = [createTeacherMainSchema, {}, complementaryDataSchema];

  const mainForm = (
    <Grid container spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          required={isFieldRequired('name')}
          label="Nome Completo"
          name="name"
          value={values.name}
          onChange={onFieldChange}
          error={fieldHasError('name')}
          helperText={fieldGetError('name') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <TextField
          required={isFieldRequired('birth')}
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

      <Grid item md={6} sm={12} xs={12}>
        <TextField
          required={isFieldRequired('CPF')}
          label="CPF"
          name="CPF"
          value={values.CPF}
          onChange={onFieldChange}
          style={{ minWidth: '100%' }}
          error={fieldHasError('CPF')}
          helperText={fieldGetError('CPF') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <TextField
          required
          label="Telefone"
          type="phone"
          name="phone"
          value={values.phone}
          onChange={onFieldChange}
          error={fieldHasError('phone')}
          helperText={fieldGetError('phone') || ' '}
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
    </Grid>
  );

  const complementForm = (
    <Grid container spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          label="Email"
          name="email"
          required={isFieldRequired('email')}
          // type="email"
          value={values.email}
          error={fieldHasError('email')}
          helperText={fieldGetError('email') || ' '}
          onChange={onFieldChange}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <TextField
          type="password"
          label="Password"
          name="password"
          required={isFieldRequired('password')}
          value={values.password}
          error={fieldHasError('password')}
          helperText={fieldGetError('password') || ' '}
          onChange={onFieldChange}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <TextField
          type="password"
          label="Confirmação de Password"
          name="password_confirmation"
          required={isFieldRequired('password_confirmation')}
          value={values.password_confirmation}
          error={fieldHasError('password_confirmation')}
          helperText={fieldGetError('password_confirmation') || ' '}
          onChange={onFieldChange}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>

      <Grid item md={12} sm={12} xs={12}>
        <AppMessage />
      </Grid>
    </Grid>
  );

  return (
    <AppForm style={{ minWidth: '100%' }} onSubmit={handleFormSubmit}>
      <CardHeader
        style={{ textAlign: 'center', margin: '30px' }}
        title={'Professores'}
        subheader={'Cadastro de Professores'}
      />

      <AppStepSelector
        forms={[mainForm, <AppAddressForm key={'address'} />, complementForm]}
        stepTitles={stepsTitles}
        isSaving={isSaving}
        isValid={formState.isValid}
        onStepChange={(step) => {
          setStepValidationSchema(stepsValidationSchema[step]);
        }}
      ></AppStepSelector>
    </AppForm>
  );
}

export { CreateTeacherView };
