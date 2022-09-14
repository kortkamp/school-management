/* eslint-disable @typescript-eslint/no-unused-vars */
import clsx from 'clsx';
import { SyntheticEvent, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, MenuItem } from '@mui/material';
import { useAppStore } from '../../store';
import { AppForm, AppLoading } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import makeStyles from '@mui/styles/makeStyles';

import NumberFormat from 'react-number-format';
import { RecoveringType, ResultCalculation, TermPeriod } from '../../services/models/ISchoolParameters';
import { capitalizeFirstLetter } from '../../utils/string';
import { useApi, useRequestApi } from '../../api/useApi';
import { schoolsService } from '../../services/schools.service';
import { AppSaveButton, AppClearButton } from '../../components/AppCustomButton';

const useStyles = makeStyles(() => ({
  formInputStart: {
    opacity: 0,
    transition: 'opacity 1.4s',
    color: 'red',
  },
  formInput: {
    opacity: 1,
    transition: 'opacity 1.4s',
  },
}));

const createTermSchema = {
  // recovering_type: yup.string().required('O campo é obrigatório'),
};

interface FormStateValues {
  result_calculation: string;
  passing_result: number | '';
  minimum_attendance: number | '';
  class_length: number | '';
  term_period: string;
  term_number: string | '';
  recovering_coverage: number | '';
  recovering_type: string;
  final_recovering: string;
}

interface Props {
  onSuccess?: (values: FormStateValues) => void;
}

const helperText: Record<string, Record<string, string>> = {
  result_calculation: {
    description: 'Define a forma de cálculo da nota final do ano letivo',
    [ResultCalculation.SUM]: 'Todas as notas são somadas ao longo dos períodos letivos(ex: bimestres)',
    [ResultCalculation.MEAN]: 'A nota final é definida pela média das notas dos períodos letivos(ex: bimestres)',
  },
  passing_note: {
    description: 'A nota mínima que o aluno precisa obter para ser aprovado no ano letivo',
  },
  minimum_attendance: {
    description: 'O percentual mínimo de presença para que o aluno seja aprovado no ano letivo',
  },
  class_length: {
    description: 'O tempo de duração em minutos para cada aula',
  },
  term_period: {
    description: 'A forma em que o ano letivo é divido(Ex: bimestres, trimestres, ...)',
  },
  term_number: {
    description: 'A quantidade períodos em que o ano letivo é dividido(Ex: 4 Bimestres, 2 Semestres, etc)',
  },
  recovering_coverage: {
    description: 'De quantos em quantos períodos ocorre uma recuperação',
  },

  recovering_type: {
    description: 'A forma em que a nota do período de recuperação é aplicada ao período de abrangência',
    [RecoveringType.SUM]: 'A nota de recuperação é somada à nota do período letivo de abrangência',
    [RecoveringType.MEAN]: 'É calculada a média entra a nota de recuperação e a nota do período letivo de abrangência',
    [RecoveringType.SUBSTITUTIVE]: 'A nota de recuperação substitui a nota do período letivo de abrangência',
    [RecoveringType.GREATER]:
      'É selecionada a maior nota entre a nota de recuperação e a nota do período letivo de abrangência',
  },
};

enum RecoveringSchemas {
  noRecovering = 'Sem períodos de recuperação',
  justFinal = 'Apenas recuperação final',
  byTerms = 'Recuperações ao longo do ano',
  byTermsAndFinal = 'Recuperação final e ao longo do ano',
}

const defaultValues = {
  result_calculation: '',
  passing_result: '',
  minimum_attendance: '',
  class_length: '',
  term_period: '',
  term_number: '',
  recovering_coverage: '',
  recovering_type: '',
  final_recovering: '',
} as FormStateValues;

/**
 * Renders "Create Schools Definitions" view
 * url: /escola/definir
 */
