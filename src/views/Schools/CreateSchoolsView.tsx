/* eslint-disable @typescript-eslint/naming-convention */
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, Divider } from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';

import AppStepSelector from '../../components/AppStepSelector';
import AppAddressForm from '../../components/AppAddressForm/AppAddressForm';

import * as yup from 'yup';
import NumberFormat from 'react-number-format';
import { schoolsService } from '../../services/schools.service';
import { IAuthSchool } from '../../services/auth.service';
import { useApi } from '../../api/useApi';
import { rolesService } from '../../services/roles.service';

interface FormStateValues {
  name: string;
  full_name: string;
  CNPJ: string;
  email: string;
  phone: string;
  mobile: string;

  address: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
  CEP: string;
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
  address: yup.string().required('O campo é obrigatório'),
  number: yup.string().required('O campo é obrigatório'),
  complement: yup.string(),
  district: yup.string().required('O campo é obrigatório'),
  city: yup.string().required('O campo é obrigatório'),
  state: yup.string().required('O campo é obrigatório'),
  CEP: yup.string().required('O campo é obrigatório'),
};

/**
 * Renders "Create ClassGroup" view
 * url: /escola/criar
 */
function CreateSchoolsView() {
  const history = useHistory();
  const [appState, dispatch] = useAppStore();

  const { id } = useParams<{ id: string }>();
  const isEditing = id ? true : false;

  const [isSaving, setIsSaving] = useState(false);

  const [stepValidationSchema, setStepValidationSchema] = useState<object>(createSchoolMainSchema);

  const { data: roles } = useApi(rolesService.getAll);

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [formState, , onFieldChange, fieldGetError, fieldHasError, , setField] = useAppForm({
    validationSchema: stepValidationSchema,
    initialValues: {
      name: '',
      full_name: '',
      CNPJ: '',
      email: '',
      phone: '',
      mobile: '',
      address: '',
      number: '',
      complement: '',
      district: '',
      city: '',
      state: '',
      CEP: '',
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setIsSaving(true);

      const { name, full_name, CNPJ, email, phone, mobile, address, number, complement, district, city, state, CEP } =
        values;

      const data = {
        name,
        full_name,
        CNPJ,
        email,
        phone,
        mobile,
        address: {
          street: address,
          number,
          complement,
          district,
          city,
          state,
          CEP,
        },
      };

      try {
        if (isEditing) {
          // await schoolsService.update(id, values);
        } else {
          const response = await schoolsService.create(appState?.currentUser?.token || '', data);

          const userRole = roles?.find((role) => role.id === response.school.userSchoolRoles[0].role_id);

          const school: IAuthSchool = {
            id: response.school.id,
            name: response.school.name,
            role: userRole?.type || '',
            role_name: userRole?.name || '',
          };

          const currentUser = appState.currentUser;
          currentUser?.schools.push(school);
          dispatch({ type: 'CURRENT_USER', payload: currentUser });
          dispatch({ type: 'SELECT_SCHOOL', payload: school });
          history.replace('/escola/configurar/' + response.school.id);
        }
      } catch (err: any) {
        setIsSaving(false);
        console.error(err);
      }
    },
    [dispatch, values, history]
  );

  useEffect(() => {
    if (id) {
      // loadData();
    }
  }, [id]);

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
          value={values.CNPJ.replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d)/, '$1-$2')}
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
          name="address"
          value={values.address}
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
          value={values.phone
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid item md={6} sm={12} xs={12}>
        <TextField
          label="Celular"
          name="mobile"
          value={values.phone
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')}
          inputProps={{ readOnly: true }}
          {...SHARED_CONTROL_PROPS}
          variant="standard"
        />
      </Grid>

      <Grid container justifyContent="center" alignItems="center">
        <AppButton loading={isSaving} disabled={isSaving || !formState.isValid} type="submit">
          Cadastrar
        </AppButton>
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
        <CardHeader
          style={{ textAlign: 'center' }}
          title="Escola"
          subheader={isEditing ? 'Editar Dados da Escola' : 'Cadastrar uma nova Escola'}
        />
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

export default CreateSchoolsView;
