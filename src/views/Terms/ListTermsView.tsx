import { Card, CardActions, CardContent, CardHeader, Grid, CircularProgress, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AppButton, AppLink } from '../../components';
import AppAllocationSelect, { IAllocation } from '../../components/AppAllocationSelect/AppAllocationSelect';
import { classGroupsService } from '../../services/classGroups.service';
import { IListTerms, termsService } from '../../services/terms.service';
import Moment from 'moment';

/**
 * Renders "ListTermsView" view
 * url: /bimestres/*
 */
const ListTermsView = () => {
  const [terms, setTerms] = useState<IListTerms[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const loadClassGroupsList = useCallback(async () => {
    let componentMounted = true;

    const fetchData = async () => {
      const termsResponse = await termsService.getAll();

      if (!componentMounted) {
        return;
      }

      setTerms(termsResponse);
      setLoading(false);
    };

    fetchData();
    return () => {
      componentMounted = false;
    };
  }, []);

  useEffect(() => {
    loadClassGroupsList();
  }, [loadClassGroupsList]);

  if (loading)
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', minWidth: '100%' }}
      >
        <Grid item xs={3}>
          <CircularProgress />
        </Grid>
      </Grid>
    );

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
      width: 150,
      renderCell: (params: any) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          history.push('/bimestres/' + params.row.id);
        };

        return <AppButton onClick={onClick}>Editar</AppButton>;
      },
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card style={{ padding: '20px' }}>
          <CardHeader style={{ textAlign: 'center' }} title="Bimestres" subheader="Lista de bimestres" />
          <CardContent>
            <DataGrid rows={terms} columns={columns} pageSize={5} hideFooter rowsPerPageOptions={[5]} autoHeight />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ListTermsView;
