/* eslint-disable @typescript-eslint/naming-convention */
import clsx from 'clsx';
import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Grid, TextField, Card, CardHeader, CardContent, MenuItem } from '@mui/material';
import { useAppStore } from '../../store';
import { AppButton, AppForm } from '../../components';
import { useAppForm, SHARED_CONTROL_PROPS } from '../../utils/form';
import makeStyles from '@mui/styles/makeStyles';

// import * as yup from 'yup';
import NumberFormat from 'react-number-format';
import { RecoveringPeriod, RecoveringType, ResultCalculation, TermTypes } from '../../services/models/ISchoolConfigs';
import { toast } from 'react-toastify';
import { capitalizeFirstLetter } from '../../utils/string';

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
  passing_note: number | '';
  minimum_attendance: number | '';
  class_duration: number | '';
  term_type: string;
  recovering_period: string;
  recovering_type: string;
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
  class_duration: {
    description: 'O tempo de duração em minutos para cada aula',
  },
  term_type: {
    description: 'A forma em que o ano letivo é divido(Ex: bimestres, trimestres, ...)',
  },
  recovering_period: {
    description: 'Quando ocorre o período de recuperação',
    [RecoveringPeriod.BIMESTER]: 'Ocorre um período de recuperação a cada bimestre',
    [RecoveringPeriod.TRIMESTER]: 'Ocorre um período de recuperação a cada trimestre',
    [RecoveringPeriod.QUADMESTER]: 'Ocorre um período de recuperação a cada quadrimestre',
    [RecoveringPeriod.SEMESTER]: 'Ocorre um período de recuperação a cada semestre',
    [RecoveringPeriod.YEAR]: 'Ocorre um período de recuperação ao final do nao letivo',
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

/**
 * Renders "Create Schools Definitions" view
 * url: /escola/definir
 */
function CreateSchoolConfigurationsView() {
  const classes = useStyles();

  const classInput = clsx(classes.formInputStart, classes.formInput);

  const history = useHistory();
  const [, dispatch] = useAppStore();

  // const { id } = useParams<{ id: string }>();
  // const isEditing = id ? true : false;

  const [isSaving, setIsSaving] = useState(false);

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
      result_calculation: '',
      passing_note: '',
      minimum_attendance: '',
      class_duration: '',
      term_type: '',
      recovering_period: '',
      recovering_type: '',
    } as FormStateValues,
  });

  const values = formState.values as FormStateValues; // Typed alias to formState.values as the "Source of Truth"

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      setIsSaving(true);
      toast.info('Funcionalidade ainda nao implementada', {
        onClose: () => {
          setIsSaving(false);
        },
      });
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

  return (
    <AppForm onSubmit={handleFormSubmit} style={{ minWidth: '100%', marginTop: '50px' }}>
      <Card>
        <CardHeader style={{ textAlign: 'center' }} title="Escola" subheader={'Definir funcionamento da escola'} />
        <CardContent>
          <Grid container spacing={1}>
            <Grid item md={6} sm={12} xs={12}>
              <TextField
                //required
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
                //required
                className={classInput}
                label="Nota de Corte"
                name="passing_note"
                value={values.passing_note}
                onChange={onFieldChange}
                helperText={helperText.passing_note.description}
                {...SHARED_CONTROL_PROPS}
              />
            </Grid>

            {values.passing_note && values.result_calculation && (
              <>
                <Grid item md={6} sm={12} xs={12}>
                  <NumberFormat
                    {...SHARED_CONTROL_PROPS}
                    label="Mínimo de presença"
                    className={classInput}
                    //required
                    value={values.minimum_attendance}
                    name="minimum_attendance"
                    format="###%"
                    customInput={TextField}
                    type="tel"
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
                    className={classInput}
                    label="Duração de cada aula"
                    //required
                    value={values.class_duration}
                    name="class_duration"
                    format="### minutos"
                    customInput={TextField}
                    type="tel"
                    helperText={helperText.class_duration.description}
                    onValueChange={({ value: v }) => {
                      onFieldChange({ target: { name: 'class_duration', value: v } });
                    }}
                  />
                </Grid>
              </>
            )}

            {values.class_duration && values.minimum_attendance && (
              <>
                <Grid item md={12} sm={12} xs={12}>
                  <TextField
                    //required
                    className={classInput}
                    label="Divisões do Ano"
                    name="term_type"
                    select
                    value={values.term_type}
                    onChange={onFieldChange}
                    helperText={helperText.term_type.description}
                    {...SHARED_CONTROL_PROPS}
                  >
                    {Object.values(TermTypes).map((termType) => (
                      <MenuItem key={termType} value={termType}>
                        {capitalizeFirstLetter(termType) + 's'}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    //required
                    className={classInput}
                    label="Período de recuperação"
                    name="recovering_period"
                    select
                    value={values.recovering_period}
                    onChange={onFieldChange}
                    helperText={
                      helperText.recovering_period[values.recovering_period] || helperText.recovering_period.description
                    }
                    {...SHARED_CONTROL_PROPS}
                  >
                    {Object.values(RecoveringPeriod).map((recoveringPeriod) => (
                      <MenuItem key={recoveringPeriod} value={recoveringPeriod}>
                        {capitalizeFirstLetter(recoveringPeriod)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item md={6} sm={12} xs={12}>
                  <TextField
                    //required
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
