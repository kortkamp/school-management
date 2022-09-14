/* eslint-disable @typescript-eslint/naming-convention */
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider } from '@mui/material';
import { useAppStore } from '../../store';
import { AppForm, AppLoading } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';

import AppStepSelector from '../../components/AppStepSelector';
import AppAddressForm from '../../components/AppAddressForm/AppAddressForm';

import * as yup from 'yup';
import NumberFormat from 'react-number-format';
import { schoolsService } from '../../services/schools.service';
import { useApi } from '../../api/useApi';
import { AppSaveButton } from '../../components/AppCustomButton';

interface FormStateValues {
  name: string;
  full_name: string;
  CNPJ: string;
  email: string;
  phone: string;
  mobile: string;

  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  CEP: string;
}

interface Props {
  onSuccess?: () => void;
}

const createSchoolMainSchema = {
  name: yup.string().required('O campo é obrigatório'),
  full_name: yup.string().required('O campo é obrigatório'),
  // CNPJ: yup.string().length(14, 'CNPJ inválido'),
  CNPJ: yup.string().test('len', 'CNPJ inválido', (val) => val === '' || val?.length === 14),
  email: yup.string().email('Email inválido'),
  phone: yup.string().test('len', 'Telefone inválido', (val) => val === '' || val?.length === 10),
  mobile: yup.string().test('len', 'Celular inválido', (val) => val === '' || val?.length === 11),
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

/**
 * Renders "UpdateSchoolInfo" view
 * url: /escola/criar
 */
function UpdateSchoolInfoView({ onSuccess = () => {} }: Props) {
  const history = useHistory();
  const [, dispatch] = useAppStore();

  const [schoolData, , loading] = useApi(schoolsService.getById, {});

  const [, , isSaving, createSchool] = useApi(schoolsService.update, { isRequest: true });

  const [stepValidationSchema, setStepValidationSchema] = useState<object>(createSchoolMainSchema);

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError, , setField] = useAppForm({
    validationSchema: stepValidationSchema,
    initialValues: {
      name: '',
      full_name: '',
      CNPJ: '',
      email: '',
      phone: '',
      mobile: '',
      street: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      CEP: '',
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues;

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const response = await createSchool(values);

      if (response?.success) {
        // const userRole = roles?.find((role) => role.id === response.school.userSchoolRoles[0].role_id);

        // const school: IAuthSchool = {
        //   id: response.school.id,
        //   name: response.school.name,
        //   role: userRole?.type || '',
        //   role_name: userRole?.name || '',
        // };

        // // const currentUser = appState.currentUser;
        // // currentUser?.schools.push(school);
        // // dispatch({ type: 'CURRENT_USER', payload: currentUser });
        // dispatch({ type: 'SELECT_SCHOOL', payload: school });
        onSuccess();
      }
    },
    [dispatch, values, history]
  );

  useEffect(() => {
    if (schoolData) {
      const {
        name = '',
        full_name = '',
        CNPJ = '',
        email = '',
        phone = '',
        mobile = '',

        street = '',
        number = '',
        complement = '',
        district = '',
        city = '',
        state = '',
        CEP = '',
      } = schoolData.school;
      setFormState((prevState) => ({
        ...prevState,
        values: {
          name,
          full_name,
          CNPJ,
          email,
          phone,
          mobile,

          street,
          number,
          complement,
          district,
          city,
          state,
          CEP,
        },
      }));
    }
  }, [schoolData]);

  if (loading) return <AppLoading />;

  const mainSchoolForm = (
    <Grid container spacing={1}>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          required
          label="Nome Abreviado"
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
          required
          label="Nome Completo"
          name="full_name"
          value={values.full_name}
          onChange={onFieldChange}
          error={fieldHasError('full_name')}
          helperText={fieldGetError('full_name') || ' '}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>

      <Grid item md={12} sm={12} xs={12}>
        <NumberFormat
          {...SHARED_CONTROL_PROPS}
          label="CNPJ"
          value={values.CNPJ}
          name="CPF"
          format="##.###.###/####-##"
          customInput={TextField}
          type="text"
          error={fieldHasError('CNPJ')}
          helperText={fieldGetError('CNPJ') || ' '}
          onValueChange={({ value: v }) => {
            onFieldChange({ target: { name: 'CNPJ', value: v } });
          }}
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <NumberFormat
          {...SHARED_CONTROL_PROPS}
          label="Telefone Fixo"
          value={values.phone}
          name="phone"
          format="(##) ####-####"
          customInput={TextField}
          type="text"
          error={fieldHasError('phone')}
          helperText={fieldGetError('phone') || ' '}
          onValueChange={({ value: v }) => {
            onFieldChange({ target: { name: 'phone', value: v } });
          }}
        />
      </Grid>
      <Grid item md={6} sm={12} xs={12}>
        <NumberFormat
          {...SHARED_CONTROL_PROPS}
          label="Celular"
          value={values.mobile}
          name="phone"
          format="(##) #####-####"
          customInput={TextField}
          type="text"
          error={fieldHasError('mobile')}
          helperText={fieldGetError('mobile') || ' '}
          onValueChange={({ value: v }) => {
            onFieldChange({ target: { name: 'mobile', value: v } });
          }}
        />
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <TextField
          label="Email"
          name="email"
          // type="email"
          value={values.email}
          error={fieldHasError('email')}
          helperText={fieldGetError('email') || ' '}
          onChange={onFieldChange}
          {...SHARED_CONTROL_PROPS}
        />
      </Grid>
    </Grid>
  );

  const confirmationForm = (
    <Grid container spacing={1}>
      <Grid item md={6} sm={12} xs={12}>
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
          label="CNPJ"
          name="CNPJ"
          value={
            values.CNPJ
              ? values.CNPJ?.replace(/\D/g, '')
                  .replace(/(\d{2})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d)/, '$1.$2')
                  .replace(/(\d{3})(\d)/, '$1/$2')
                  .replace(/(\d{4})(\d)/, '$1-$2')
              : ''
          }
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={12} sm={12} xs={12}>
        <TextField
          label="Nome Completo"
          name="full_name"
          value={values.full_name}
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
          label="Telefone Fixo"
          name="phone"
          value={
            values.phone
              ? values.phone
                  .replace(/\D/g, '')
                  .replace(/(\d{2})(\d)/, '($1) $2')
                  .replace(/(\d{4})(\d)/, '$1-$2')
              : ''
          }
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <TextField
          label="Celular"
          name="mobile"
          value={
            values.phone
              ? values.phone
                  .replace(/\D/g, '')
                  .replace(/(\d{2})(\d)/, '($1) $2')
                  .replace(/(\d{5})(\d)/, '$1-$2')
              : ''
          }
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <AppSaveButton loading={isSaving} disabled={isSaving || !formState.isValid} type="submit" />
      </Grid>
    </Grid>
  );

  const stepForms = [
    mainSchoolForm,
    <AppAddressForm
      key={'address'}
      values={formState.values as FormStateValues}
      onFieldChange={onFieldChange}
      fieldGetError={fieldGetError}
      fieldHasError={fieldHasError}
      setField={setField}
    />,
    confirmationForm,
  ];

  const stepsTitles = [
    {
      name: 'Escola',
      isValid: true,
    },
    { name: 'Endereço', isValid: true },
    { name: 'Confirmar', isValid: true },
  ];

  const stepsValidationSchema = [
    createSchoolMainSchema,
    addressDataSchema,
    { ...createSchoolMainSchema, ...addressDataSchema },
  ];
  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader style={{ textAlign: 'center' }} title="Escola" subheader={'Cadastrar uma nova Escola'} />
        <CardContent>
          <AppStepSelector
            forms={stepForms}
            stepTitles={stepsTitles}
            isValid={formState.isValid}
            onStepChange={(step) => {
              setStepValidationSchema(stepsValidationSchema[step]);
            }}
          ></AppStepSelector>
        </CardContent>
      </Card>
    </AppForm>
  );
}

export default UpdateSchoolInfoView;
