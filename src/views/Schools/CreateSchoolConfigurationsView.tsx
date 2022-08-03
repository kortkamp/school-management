/* eslint-disable @typescript-eslint/naming-convention */
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, MenuItem } from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppAlert, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';

import * as yup from 'yup';
import { termsService } from '../../services/terms.service';
import { useAppMessage } from '../../utils/message';

const createTermSchema = {
  name: yup.string().required('O campo é obrigatório'),
  year: yup.string().required('O campo é obrigatório'),
  start_at: yup.date().required('O campo é obrigatório'),
  end_at: yup
    .date()
    .required('O campo é obrigatório')
    .min(yup.ref('start_at'), 'A data de término precisa ser depois da data inicial'),
};

interface FormStateValues {
  termType: string;
  recoveringPeriod: string;
  recoveringType: string;
}

/**
 * Renders "Create Schools Definitions" view
 * url: /escola/definir
 */
function CreateSchoolConfigurationsView() {
  const history = useHistory();
  const [, dispatch] = useAppStore();

  const { id } = useParams<{ id: string }>();
  const isEditing = id ? true : false;

  const [isSaving, setIsSaving] = useState(false);

  const [AppMessage, setMessage] = useAppMessage();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const [formState, , onFieldChange] = useAppForm({
    validationSchema: createTermSchema,
    initialValues: {
      termType: '',
      recoveringPeriod: '',
      recoveringType: '',
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
          await termsService.update(id, values);
        } else {
          // await termsService.create(values);
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

  // const loadData = useCallback(() => {
  //   async function fetchData() {
  //     try {
  //       const { name, year, start_at, end_at } = await termsService.getById(id);

  //       if (!mounted.current) return;

  //       setFormState({ ...DEFAULT_FORM_STATE, isValid: true, values: { name, year, start_at, end_at } });
  //     } catch (err: any) {
  //       console.log(err);
  //     }
  //   }
  //   fetchData();
  // }, [id]);

  // useEffect(() => {
  //   if (id) {
  //     loadData();
  //   }
  // }, [id]);

  const handleCloseError = useCallback(() => setError(undefined), []);

  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader style={{ textAlign: 'center' }} title="Escola" subheader={'Definir funcionamento da escola'} />
        <CardContent>
          <TextField
            required
            label="Divisões do Ano"
            name="termType"
            select
            value={values.termType}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          >
            <MenuItem value="bimestre">Bimestre</MenuItem>
            <MenuItem value="trimestre">Trimestre</MenuItem>
            <MenuItem value="semestre">Semestre</MenuItem>
          </TextField>

          <TextField
            required
            label="Período de recuperação"
            name="recoveringPeriod"
            select
            value={values.recoveringPeriod}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          >
            <MenuItem value="bimestre">Bimestral</MenuItem>
            <MenuItem value="trimestre">Trimestral</MenuItem>
            <MenuItem value="semestre">Semestral</MenuItem>
            <MenuItem value="semestre">Anual</MenuItem>
          </TextField>

          <TextField
            required
            label="Tipo de recuperação"
            name="recoveringType"
            select
            value={values.recoveringType}
            onChange={onFieldChange}
            {...SHARED_CONTROL_PROPS}
          >
            <MenuItem value="Substitutiva">Substitutiva</MenuItem>
            <MenuItem value="M">Trimestral</MenuItem>
            <MenuItem value="semestre">Semestral</MenuItem>
            <MenuItem value="semestre">Anual</MenuItem>
          </TextField>

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
              {'Salvar'}
            </AppButton>
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
}

export default CreateSchoolConfigurationsView;
