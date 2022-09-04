/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material';

import { useEffect, useState } from 'react';
import { AppIconButton } from '../../../components';
import Moment from 'moment';

import { TermType } from '../../../services/models/ITerm';
import { sortByDate } from '../../../utils/sort';
import { makeStyles } from '@mui/styles';

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

export interface ITermData {
  id: string;
  name: string;
  start_at: Date | '';
  end_at: Date | '';
  type: TermType;
}

interface Props {
  terms: ITermData[];
  editable?: boolean;
  handleAddTerm: () => void;
  handleRemoveTerm: (termId: string) => void;
  handleChangeValue: (termId: string, event: any) => void;
}

type IError = Record<string, Record<string, string[]>>;

const TermsTable = ({ editable = false, terms, handleAddTerm, handleRemoveTerm, handleChangeValue }: Props) => {
  const [errors, setErrors] = useState<IError | undefined>();

  const classes = useStyles();

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

  return (
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
          <TableRow key={term.id} className={term.type === 'recuperação' ? classes.recoveringRow : classes.termRow}>
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
                InputProps={{ disableUnderline: !editable, readOnly: !editable }}
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
                InputProps={{ disableUnderline: true, readOnly: !editable }}
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
                InputProps={{ disableUnderline: true, readOnly: !editable }}
              />
            </TableCell>
            <TableCell component="th" scope="row">
              <TextField
                required
                name="type"
                select={editable}
                value={term.type}
                onChange={(event) => handleChangeValue(term.id, event)}
                variant="standard"
                InputProps={{ disableUnderline: true, readOnly: !editable }}
              >
                {Object.values(TermType).map((termType) => (
                  <MenuItem key={termType} value={termType}>
                    {termType}
                  </MenuItem>
                ))}
              </TextField>
            </TableCell>
            <TableCell component="th" scope="row">
              {editable && <AppIconButton title="Apagar" icon="delete" onClick={() => handleRemoveTerm(term.id)} />}
            </TableCell>
          </TableRow>
        ))}
        {editable && (
          <TableRow>
            <TableCell component="th" scope="row">
              <AppIconButton icon="add" title="Adicionar período do ano" onClick={handleAddTerm} />
            </TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
            <TableCell component="th" scope="row"></TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TermsTable;
