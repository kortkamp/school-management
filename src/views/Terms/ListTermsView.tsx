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
import { ReactNode, useEffect, useState } from 'react';
import { AppButton, AppIcon, AppIconButton, AppLoading } from '../../components';
import { IListTerms, termsService } from '../../services/terms.service';
import Moment from 'moment';
import { CommonDialog } from '../../components/dialogs';

import { useApi } from '../../api/useApi';
import { TermType } from '../../services/models/ITerm';
import { sortByField } from '../../utils/sort';

/**
 * Renders "ListTermsView" view
 * url: /bimestres/*
 */
const ListTermsView = () => {
  const { data, loading } = useApi(termsService.getAll, {}); //as ApiType<typeof termsService.getAll>;

  const [terms, setTerms] = useState<IListTerms['terms']>([]);

  const [modal, setModal] = useState<ReactNode | null>(null);

  useEffect(() => {
    if (data?.terms) {
      setTerms(data?.terms);
      console.log('set terms');
    }
  }, [data]);

  const confirmDeleteTerm = async (termId: string) => {
    // setLoading(true);
    try {
      await termsService.remove(termId);
      // setTerms((t) => t.filter((term) => term.id !== termId));
    } catch (err: any) {
      // console.log(err);
    }
    // setLoading(false);
  };

  const handleChangeValue = (termId: string, event: any) => {
    const updatedTerms = terms.map((term) => {
      if (term.id === termId) {
        return { ...term, [event.target.name as 'id']: event.target.value };
      }
      return term;
    });

    // updatedTerms[termIndex][event.target.name as 'id'] = event.target.value;

    setTerms(updatedTerms);
  };

  const handleRemoveTerm = (termId: string) => {
    // should request api to delete
    const updatedTerms = terms.filter((term) => term.id !== termId);

    setTerms(updatedTerms);
  };

  const handleAddTerm = () => {
    // should request api to delete
    const updatedTerms = terms.concat([
      { id: String(Math.random()), name: '', start_at: new Date(), end_at: new Date(), type: TermType.STANDARD },
    ]);
    setTerms(updatedTerms);
  };

  const handleDeleteTerm = async (term: any) => {
    setModal(
      <CommonDialog
        open
        data=""
        title="Deseja realmente excluir?"
        body={
          <>
            <h2>{term.name}</h2>
          </>
        }
        confirmButtonText="Confirmar a exclusão"
        confirmButtonColor="warning"
        onClose={() => {
          setModal(null);
        }}
        onConfirm={() => {
          setModal(null);
          confirmDeleteTerm(term.id);
        }}
      />
    );
  };

  if (loading) {
    return <AppLoading />;
  }
  return (
    <>
      {modal}

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
                      <col width="20%" />
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
                        <TableRow key={term.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">
                            <TextField
                              required
                              name="name"
                              placeholder="Nome do período"
                              value={term.name}
                              onChange={(event) => handleChangeValue(term.id, event)}
                              variant="standard"
                              InputProps={{ disableUnderline: true }}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <TextField
                              required
                              name="start_at"
                              type="date"
                              value={Moment(term.start_at).format('YYYY-MM-DD')}
                              onChange={(event) => handleChangeValue(term.id, event)}
                              variant="standard"
                              InputProps={{ disableUnderline: true }}
                            />
                          </TableCell>
                          <TableCell component="th" scope="row">
                            <TextField
                              required
                              name="end_at"
                              type="date"
                              value={Moment(term.end_at).format('YYYY-MM-DD')}
                              onChange={(event) => handleChangeValue(term.id, event)}
                              variant="standard"
                              InputProps={{ disableUnderline: true }}
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
              <AppButton color="success" onClick={() => handleAddTerm()}>
                Adicionar
              </AppButton>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ListTermsView;
