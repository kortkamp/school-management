import { Card, CardActions, CardContent, CardHeader, Grid, CircularProgress, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { AppButton, AppLink } from '../../components';
import AppAllocationSelect, { IAllocation } from '../../components/AppAllocationSelect/AppAllocationSelect';
import { classGroupsService } from '../../services/classGroups.service';

/**
 * Renders "ClassGroups" view
 * url: /professores/*
 */
const ClassGroupsView = () => {
  const [classGroups, setClassGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [allocation, setAllocation] = useState<IAllocation>({
    segmentId: '',
    gradeId: '',
    classGroupId: '',
  });

  const history = useHistory();

  const loadClassGroupsList = useCallback(async () => {
    // try{
    const response = await classGroupsService.getAll();
    setClassGroups(response.data.classGroups);
    setLoading(false);

    // } catch(err:any){
    //     throw new Error('err')
    //   }
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
          <h1>Carregando...</h1>
        </Grid>
      </Grid>
    );

  const columns = [
    { field: 'name', headerName: 'Nome', width: 150 },
    {
      field: 'grade',
      headerName: 'Ano',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.grade?.name;
      },
    },
    {
      field: 'segment',
      headerName: 'Segmento',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.grade?.segment?.name;
      },
    },
    { field: 'students_count', headerName: 'Alunos', width: 150 },
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      renderCell: (params: any) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking
          history.push('/turmas/' + params.row.id);
        };

        return <Button onClick={onClick}>Mostrar</Button>;
      },
    },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card style={{ padding: '20px' }}>
          <CardHeader style={{ textAlign: 'center' }} title="Turmas" subheader="Lista de turmas" />
          <CardContent>Detailed description of the application here...</CardContent>
          <Grid container spacing={1}>
            <AppAllocationSelect onChange={setAllocation} />
          </Grid>

          <DataGrid
            rows={classGroups}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            autoHeight
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ClassGroupsView;
