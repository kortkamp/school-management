import { Card, CardActions, CardContent, CardHeader, Grid, CircularProgress, Button } from '@mui/material';
import { DataGrid, GridOverlay } from '@mui/x-data-grid';
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import { AppButton, AppLink, AppLoading } from '../../components';
import AppAllocationSelect, { IAllocation } from '../../components/AppAllocationSelect/AppAllocationSelect';
import { classGroupsService } from '../../services/classGroups.service';
import { IListTerms, termsService } from '../../services/terms.service';
import Moment from 'moment';
import { CommonDialog } from '../../components/dialogs';
import { useAppMessage } from '../../utils/message';

/**
 * Renders "ListTermsView" view
 * url: /bimestres/*
 */
const ListTermsView = () => {
  const [terms, setTerms] = useState<IListTerms[]>([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState<ReactNode | null>(null);

  const [AppMessage, setMessage] = useAppMessage();

  const history = useHistory();

  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadTermsList = useCallback(async () => {
    const fetchData = async () => {
      const termsResponse = await termsService.getAll();

      if (!mounted.current) {
        return;
      }

      setTerms(termsResponse);
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    loadTermsList();
  }, [loadTermsList]);

  const confirmDeleteTerm = async (termId: string) => {
    setLoading(true);
    try {
      await termsService.remove(termId);
      setTerms((terms) => terms.filter((term) => term.id !== termId));
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response.data.message });
      // console.log(err);
    }
    setLoading(false);
  };

  const handleDeleteTerm = async (term: IListTerms) => {
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

  // if (loading) return <AppLoading />;

  const columns = [
    { field: 'name', headerName: 'Nome', width: 150 },
    {
      field: 'year',
      headerName: 'Ano',
      width: 150,
    },
    {
      field: 'start_at',
      headerName: 'Início',
      width: 150,
      valueGetter: (params: any) => params && Moment(params.row.start_at).utcOffset('+0300').format('DD-MM-YYYY'),
    },
    {
      field: 'end_at',
      headerName: 'Término',
      width: 150,
      valueGetter: (params: any) => params && Moment(params.row.end_at).utcOffset('+0300').format('DD-MM-YYYY'),
    },

    {
      field: 'action',
      headerName: 'Ações',
      sortable: false,
      width: 250,
      renderCell: (params: any) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          history.push('/bimestres/' + params.row.id);
        };

        return (
          <>
            <AppButton onClick={onClick}>Editar</AppButton>
            <AppButton
              color="error"
              onClick={() => {
                handleDeleteTerm(params.row);
              }}
            >
              Remover
            </AppButton>
          </>
        );
      },
    },
  ];

  return (
    <>
      {modal}
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card style={{ padding: '20px' }}>
            <CardHeader style={{ textAlign: 'center' }} title="Bimestres" subheader="Lista de bimestres" />
            <CardContent>
              <DataGrid
                rows={terms}
                loading={loading}
                columns={columns}
                pageSize={5}
                hideFooter
                rowsPerPageOptions={[5]}
                autoHeight
                components={{
                  NoRowsOverlay: () => (
                    <GridOverlay>
                      <div>Nenhum bimestre encontrado</div>
                    </GridOverlay>
                  ),
                }}
              />
              <Grid item md={12} sm={12} xs={12}>
                <AppMessage />
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ListTermsView;
