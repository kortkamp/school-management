import { Card, CardActions, CardContent, CardHeader, Grid, CircularProgress, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { studentsService } from '../../services/students.service';

/**
 * Renders "StudentsListView" view
 * url: /alunos/*
 */
const StudentsListView = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const loadClassGroupsList = useCallback(async () => {
    // try{
    const response = await studentsService.getAll();
    setStudents(response.data.result);
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
      field: 'email',
      headerName: 'Email',
      width: 150,
      valueGetter: (params: any) => {
        return params.row.email;
      },
    },
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
        <Card>
          <CardHeader style={{ textAlign: 'center' }} title="Alunos" subheader="Lista de alunos" />
          <CardContent>Detailed description of the application here...</CardContent>

          <DataGrid
            rows={students}
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

export default StudentsListView;
