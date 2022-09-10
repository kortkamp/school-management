/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from 'react';
import { Grid, TextField, Card, CardHeader, CardContent, Box, TableContainer, Paper, Alert } from '@mui/material';

import { AppSaveButton } from '../../components/AppCustomButton';

import * as yup from 'yup';
import { useApi, useRequestApi } from '../../api/useApi';
import { schoolYearsService } from '../../services/schoolYears.service';
import { TermType } from '../../services/models/ITerm';
import TermsTable, { ITermData } from './components/TermsTable';
import AppContextMenu from '../../components/AppContextMenu';
import { generateTempID, isTempID } from '../../utils/tempID';
import { toast } from 'react-toastify';
import { AppButton, AppIcon, AppLoading } from '../../components';
import Moment from 'moment';
import { schoolsService } from '../../services/schools.service';

interface Props {
  onSuccess?: () => void;
}

interface FormStateValues {
  id?: string;
  name: string;
  start_at: Date | undefined;
  end_at: Date | undefined;
  terms: ITermData[];
}

const schoolYearValidationSchema = yup.object().shape({
  name: yup.string().length(4, 'Ano inválido').required('O campo é obrigatório'),
  start_at: yup.date().required('O campo é obrigatório'),
  end_at: yup
    .date()
    .when(
      'start_at',
      (started, yup) => started && yup.min(started, 'A data de término deve ser posterior à data de início')
    )
    .required('O campo é obrigatório'),
  terms: yup.array().min(1, 'Pelo menos um período é necessário'),
});
const termsValidationSchema = yup.object().shape({
  name: yup.string().required('O campo é obrigatório'),
  start_at: yup.date().required('O campo é obrigatório'),
  end_at: yup
    .date()
    .when(
      'start_at',
      (started, yup) => started && yup.min(started, 'A data de término deve ser posterior à data de início')
    )
    .required('O campo é obrigatório'),
});

const defaultData: FormStateValues = {
  name: '',
  start_at: undefined,
  end_at: undefined,
  terms: [],
};
/**
 * Renders "Create Exam" view
 * url: /exames/criar
 */
