import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Grid,
  TextField,
  Card,
  CardHeader,
  CardContent,
  LinearProgress,
  MenuItem,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppAlert, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../utils/form';
import { classGroupsService } from '../../services/classGroups.service';
import { subjectsService } from '../../services/subjects.service';
import { examsService } from '../../services/exams.service';
import { studentsService } from '../../services/students.service';

const VALIDATE_FORM_SIGNUP = {
  email: {
    email: true,
    presence: true,
  },
  phone: {
    type: 'string',
    format: {
      pattern: '^$|[- .+()0-9]+', // Note: We have to allow empty in the pattern
      message: 'should contain numbers',
    },
  },
  name: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z ]+$', // Note: Allow only alphabets and space
      message: 'should contain only alphabets',
    },
  },
  password: {
    presence: true,
    length: {
      minimum: 6,
      maximum: 12,
      message: 'must be between 8 and 32 characters',
    },
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
  password: string;
  password_confirmation: string;
  segment_id?: string;
  grade_id?: string;
  class_group_id?: string;
}

/**
 * Renders "Create Exam" view
 * url: /exames/criar
 */
function CreateUserView() {
  const history = useHistory();
  const [, dispatch] = useAppStore();
  const [validationSchema, setValidationSchema] = useState<any>({
    ...VALIDATE_FORM_SIGNUP,
  });
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema, // the state value, so could be changed in time
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  // useEffect(() => {
  //   // Component Mount
  //   let componentMounted = true;

  //   async function fetchData() {
  //     // TODO: Call any Async API here
  //     try {
  //       const response = await classGroupsService.getAll();
  //       setClassGroups(response.data.classGroups);

  //       const subjectsResponse = await subjectsService.getAll();
  //       setSubjects(subjectsResponse.data.subjects);
  //     } catch (err: any) {
  //       console.log(err);
  //     }

  //     if (!componentMounted) return; // Component was unmounted during the API call
  //     // TODO: Verify API call here

  //     setLoading(false); // Reset "Loading..." indicator
  //   }
  //   fetchData(); // Call API asynchronously

  //   return () => {
  //     // Component Un-mount
  //     componentMounted = false;
  //   };
  // }, []);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      console.log(values);

      const apiResult = await studentsService.create(values);

      if (!apiResult) {
        setError('Não foi possível cadastrar o aluno');
        return;
      }

      history.replace('/alunos');
    },
    [dispatch, values, history]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  if (loading) return <LinearProgress />;

  return (
    <AppForm style={{ minWidth: '100%' }} onSubmit={handleFormSubmit}>
      <Card style={{ minWidth: '100%', marginTop: '50px' }}>
        <CardHeader style={{ textAlign: 'center' }} title="Cadastro de Aluno" />
        <CardContent style={{ minWidth: '100%' }}>
          <Grid container spacing={1}>
            <Grid item md={8} sm={12} xs={12}>
              <TextField
                required
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

            <Grid item md={6} sm={12} xs={12}>
              <TextField
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

            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required
                label="Telefone"
                name="phone"
                value={values.phone}
                onChange={onFieldChange}
                error={fieldHasError('phone')}
                helperText={fieldGetError('phone') || ' '}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            <Grid
              item
              md={6}
              sm={12}
              xs={12}
              margin="normal"
              style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center' }}
            >
              <FormLabel id="demo-radio-buttons-group-label">Sexo:</FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                row
                name="sex"
                value={values.sex}
                onChange={onFieldChange}
              >
                <FormControlLabel value="M" control={<Radio />} label="Masculino" />
                <FormControlLabel value="F" control={<Radio />} label="Feminino" />
              </RadioGroup>
            </Grid>

            <Grid item md={12} sm={12} xs={12}>
              <TextField
                required
                label="Email"
                name="email"
                type="email"
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
                type="password"
                label="Password"
                name="password"
                value={values.password}
                error={fieldHasError('password')}
                helperText={fieldGetError('password') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required
                type="password"
                label="Confirmação de Password"
                name="password_confirmation"
                value={values.password_confirmation}
                error={fieldHasError('password')}
                helperText={fieldGetError('password') || ' '}
                onChange={onFieldChange}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            {error ? (
              <AppAlert severity="error" onClose={handleCloseError}>
                {error}
              </AppAlert>
            ) : null}

            <Grid container justifyContent="center" alignItems="center">
              <AppButton type="submit" disabled={!formState.isValid}>
                Cadastrar
              </AppButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
}

export default CreateUserView;
