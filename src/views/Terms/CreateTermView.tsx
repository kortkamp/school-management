import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent } from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppAlert, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS, eventPreventDefault, DEFAULT_FORM_STATE } from '../../utils/form';

import Moment from 'moment';

import * as yup from 'yup';
import { termsService } from '../../services/terms.service';
import { useAppMessage } from '../../utils/message';

const createTermSchema = {
  name: yup.string().required('O campo é obrigatório'),
  year: yup.string().required('O campo é obrigatório'),
  start_at: yup.date().required('O campo é obrigatório'),
  end_at: yup.date().required('O campo é obrigatório'),
};

interface FormStateValues {
  name: string;
  year: string;
  start_at: Date | null;
  end_at: Date | null;
}

/**
 * Renders "Create ClassGroup" view
 * url: /turmas/criar
 */
function CreateTermView() {
  const history = useHistory();
  const [, dispatch] = useAppStore();

  const { id } = useParams<{ id: string }>();
  const isEditing = id ? true : false;

  const [isSaving, setIsSaving] = useState(false);

  const [AppMessage, setMessage] = useAppMessage();

  const [formState, setFormState, onFieldChange, fieldGetError, fieldHasError] = useAppForm({
    validationSchema: createTermSchema,
    initialValues: {
      name: '',
      year: String(new Date().getFullYear()),
      start_at: null,
      end_at: null,
    } as FormStateValues,
  });

  const [error, setError] = useState<string>();
  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setIsSaving(true);

      try {
        if (isEditing) {
          const apiResult = await termsService.update(id, values);
        } else {
          const apiResult = await termsService.create(values);
        }
        history.replace('/bimestres');
      } catch (err: any) {
        setIsSaving(false);
        console.error(err);
        setMessage({ type: 'error', text: err.response.data.message });
      }
    },
    [dispatch, values, history]
  );

  const loadData = useCallback(() => {
    let componentMounted = true;

    async function fetchData() {
      try {
        const { name, year, start_at, end_at } = await termsService.getById(id);
        setFormState({ ...DEFAULT_FORM_STATE, isValid: true, values: { name, year, start_at, end_at } });
      } catch (err: any) {
        console.log(err);
      }

      if (!componentMounted) return;
    }
    fetchData();

    return () => {
      componentMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const handleCloseError = useCallback(() => setError(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader
          style={{ textAlign: 'center' }}
          title="Bimestres"
          subheader={isEditing ? 'Editar bimestre' : 'Criar um novo bimestre'}
        />
        <CardContent>
          <TextField
            required
            label="Nome"
            name="name"
            value={values.name}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            label="Ano"
            name="year"
            value={values.year}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />

          <TextField
            required
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Início"
            name="start_at"
            value={values.start_at ? Moment(values.start_at).utcOffset('+0300').format('YYYY-MM-DD') : ''}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />
          <TextField
            required
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Término"
            name="end_at"
            value={values.end_at ? Moment(values.end_at).utcOffset('+0300').format('YYYY-MM-DD') : ''}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          />

          {error ? (
            <AppAlert severity="error" onClose={handleCloseError}>
              {error}
            </AppAlert>
          ) : null}
          <Grid item md={12} sm={12} xs={12}>
            <AppMessage />
          </Grid>
          <Grid container justifyContent="center" alignItems="center">
            <AppButton type="submit" disabled={!formState.isValid || isSaving} loading={isSaving}>
              {isEditing ? 'Salvar' : 'Criar'}
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
}

export default CreateTermView;
