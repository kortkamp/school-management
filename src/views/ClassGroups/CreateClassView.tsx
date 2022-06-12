import { SyntheticEvent, useCallback, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, LinearProgress, MenuItem } from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppAlert, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault } from '../../utils/form';
import { classGroupsService } from '../../services/classGroups.service';
import { subjectsService } from '../../services/subjects.service';
import { segmentsService } from '../../services/segments.service';
import { gradesService } from '../../services/grades.service';

const VALIDATE_FORM = {
  name: {
    type: 'string',
    presence: { allowEmpty: false },
    format: {
      pattern: '^[A-Za-z0-9 ]+$', // Note: Allow only alphabets and space
      message: 'O nome da turma só permite letras e números',
    },
  },
};

interface FormStateValues {
  name: string;
  segment_id: string;
  grade_id: string;
}

/**
 * Renders "Create ClassGroup" view
 * url: /turmas/criar
 */
function CreateClassView() {
  const history = useHistory();
  const [, dispatch] = useAppStore();
  const [validationSchema, setValidationSchema] = useState<any>({
    ...VALIDATE_FORM,
  });
  const [formState, , /* setFormState */ onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema, // the state value, so could be changed in time
    initialValues: {
      name: '',
      segment_id: '',
      grade_id: '',
    } as FormStateValues,
  });

  const [segments, setSegments] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  useEffect(() => {
    // Component Mount
    let componentMounted = true;

    async function fetchData() {
      let segments = [];
      let grades = [];

      try {
        const segmentsResponse = await segmentsService.getAll();
        segments = segmentsResponse.data.segments;

        const gradesResponse = await gradesService.getAll();
        grades = gradesResponse.data.grades;
      } catch (err: any) {
        console.log(err);
      }

      if (!componentMounted) return;

      setSegments(segments.sort((a: any, b: any) => a.name.localeCompare(b.name)));
      setGrades(grades.sort((a: any, b: any) => a.name.localeCompare(b.name)));

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

      const { grade_id, name } = values;
      const apiResult = await classGroupsService.create({ grade_id, name });

      if (!apiResult) {
        setError('Erro ao criar a turma');
        return;
      }

      history.replace('/turmas');
    },
    [dispatch, values, history]
  );

  const handleCloseError = useCallback(() => setError(undefined), []);

  if (loading) return <LinearProgress />;

  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader style={{ textAlign: 'center' }} title="Criar uma nova turma" />
        <CardContent>
          <TextField
            required
            select
            label="Segmento"
            name="segment_id"
            value={values.segment_id}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          >
            {segments.map((item) => {
              return (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              );
            })}
          </TextField>
          <TextField
            required
            select
            label="Ano"
            name="grade_id"
            value={values.grade_id}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          >
            {grades
              .filter((grade) => grade.segment_id === values.segment_id)
              .map((grade) => {
                return (
                  <MenuItem key={grade.id} value={grade.id}>
                    {grade.name}
                  </MenuItem>
                );
              })}
          </TextField>
          <TextField
            required
            label="Nome"
            name="name"
            value={values.name}
            error={fieldHasError('name')}
            helperText={fieldGetError('name') || ' '}
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
              Criar
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
}

export default CreateClassView;
