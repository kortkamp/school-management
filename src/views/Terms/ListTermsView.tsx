/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';

import { useEffect, useState } from 'react';
import { AppIconButton, AppLoading } from '../../components';
import { IListTerms, termsService } from '../../services/terms.service';
import Moment from 'moment';

import { useApi } from '../../api/useApi';
import { TermType } from '../../services/models/ITerm';
import { sortByDate } from '../../utils/sort';
import { makeStyles } from '@mui/styles';
import { AppAddButton, AppSaveButton } from '../../components/AppCustomButton';

import * as yup from 'yup';

const termSchema = yup.object().shape({
  name: yup.string().required('O campo é obrigatório'),
  start_at: yup.date().required('O campo é obrigatório').typeError('Data inválida'),
  end_at: yup
    .date()
    .required('O campo é obrigatório')
    .typeError('Data inválida')
    .min(yup.ref('start_at'), 'A data de término precisa ser posterior à data inicial'),
});

const useStyles = makeStyles((theme) => ({
  termRow: {
    '&:hover': {
      // backgroundColor: theme.palette.secondary.dark,
    },
  },
  recoveringRow: {
    // backgroundColor: theme.palette.secondary.light,
  },
}));

interface Props {
  onSuccess?: () => void;
}

type IError = Record<string, Record<string, string[]>>;

/**
 * Renders "ListTermsView" view
 * url: /bimestres/*
 */