const CreateSchoolYear: React.FC<Props> = ({ onSuccess = () => {} }: Props) => {
  const [createSchoolYear, isSaving] = useRequestApi(schoolYearsService.create);
  const [updateSchoolYear, isUpdating] = useRequestApi(schoolYearsService.update);
  const [closeSchoolYear, isClosing] = useRequestApi(schoolYearsService.close);

  const [getSchoolParameters, , getParametersError] = useRequestApi(schoolsService.getSchoolParameters);

  const [data, error] = useApi(schoolYearsService.getBySchool, {}, { silent: true });

  const [isLoading, setIsLoading] = useState(true);

  const [schoolYear, setSchoolYear] = useState<FormStateValues>(defaultData);

  const [validationErrors, setValidationErrors] = useState<any>({});

  const [isCreatingNewSchoolYear, setIsCreatingNewSchoolYear] = useState(true);

  const [editable, setEditable] = useState(true);

  const generateYearTerms = async () => {
    const response = await getSchoolParameters({});
    if (response?.success) {
      const { schoolParameters } = response;

      const generatedTerms: ITermData[] = [];

      for (let i = 1; i <= schoolParameters.term_number; i += 1) {
        const term: ITermData = {
          id: generateTempID(),
          name: `${i}º ${schoolParameters.term_period}`,

          type: TermType.STANDARD,
        };
        generatedTerms.push(term);
        if (schoolParameters.recovering_coverage > 0) {
          const isLastTermOfAbrangence = i % schoolParameters.recovering_coverage === 0;
          const recoveringTerm: ITermData = {
            id: generateTempID(),
            name: `Recuperação Parcial`,

            type: TermType.RECOVERING,
          };
          if (isLastTermOfAbrangence) {
            generatedTerms.push(recoveringTerm);
          }
        }
      }
      if (schoolParameters.final_recovering) {
        const recoveringTerm: ITermData = {
          id: generateTempID(),
          name: `Recuperação Final`,

          type: TermType.RECOVERING,
        };
        generatedTerms.push(recoveringTerm);
      }

      setSchoolYear((prev) => ({ ...prev, terms: generatedTerms }));
    }
  };

  useEffect(() => {
    if (data?.success) {
      setSchoolYear(data.schoolYear);
      setEditable(false);
      setIsCreatingNewSchoolYear(false);
    } else {
      generateYearTerms();
    }
    if (data || error) {
      setIsLoading(false);
    }
  }, [data, error]);

  const validate = async () => {
    let errors: any = {}; //validate(formState.values, validationSchema);
    let termsErrors: any = {};
    let isValid: any = false;
    try {
      isValid = await schoolYearValidationSchema.validate(schoolYear, { abortEarly: false, stripUnknown: true });
    } catch (err: any) {
      const { inner } = err as yup.ValidationError;

      inner?.forEach((error: any) => (errors[error.path] = [error.message]));
    }

    const termsValidation = schoolYear.terms.map(async (term) => {
      try {
        await termsValidationSchema.validate(term, { abortEarly: false, stripUnknown: true });
      } catch (err: any) {
        const { inner } = err as yup.ValidationError;
        isValid = false;
        termsErrors = { ...termsErrors, [term.id]: { ...termsErrors[term.id] } };

        inner?.forEach((error: any) => (termsErrors[term.id][error.path] = [error.message]));
      }
    });
    await Promise.all(termsValidation);
    errors.terms = termsErrors;
    setValidationErrors(errors);

    console.log();

    return isValid;
  };

  useEffect(() => {
    function isEmpty(obj: object) {
      return Object.keys(obj).length === 0;
    }

    if (!isEmpty(validationErrors)) {
      validate();
    }
  }, [schoolYear]);

  const handleClickSaveButton = async () => {
    const isValid = await validate();
    if (!isValid) {
      return;
    }
    const terms = schoolYear.terms.map((term) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { id, name, start_at, end_at, type } = term;
      if (isTempID(id)) {
        return { name, start_at, end_at, type };
      }
      return { id, name, start_at, end_at, type };
    });

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { name, start_at, end_at } = schoolYear;

    const data = { name, start_at, end_at, terms };

    let response;

    if (isCreatingNewSchoolYear) {
      response = await createSchoolYear({ data });
    } else {
      response = await updateSchoolYear({ id: schoolYear.id, data });
    }

    if (response?.success) {
      toast.success('Ano Letivo salvo com sucesso');
      setEditable(false);
      onSuccess();
    }
  };

  const handleCloseSchoolYear = async () => {
    const response = await closeSchoolYear({ id: schoolYear.id });
    if (response?.success) {
      toast.success('Ano Letivo encerrado com sucesso');
    }
  };

  const handleAddTerm = () => {
    const newTerms = schoolYear.terms.concat([{ id: generateTempID(), name: '', type: TermType.STANDARD }]);

    setSchoolYear((previous) => ({ ...previous, terms: newTerms }));
  };

  const handleRemoveTerm = (termId: string) => {
    const newTerms = schoolYear.terms.filter((term) => term.id !== termId);

    setSchoolYear((previous) => ({ ...previous, terms: newTerms }));
  };

  const onFieldChange = (event: any) => {
    setSchoolYear((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const onTermFieldChange = (termId: string, event: any) => {
    setSchoolYear((previous) => ({
      ...previous,
      terms: previous.terms.map((term) => {
        if (term.id === termId) {
          return { ...term, [event.target.name]: event.target.value };
        }
        return term;
      }),
    }));
  };

  if (isLoading) {
    return <AppLoading />;
  }

  if (getParametersError) {
    return <Alert severity="error">Para cadastrar um Ano Letivo é necessário antes cadastrar os Parâmetros</Alert>;
  }

  return (
    <Card>
      <CardHeader style={{ textAlign: 'center' }} title={isCreatingNewSchoolYear ? 'Novo Ano Letivo' : 'Ano Letivo'} />
      <CardContent>
        <TableContainer component={Paper} sx={{ minWidth: 350 }}>
          <Grid container style={{ padding: 15 }} spacing={4}>
            <Grid item md={12}>
              <Box display={'flex'} justifyContent="space-between" alignItems={'center'}>
                <TextField
                  required
                  name="name"
                  type="number"
                  variant="standard"
                  placeholder="Ano Letivo"
                  value={schoolYear.name}
                  onChange={onFieldChange}
                  error={Boolean(validationErrors.name)}
                  helperText={validationErrors.name || ' '}
                  InputProps={{ readOnly: !editable, disableUnderline: !editable, style: { fontSize: 30 } }}
                ></TextField>
                <AppContextMenu
                  // loading={isRemovingRoutineGroup}
                  options={[
                    {
                      label: 'Editar',
                      action: () => {
                        setEditable(true);
                      },
                    },
                  ]}
                />
              </Box>
            </Grid>

            <Grid item md={12} display={'flex'} justifyContent={'flex-start'} gap={2}>
              <TextField
                required
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                label="Início do Ano Letivo"
                name="start_at"
                value={schoolYear.start_at ? Moment(schoolYear.start_at).format('YYYY-MM-DD') : ''}
                InputProps={{ readOnly: !editable }}
                onChange={onFieldChange}
                error={Boolean(validationErrors.start_at)}
                helperText={validationErrors.start_at || ' '}
              />

              <TextField
                required
                type="date"
                size="small"
                InputLabelProps={{ shrink: true }}
                label="Término do Ano Letivo"
                name="end_at"
                value={schoolYear.end_at ? Moment(schoolYear.end_at).format('YYYY-MM-DD') : ''}
                InputProps={{ readOnly: !editable }}
                onChange={onFieldChange}
                error={Boolean(validationErrors.end_at)}
                helperText={validationErrors.end_at || ' '}
              />
            </Grid>
          </Grid>
          <TermsTable
            terms={schoolYear.terms}
            errors={validationErrors.terms}
            editable={editable}
            handleAddTerm={handleAddTerm}
            handleRemoveTerm={handleRemoveTerm}
            handleChangeValue={onTermFieldChange}
          />

          <Box display={'flex'} justifyContent="space-between" alignItems={'center'} style={{ padding: 7 }}>
            {editable && (
              <>
                <AppSaveButton
                  loading={isSaving || isUpdating}
                  disabled={isSaving || isUpdating}
                  onClick={() => handleClickSaveButton()}
                  // onClick={() => handleClickSaveButton()}
                  label={isCreatingNewSchoolYear ? 'Criar' : 'Gravar'}
                />
                {!isCreatingNewSchoolYear && (
                  <AppButton
                    startIcon={<AppIcon name="finish" />}
                    color="warning"
                    onClick={() => handleCloseSchoolYear()}
                    loading={isClosing}
                  >
                    Encerrar Ano Letivo
                  </AppButton>
                )}
              </>
            )}
          </Box>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default CreateSchoolYear;
