import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, LinearProgress, MenuItem } from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppAlert, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../utils/form';
import { classGroupsService } from '../../services/classGroups.service';
import { subjectsService } from '../../services/subjects.service';
import { examsService } from '../../services/exams.service';

const VALIDATE_FORM_SIGNUP = {
  value: {
    type: 'string',
    format: {
      pattern: '^$|[- .+()0-9]+', // Note: We have to allow empty in the pattern
      message: 'should contain numbers',
    },
  },
  weight: {
    type: 'string',
    format: {
      pattern: '^$|[- .+()0-9]+', // Note: We have to allow empty in the pattern
      message: 'should contain numbers',
    },
  },
};

interface FormStateValues {
  type: string;
  subject_id: string;
  class_id: string;
  value: number;
  weight: number;
  date: Date | undefined;
}

/**
 * Renders "Create Exam" view
 * url: /exames/criar
 */
function CreateExamView() {
  const history = useHistory();
  const [, dispatch] = useAppStore();
  const [validationSchema, setValidationSchema] = useState<any>({
    ...VALIDATE_FORM_SIGNUP,
  });
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema, // the state value, so could be changed in time
    initialValues: {
      type: '',
      subject_id: '',
      class_id: '',
      value: 0,
      weight: 0,
      date: undefined,
    } as FormStateValues,
  });
  const [classGroups, setClassGroups] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  useEffect(() => {
    // Component Mount
    let componentMounted = true;

    async function fetchData() {
      // TODO: Call any Async API here
      try {
        const response = await classGroupsService.getAll();
        setClassGroups(response.data.classGroups);

        const subjectsResponse = await subjectsService.getAll();
        setSubjects(subjectsResponse.data.subjects);
      } catch (err: any) {
        console.log(err);
      }

      if (!componentMounted) return; // Component was unmounted during the API call
      // TODO: Verify API call here

      setLoading(false); // Reset "Loading..." indicator
    }
    fetchData(); // Call API asynchronously

    return () => {
      // Component Un-mount
      componentMounted = false;
    };
  }, []);

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const apiResult = await examsService.create(values);

      if (!apiResult) {
        setError('Não foi possível criar o exame');
        return;
      }

      history.replace('/exames');
    },
    [dispatch, values, history]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  if (loading) return <LinearProgress />;

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Card>
        <CardHeader title="Adicionar Prova ou Trabalho" />
        <CardContent>
          <TextField
            required
            select
            label="Tipo"
            name="type"
            value={values.type}
            onChange={onFieldChange}
            style={{ minWidth: '100%' }}
            {...SHARED_CONTROL_PROPS}
          >
            <MenuItem value="prova">Prova</MenuItem>
            <MenuItem value="trabalho">Trabalho</MenuItem>
            <MenuItem value="trabalho em grupo">Trabalho em grupo</MenuItem>
          </TextField>
          <TextField
            required
            select
            label="Matéria"
            name="subject_id"
            value={values.subject_id}
            onChange={onFieldChange}
            style={{ minWidth: '100%' }}
            {...SHARED_CONTROL_PROPS}
          >
            {subjects.map((subject) => {
              return (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}.
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            required
            select
            label="Turma"
            name="class_id"
            value={values.class_id}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          >
            {classGroups.map((classGroup) => {
              return (
                <MenuItem key={classGroup.id} value={classGroup.id}>
                  {classGroup.name}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            required
            label="Valor"
            name="value"
            type="number"
            value={values.value}
            error={fieldHasError('value')}
            helperText={fieldGetError('value') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Peso"
            name="weight"
            type="number"
            value={values.weight}
            error={fieldHasError('weight')}
            helperText={fieldGetError('weight') || ' '}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Data"
            name="date"
            value={values.date}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />

          {error ? (
            <AppAlert severity="error" onClose={handleCloseError}>
              {error}
            </AppAlert>
          ) : null}

          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!formState.isValid}>
              Adicionar
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
}

export default CreateExamView;