const ListTermsView = ({ onSuccess = () => {} }: Props) => {
  const [data, , loading] = useApi(termsService.getAll, {});

  const [, , isRemoving, removeTerm] = useApi(termsService.remove, { isRequest: true });
  const [, , isCreating, createTerm] = useApi(termsService.create, { isRequest: true });
  const [, , isSaving, saveTerm] = useApi(termsService.update, { isRequest: true });

  const [terms, setTerms] = useState<IListTerms['terms']>([]);

  const [termsTouched, setTermsTouched] = useState<string[]>([]);
  const [errors, setErrors] = useState<IError | undefined>();

  const classes = useStyles();

  useEffect(() => {
    if (data?.terms) {
      setTerms(sortByDate(data?.terms, 'start_at'));
    }
  }, [data]);

  const validate = async () => {
    let isValid: any = true;
    const newErrors: any = {};

    const termValidations = terms.map(async (term) => {
      const termErrors: any = {};
      try {
        await termSchema.validate(term, { abortEarly: false, stripUnknown: true });
      } catch (err: any) {
        const { inner } = err as yup.ValidationError;
        inner.forEach((error: any) => (termErrors[error.path] = [error.message]));
        isValid = false;
      }
      newErrors[term.id] = termErrors;
    });
    await Promise.all(termValidations);
    setErrors(newErrors);

    return isValid;
  };

  useEffect(() => {
    if (errors) {
      validate();
    }
  }, [terms]);

  const fieldHasError = (termId: string, field: string) => errors?.[termId]?.[field] !== undefined;
  const fieldGetError = (termId: string, field: string) =>
    errors?.[termId]?.[field] ? errors?.[termId]?.[field][0] : '';

  const handleChangeValue = (termId: string, event: any) => {
    const updatedTerms = terms.map((term) => {
      if (term.id === termId) {
        return { ...term, [event.target.name as 'id']: event.target.value };
      }
      return term;
    });

    if (!termsTouched.includes(termId)) {
      setTermsTouched((previous) => previous.concat([termId]));
    }
    // updatedTerms[termIndex][event.target.name as 'id'] = event.target.value;

    setTerms(updatedTerms);
  };

  const handleRemoveTerm = async (termId: string) => {
    const removeResponse = await removeTerm({ id: termId });
    if (removeResponse?.success) {
      const updatedTerms = terms.filter((term) => term.id !== termId);
      setTerms(updatedTerms);
    }
  };

  const handleSaveTerms = async () => {
    if (!(await validate())) {
      return;
    }
    const saveTermsPromises = termsTouched.map((termTouchedId) => {
      const updatedTerm = terms.find((term) => term.id === termTouchedId);
      if (updatedTerm) {
        const { name, start_at, end_at, type } = updatedTerm;
        return saveTerm({ id: updatedTerm.id, data: { name, start_at, end_at, type } });
      }
    });
    const responseAll = await Promise.all(saveTermsPromises);
    const isAllSuccessfullySaved = responseAll.every((response) => response?.success);
    if (isAllSuccessfullySaved) {
      onSuccess();
      return;
    }
    const successfullyResponse = responseAll.filter((response) => response?.success === true);
    const successfullySavedTermsIds = successfullyResponse.map((response) => response?.term?.id) as string[];

    setTermsTouched((previousTouched) =>
      previousTouched.filter((touched) => !successfullySavedTermsIds.includes(touched))
    );
  };

  const handleAddTerm = async () => {
    const createResponse = await createTerm({});

    if (createResponse?.success && createResponse?.term) {
      const updatedTerms = terms.concat([createResponse.term]);
      setTerms(updatedTerms);
    }
  };

  if (loading) {
    return <AppLoading />;
  }
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card style={{ padding: '20px' }}>
          <CardHeader
            style={{ textAlign: 'center' }}
            title="Períodos do Ano"
            subheader="Lista períodos do ano letivo"
          />
          <CardContent>
            <TableContainer component={Paper} sx={{ minWidth: 350, minHeight: 100 }}>
              {loading ? (
                <AppLoading />
              ) : (
                <Table sx={{ minWidth: 350 }} size="small" aria-label="a dense table">
                  <colgroup>
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="20%" />
                    <col width="10%" />
                  </colgroup>
                  <TableHead>
                    <TableRow>
                      <TableCell>Nome</TableCell>
                      <TableCell>Início</TableCell>
                      <TableCell>Término</TableCell>
                      <TableCell>Tipo</TableCell>
                      <TableCell>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {terms.map((term) => (
                      <TableRow
                        key={term.id}
                        className={term.type === 'recuperação' ? classes.recoveringRow : classes.termRow}
                      >
                        <TableCell component="th" scope="row">
                          <TextField
                            required
                            name="name"
                            placeholder="Nome do período"
                            value={term.name}
                            onChange={(event) => handleChangeValue(term.id, event)}
                            variant="standard"
                            error={fieldHasError(term.id, 'name')}
                            helperText={fieldGetError(term.id, 'name')}
                            InputProps={{ disableUnderline: !fieldHasError(term.id, 'name') }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <TextField
                            required
                            name="start_at"
                            type="date"
                            value={term.start_at ? Moment(term.start_at).format('YYYY-MM-DD') : ''}
                            onChange={(event) => handleChangeValue(term.id, event)}
                            variant="standard"
                            error={fieldHasError(term.id, 'start_at')}
                            helperText={fieldGetError(term.id, 'start_at')}
                            InputProps={{ disableUnderline: !fieldHasError(term.id, 'start_at') }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <TextField
                            required
                            name="end_at"
                            type="date"
                            value={term.end_at ? Moment(term.end_at).format('YYYY-MM-DD') : ''}
                            onChange={(event) => handleChangeValue(term.id, event)}
                            variant="standard"
                            error={fieldHasError(term.id, 'end_at')}
                            helperText={fieldGetError(term.id, 'end_at')}
                            InputProps={{ disableUnderline: !fieldHasError(term.id, 'end_at') }}
                          />
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <TextField
                            required
                            name="type"
                            select
                            value={term.type}
                            onChange={(event) => handleChangeValue(term.id, event)}
                            variant="standard"
                            InputProps={{ disableUnderline: true }}
                          >
                            {Object.values(TermType).map((termType) => (
                              <MenuItem key={termType} value={termType}>
                                {termType}
                              </MenuItem>
                            ))}
                          </TextField>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <AppIconButton title="Apagar" icon="delete" onClick={() => handleRemoveTerm(term.id)} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </CardContent>
          <CardActions>
            <AppAddButton disabled={isCreating} loading={isCreating} onClick={() => handleAddTerm()} />
            <AppSaveButton disabled={termsTouched.length === 0} loading={isSaving} onClick={() => handleSaveTerms()} />
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ListTermsView;
