/* eslint-disable @typescript-eslint/naming-convention */
import { SyntheticEvent, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, CardHeader, MenuItem, Divider, InputAdornment, CircularProgress } from '@mui/material';

import NumberFormat, { NumberFormatValues } from 'react-number-format';

import * as yup from 'yup';

import { AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import AppStepSelector from '../../components/AppStepSelector';
import AppAddressForm from '../../components/AppAddressForm/AppAddressForm';
import { useApi, useRequestApi } from '../../api/useApi';
import { usersService } from '../../services/users.service';
import { rolesService } from '../../services/roles.service';
import { employeesService } from '../../services/employees.service';
import { AppSaveButton } from '../../components/AppCustomButton';

const createTeacherMainSchema = {
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras')
    .required('O campo é obrigatório'),
  birth: yup.date().required('O campo é obrigatório'),
  CPF: yup.string().required('O campo é obrigatório'),
  sex: yup.string().required('O campo é obrigatório'),
};

const addressDataSchema = {
  street: yup.string().required('O campo é obrigatório'),
  number: yup.string().required('O campo é obrigatório'),
  complement: yup.string(),
  district: yup.string().required('O campo é obrigatório'),
  city: yup.string().required('O campo é obrigatório'),
  state: yup.string().required('O campo é obrigatório'),
  CEP: yup.string().required('O campo é obrigatório'),
};

const complementaryDataSchema = {
  email: yup.string().email('Email inválido').required('O campo é obrigatório'),
  phone: yup.string().required('O campo é obrigatório'),
  role_id: yup.string().required('O campo é obrigatório'),
};

interface FormStateValues {
  email: string;
  name: string;
  CPF: string; // unique
  phone: string;
  sex: 'M' | 'F' | '';
  birth: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  CEP: string;
  role_id: string;
}

/**
 * Renders "Create Teacher" view
 * url: /professores/criar
 */
function CreateEmployeeView() {
  const history = useHistory();

  const [rolesData, , loadingRoles] = useApi(rolesService.getAll, {}, { defaultValue: [] });

  const [getUserByCPF, loadingUser] = useRequestApi(usersService.getByCPF, { silent: true });

  const [createTeacher, isSaving] = useRequestApi(employeesService.create);

  const [stepValidationSchema, setStepValidationSchema] = useState<object>(createTeacherMainSchema);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError, isFieldRequired, setField] = useAppForm({
    validationSchema: stepValidationSchema,
    initialValues: {
      name: '',
      CPF: '',
      phone: '',
      sex: '',
      birth: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      CEP: '',
      email: '',
      role_id: '',
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues;

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const { name, CPF, phone, sex, birth, street, number, complement, district, city, state, CEP, email, role_id } =
        values;

      const data = {
        name,
        CPF,
        phone,
        sex,
        birth,
        role_id,
        address: {
          street,
          number,
          complement,
          district,
          city,
          state,
          CEP,
        },
        email,
      };

      const response = await createTeacher(data);

      if (response?.success) {
        history.goBack();
      }
    },
    [values, history]
  );

  const handleChangeUserCPF = useCallback(async ({ value }: NumberFormatValues) => {
    onFieldChange({ target: { name: 'CPF', value } });
    if (value.length === 11) {
      const response = await getUserByCPF({ CPF: value });
      if (response?.success) {
        console.log(response.user);
        setFormState((prev) => ({ ...prev, values: response.user }));
      }
    }
  }, []);

  const mainForm = (
    <Grid container spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <NumberFormat
          {...SHARED_CONTROL_PROPS}
          label="CPF"
          value={values.CPF}
          required={isFieldRequired('CPF')}
          name="CPF"
          format="###.###.###-##"
          customInput={TextField}
          type="text"
          onValueChange={handleChangeUserCPF}
          error={fieldHasError('CPF')}
          helperText={fieldGetError('CPF') || ' '}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" style={{ width: 20 }}>
                {loadingUser && <CircularProgress size={20} />}
              </InputAdornment>
            ),
          }}
        />
      </Grid>
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
      <Grid item md={12} sm={12} xs={12}>
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

      <Grid item md={12} sm={12} xs={12}>
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
      <Grid item md={12} sm={12} xs={12}>
        <NumberFormat
          {...SHARED_CONTROL_PROPS}
          label="Telefone"
          value={values.phone}
          name="phone"
          format="(##) #####-####"
          customInput={TextField}
          type="text"
          onValueChange={({ value: v }) => {
            onFieldChange({ target: { name: 'phone', value: v } });
          }}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          required
          select
          label="Função"
          name="role_id"
          value={values.role_id}
          onChange={onFieldChange}
          error={fieldHasError('role_id')}
          helperText={fieldGetError('role_id') || ' '}
          {...SHARED_CONTROL_PROPS}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" style={{ width: 20 }}>
                {loadingRoles && <CircularProgress size={20} />}
              </InputAdornment>
            ),
          }}
        >
          {rolesData?.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  );

  const confirmationForm = (
    <Grid container spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          select
          label="Função"
          name="role_id"
          value={values.role_id}
          onChange={onFieldChange}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
          inputProps={{ readOnly: true }}
        >
          {rolesData?.map((role) => (
            <MenuItem key={role.id} value={role.id}>
              {role.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          label="Nome"
          name="name"
          value={values.name}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={5} sm={5} xs={5}>
        <TextField
          label="Nascimento"
          name="birth"
          value={values.birth}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={5} sm={5} xs={5}>
        <TextField
          label="CPF"
          name="CPF"
          value={values.CPF.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1')}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={2} sm={2} xs={2}>
        <TextField
          label="Sexo"
          name="sex"
          value={values.sex}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <Divider />
      </Grid>

      <Grid item md={10} sm={10} xs={10}>
        <TextField
          label="Logradouro"
          name="street"
          value={values.street}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>
      <Grid item md={2} sm={2} xs={2}>
        <TextField
          label="Número"
          name="number"
          value={values.number}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={6} sm={6} xs={6}>
        <TextField
          label="Complemento"
          name="complement"
          value={values.complement}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={6} sm={6} xs={6}>
        <TextField
          label="Bairro"
          name="district"
          value={values.district}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={5} sm={5} xs={5}>
        <TextField
          label="Complemento"
          name="complement"
          value={values.city}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={2} sm={2} xs={2}>
        <TextField
          label="UF"
          name="state"
          value={values.state}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={5} sm={5} xs={5}>
        <TextField
          label="Bairro"
          name="district"
          value={values.CEP}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={12} sm={12} xs={12}>
        <Divider />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <TextField
          label="Email"
          name="email"
          value={values.email}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <TextField
          label="Telefone"
          name="phone"
          value={
            values.phone
              .replace(/\D/g, '')
              .replace(/(\d{2})(\d)/, '($1) $2')
              .replace(/(\d{5})(\d)/, '$1-$2')
            // .replace(/(\d{5})(\d{4})(\d)/, '$1-$2')
          }
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <AppSaveButton
          loading={isSaving}
          disabled={isSaving || !formState.isValid}
          type="submit"
          label="Cadastrar"
        ></AppSaveButton>
      </Grid>
    </Grid>
  );

  const stepsTitles = [
    {
      name: 'Funcionário',
      isValid: ['name', 'birth', 'CPF', 'phone', 'sex'].every((field) => !fieldHasError(field)),
    },
    { name: 'Endereço', isValid: [].every((field) => fieldHasError(field)) },
    { name: 'Outros', isValid: [].every((field) => fieldHasError(field)) },
    { name: 'Confirmar', isValid: true },
  ];

  const stepsValidationSchema = [
    createTeacherMainSchema,
    addressDataSchema,
    complementaryDataSchema,
    { ...createTeacherMainSchema, ...addressDataSchema, ...complementaryDataSchema },
  ];

  const stepForms = [
    mainForm,
    <AppAddressForm
      key={'address'}
      values={formState.values as FormStateValues}
      onFieldChange={onFieldChange}
      fieldGetError={fieldGetError}
      fieldHasError={fieldHasError}
      setField={setField}
    />,
    complementForm,
    confirmationForm,
  ];

  return (
    <AppForm style={{ minWidth: '100%' }} onSubmit={handleFormSubmit}>
      <CardHeader
        style={{ textAlign: 'center', margin: '30px' }}
        title={'Funcionários'}
        subheader={'Cadastro de Funcionários'}
      />

      <AppStepSelector
        forms={stepForms}
        stepTitles={stepsTitles}
        isValid={formState.isValid}
        onStepChange={(step) => {
          setStepValidationSchema(stepsValidationSchema[step]);
        }}
      ></AppStepSelector>
    </AppForm>
  );
}

export { CreateEmployeeView };
