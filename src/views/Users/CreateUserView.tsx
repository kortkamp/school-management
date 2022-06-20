import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, CardHeader, MenuItem, FormControlLabel, Checkbox } from '@mui/material';

import * as yup from 'yup';

import { AppButton, AppAlert, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { studentsService } from '../../services/students.service';
import AppStepSelector from '../../components/AppStepSelector';
import { teachersService } from '../../services/teachers.service';

const createStudentSchema = {
  email: yup.string().email('Email inválido'),
  phone: yup.string().required('O campo é obrigatório'),
  enroll_id: yup.number().required('O campo é obrigatório').positive().integer(),
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras')
    .required('O campo é obrigatório'),
  CPF: yup.string(),
  // password: yup.string().min(6, 'Mínimo de 6 caracteres').max(12, 'Máximo de 12 caracteres'),\
  willLogin: yup.boolean(),
  password: yup.string().when('willLogin', {
    is: true,
    then: yup.string().min(6, 'Mínimo de 6 caracteres').max(12, 'Máximo de 12 caracteres').required(),
  }),
  password_confirmation: yup.string().oneOf([yup.ref('password'), null], 'As senhas não conferem!'),
  sex: yup.string().required('O campo é obrigatório'),
  birth: yup.date().required('O campo é obrigatório'),
};

const createTeacherSchema = {
  email: yup.string().email('Email inválido').required('O campo é obrigatório'),
  phone: yup.string().required('O campo é obrigatório'),
  // enroll_id: yup.number().required('O campo é obrigatório').positive().integer(),
  name: yup
    .string()
    .matches(/^[A-Za-z ]+$/, 'Apenas letras')
    .required('O campo é obrigatório'),
  CPF: yup.string().required('O campo é obrigatório'),

  // password: yup.string().min(6, 'Mínimo de 6 caracteres').max(12, 'Máximo de 12 caracteres'),\
  password: yup
    .string()
    .min(6, 'Mínimo de 6 caracteres')
    .max(12, 'Máximo de 12 caracteres')
    .required('O campo é obrigatório'),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref('password'), null], 'As senhas não conferem!')
    .required('O campo é obrigatório'),
  sex: yup.string().required('O campo é obrigatório'),
  birth: yup.date().required('O campo é obrigatório'),
};

const roleData = {
  student: {
    service: studentsService,
    createUserSchema: createStudentSchema,
    name: 'aluno',
    title: 'Alunos',
    subheader: 'Cadastro de alunos',
    mandatoryLoginAccount: false,
  },
  teacher: {
    service: teachersService,
    createUserSchema: createTeacherSchema,
    name: 'professor',
    title: 'Professores',
    subheader: 'Cadastro de professores',
    mandatoryLoginAccount: true,
  },
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

function CreateUserView({ role }: { role: 'student' | 'teacher' }) {
  const history = useHistory();

  const createUserSchema = roleData[role].createUserSchema;

  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError, isFieldRequired] = useAppForm({
    validationSchema: createUserSchema,
    initialValues: {
      email: '',
      name: '',
      enroll_id: '',
      CPF: '',
      phone: '',
      sex: '',
      birth: '',
      willLogin: roleData[role].mandatoryLoginAccount,
      password: '',
      password_confirmation: '',
      segment_id: '',
      grade_id: '',
      class_group_id: '',
    } as FormStateValues,
  });

  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues;

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const createUserService = roleData[role].service;

      const { willLogin, ...data } = values;

      try {
        const apiResult = await createUserService.create(data);
      } catch (err) {
        console.log(err);
        setError(`Não foi possível cadastrar o ${roleData[role].name}`);
        return;
      }

      history.replace(`/${roleData[role].title.toLowerCase()}`);
    },
    [values, history]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  const [formStep, setFormStep] = useState(0);

  const stepsTitles = [roleData[role].name, 'Endereço', 'Outros'];

  return (
    <AppForm style={{ minWidth: '100%' }} onSubmit={handleFormSubmit}>
      <CardHeader
        style={{ textAlign: 'center', margin: '30px' }}
        title={roleData[role].title}
        subheader={roleData[role].subheader}
      />
      <AppStepSelector step={formStep} setStep={setFormStep} titles={stepsTitles}>
        <Grid container spacing={1}>
          <Grid item md={8} sm={12} xs={12}>
            <TextField
              required={isFieldRequired('name')}
              label="Nome"
              name="name"
              value={values.name}
              onChange={onFieldChange}
              error={fieldHasError('name')}
              helperText={fieldGetError('name') || ' '}
              {...SHARED_CONTROL_PROPS}
            />
          </Grid>
          <Grid item md={4} sm={12} xs={12}>
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

          {role === 'student' && (
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required={isFieldRequired('enroll_id')}
                type="number"
                label="Matrícula"
                name="enroll_id"
                value={values.enroll_id}
                onChange={onFieldChange}
                style={{ minWidth: '100%' }}
                error={fieldHasError('enroll_id')}
                helperText={fieldGetError('enroll_id') || ' '}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>
          )}

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

          {!roleData[role].mandatoryLoginAccount && (
            <Grid item md={12} sm={12} xs={12}>
              <FormControlLabel
                control={<Checkbox name="willLogin" checked={values.willLogin} onChange={onFieldChange} />}
                label="O aluno vai poder logar no sistema?"
              />
            </Grid>
          )}

          {values.willLogin && (
            <>
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
            </>
          )}
          <Grid item md={12} sm={12} xs={12}>
            {error ? (
              <AppAlert severity="error" onClose={handleCloseError}>
                {error}
              </AppAlert>
            ) : null}
          </Grid>
          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!formState.isValid}>
              Cadastrar
            </AppButton>
          </Grid>
        </Grid>
      </AppStepSelector>
    </AppForm>
  );
}

/**
 * Renders "Create Teacher" view
 * url: /professores/criar
 */
const CreateTeacherView = () => <CreateUserView role="teacher" />;

/**
 * Renders "Create Student" view
 * url: /alunos/criar
 */
const CreateStudentView = () => <CreateUserView role="student" />;

export { CreateTeacherView, CreateStudentView };