function CreateSchoolConfigurationsView({ onSuccess = () => {} }: Props) {
  const classes = useStyles();

  const [createSchoolParameters, isSaving] = useRequestApi(schoolsService.createSchoolParameters);

  const [schoolParametersData, , isLoading] = useApi(schoolsService.getSchoolParameters, { silent: true });

  const classInput = clsx(classes.formInputStart, classes.formInput);

  const history = useHistory();
  const [, dispatch] = useAppStore();

  const [formState, setFormState, onFieldChange] = useAppForm({
    validationSchema: createTermSchema,
    initialValues: { ...defaultValues } as FormStateValues,
  });

  const [recoveringSchema, setRecoveringSchema] = useState<'' | RecoveringSchemas>('');

  useEffect(() => {
    if (schoolParametersData?.success) {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { school_id, created_at, updated_at, ...data } = schoolParametersData.schoolParameters;
      setFormState((prev) => ({ ...prev, values: data }));
      setRecoveringSchema(RecoveringSchemas.noRecovering);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { final_recovering, recovering_type } = schoolParametersData.schoolParameters;
      if (recovering_type) {
        setRecoveringSchema(RecoveringSchemas.byTerms);
      }
      if (final_recovering) {
        setRecoveringSchema(RecoveringSchemas.justFinal);
      }
      if (recovering_type && final_recovering) {
        setRecoveringSchema(RecoveringSchemas.byTermsAndFinal);
      }
    }
  }, [schoolParametersData]);

  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();

      const response = await createSchoolParameters(values);
      if (response?.success) {
        onSuccess(values);
      }
    },
    [dispatch, values, history]
  );

  const handleCleanForm = () => {
    setFormState((prevState) => ({
      ...prevState,
      values: { ...defaultValues },
    }));
    setRecoveringSchema('');
  };

  const handleSelectRecoveringSchema = (event: any) => {
    setFormState((prevState) => ({
      ...prevState,
      values: { ...prevState.values, recovering_coverage: '', recovering_type: '', final_recovering: '' },
    }));
    setRecoveringSchema(event.target.value as RecoveringSchemas);
  };

  const showFinalRecovering = [RecoveringSchemas.justFinal, RecoveringSchemas.byTermsAndFinal].includes(
    recoveringSchema as RecoveringSchemas
  );

  const showTermsRecovering = [RecoveringSchemas.byTerms, RecoveringSchemas.byTermsAndFinal].includes(
    recoveringSchema as RecoveringSchemas
  );

  const showTerms = values.class_length && values.minimum_attendance;

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader style={{ textAlign: 'center' }} title="Escola" subheader={'Definir funcionamento da escola'} />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required
                className={classInput}
                label="Cálculo de nota final"
                name="result_calculation"
                select
                value={values.result_calculation}
                onChange={onFieldChange}
                helperText={
                  helperText.result_calculation[values.result_calculation] || helperText.result_calculation.description
                }
                {...SHARED_CONTROL_PROPS}
              >
                {Object.values(ResultCalculation).map((resultCalculation) => (
                  <MenuItem key={resultCalculation} value={resultCalculation}>
                    {capitalizeFirstLetter(resultCalculation)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item md={6} sm={12} xs={12}>
              <TextField
                required
                className={classInput}
                label="Nota de Corte"
                name="passing_result"
                value={values.passing_result}
                onChange={onFieldChange}
                helperText={helperText.passing_note.description}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            {values.passing_result && values.result_calculation && (
              <>
                <Grid item md={6} sm={12} xs={12}>
                  <NumberFormat
                    {...SHARED_CONTROL_PROPS}
                    required
                    label="Mínimo de presença"
                    className={classInput}
                    value={Number(values.minimum_attendance) || ''}
                    name="minimum_attendance"
                    format="###%"
                    customInput={TextField}
                    helperText={helperText.minimum_attendance.description}
                    isAllowed={({ floatValue }) => (floatValue ? floatValue <= 100 : true)}
                    onValueChange={({ value: v }) => {
                      onFieldChange({ target: { name: 'minimum_attendance', value: v } });
                    }}
                  />
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <NumberFormat
                    {...SHARED_CONTROL_PROPS}
                    required
                    className={classInput}
                    label="Duração de cada aula"
                    //required
                    value={values.class_length}
                    name="class_length"
                    format="### minutos"
                    customInput={TextField}
                    type="tel"
                    helperText={helperText.class_length.description}
                    onValueChange={({ value: v }) => {
                      onFieldChange({ target: { name: 'class_length', value: v } });
                    }}
                  />
                </Grid>
              </>
            )}

            {showTerms && (
              <>
                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    required
                    className={classInput}
                    label="Divisões do Ano"
                    name="term_period"
                    select
                    value={values.term_period}
                    onChange={onFieldChange}
                    helperText={helperText.term_period.description}
                    {...SHARED_CONTROL_PROPS}
                  >
                    {Object.values(TermPeriod).map((termPeriod) => (
                      <MenuItem key={termPeriod} value={termPeriod}>
                        {capitalizeFirstLetter(termPeriod) + 's'}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    required
                    className={classInput}
                    label="Quantidade de períodos"
                    name="term_number"
                    value={values.term_number}
                    onChange={onFieldChange}
                    helperText={helperText.term_number.description}
                    {...SHARED_CONTROL_PROPS}
                  />
                </Grid>

                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    required
                    className={classInput}
                    label="A Instituição trabalha com recuperação?"
                    name="recoveringSchema"
                    select
                    value={recoveringSchema}
                    onChange={handleSelectRecoveringSchema}
                    helperText={' '}
                    {...SHARED_CONTROL_PROPS}
                  >
                    {Object.values(RecoveringSchemas).map((recoveringSchemas) => (
                      <MenuItem key={recoveringSchemas} value={recoveringSchemas}>
                        {capitalizeFirstLetter(recoveringSchemas)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {showTermsRecovering && (
                  <>
                    <Grid item md={6} sm={12} xs={12}>
                      <TextField
                        required
                        className={classInput}
                        label={`Número de ${values.term_period}s por recuperação`}
                        name="recovering_coverage"
                        value={values.recovering_coverage}
                        onChange={onFieldChange}
                        helperText={
                          values.recovering_coverage
                            ? `Uma recuperação a cada ${values.recovering_coverage} ${values.term_period}(s)`
                            : helperText.recovering_coverage.description
                        }
                        {...SHARED_CONTROL_PROPS}
                      ></TextField>
                    </Grid>

                    <Grid item md={6} sm={12} xs={12}>
                      <TextField
                        required
                        className={classInput}
                        label="Tipo de recuperação"
                        name="recovering_type"
                        select
                        value={values.recovering_type}
                        onChange={onFieldChange}
                        helperText={
                          helperText.recovering_type[values.recovering_type] || helperText.recovering_type.description
                        }
                        {...SHARED_CONTROL_PROPS}
                      >
                        {Object.values(RecoveringType).map((recoveringType) => (
                          <MenuItem key={recoveringType} value={recoveringType}>
                            {capitalizeFirstLetter(recoveringType)}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </>
                )}

                {showFinalRecovering && (
                  <Grid item md={12} sm={12} xs={12}>
                    <TextField
                      required
                      className={classInput}
                      label="Tipo de recuperação Final"
                      name="final_recovering"
                      select
                      value={values.final_recovering}
                      onChange={onFieldChange}
                      helperText={
                        helperText.recovering_type[values.final_recovering] || helperText.recovering_type.description
                      }
                      {...SHARED_CONTROL_PROPS}
                    >
                      {Object.values(RecoveringType).map((recoveringType) => (
                        <MenuItem key={recoveringType} value={recoveringType}>
                          {capitalizeFirstLetter(recoveringType)}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                )}
              </>
            )}
          </Grid>

          <Grid container justifyContent="center" alignItems="center">
            <AppSaveButton type="submit" disabled={!formState.isValid || isSaving} loading={isSaving} />
            <AppClearButton
              onClick={() => {
                handleCleanForm();
              }}
            />
          </Grid>
        </CardContent>
      </Card>
    </AppForm>
  );
}

export default CreateSchoolConfigurationsView;
