/* eslint-disable @typescript-eslint/no-shadow */
import { SyntheticEvent, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent } from '@mui/material';

import { AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import { AppSaveButton } from '../../components/AppCustomButton';

import * as yup from 'yup';
import { useRequestApi } from '../../api/useApi';
import { schoolYearsService } from '../../services/schoolYears.service';
import { toast } from 'react-toastify';

interface Props {
  onSuccess?: () => void;
}

interface FormStateValues {
  name: string;
  start_at: Date | '';
  end_at: Date | '';
}

const createSchoolYearSchema = {
  name: yup.string().length(4, 'Ano inválido').required('O campo é obrigatório'),
  start_at: yup.date().required('O campo é obrigatório'),
  end_at: yup
    .date()
    .default(null)
    .when(
      'start_at',
      (started, yup) => started && yup.min(started, 'A data de término deve ser posterior à data de início')
    )
    .required('O campo é obrigatório'),
};

/**
 * Renders "Create Exam" view
 * url: /exames/criar
 */
const CreateSchoolYear: React.FC<Props> = ({ onSuccess = () => {} }: Props) => {
  const [createSchoolYear, isSaving] = useRequestApi(schoolYearsService.create);
  const history = useHistory();

  const [formState, , onFieldChange, fieldGetError, fieldHasError, ,] = useAppForm({
    validationSchema: createSchoolYearSchema,
    initialValues: {
      name: '',
      start_at: '',
      end_at: '',
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues;

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const response = await createSchoolYear(values);

      if (response?.success) {
        toast.success('Ano Letivo criado com sucesso');
        onSuccess();
      }

      console.log(response);
    },
    [values, history]
  );

  return (
    <AppForm onSubmit={handleFormSubmit}>
      <Card style={{ marginTop: '50px' }}>
        <CardHeader style={{ textAlign: 'center' }} title={'Criar Ano Letivo'} />
        <CardContent>
          <TextField
            required
            label="Ano"
            name="name"
            type="number"
            value={values.name}
            onChange={onFieldChange}
            error={fieldHasError('name')}
            helperText={fieldGetError('name') || ' '}
            {...SHARED_CONTROL_PROPS}
          ></TextField>

          <TextField
            required
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Início"
            name="start_at"
            value={values.start_at}
            onChange={onFieldChange}
            error={fieldHasError('start_at')}
            helperText={fieldGetError('start_at') || ' '}
            {...SHARED_CONTROL_PROPS}
          />

          <TextField
            required
            type="date"
            InputLabelProps={{ shrink: true }}
            label="Término"
            name="end_at"
            value={values.end_at}
            onChange={onFieldChange}
            error={fieldHasError('end_at')}
            helperText={fieldGetError('end_at') || ' '}
            {...SHARED_CONTROL_PROPS}
          />

          <Grid container justifyContent="center" alignItems="center">
            <AppSaveButton label="Criar" type="submit" loading={isSaving} disabled={isSaving} />
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
};

export default CreateSchoolYear;
