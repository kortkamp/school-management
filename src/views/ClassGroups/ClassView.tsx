import { Card, CardActions, CardContent, CardHeader, Grid, CircularProgress, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { AppButton, AppLoading } from '../../components';
import { classGroupsService } from '../../services/classGroups.service';

/**
 * Renders "ClassGroups" view
 * url: /professores/*
 */
const ClassView = () => {
  const { id } = useParams<{ id: string }>();

  const [classGroup, setClassGroup] = useState<any>();
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  const loadClassGroupsList = useCallback(async () => {
    // try{
    const response = await classGroupsService.getById(id);
    setClassGroup(response.data.classGroup);
    setLoading(false);

    // } catch(err:any){
    //     throw new Error('err')
    //   }
  }, [id]);

  useEffect(() => {
    loadClassGroupsList();
  }, [loadClassGroupsList]);

  if (loading) return <AppLoading />;

  const columns = [
    { field: 'name', headerName: 'Nome', width: 150 },

    // {
    //   field: 'segment',
    //   headerName: 'Segmento',
    //   width: 150,
    //   valueGetter: (params: any) => {
    //     return params.row.grade?.segment?.name
    //   },
    // },
    { field: 'email', headerName: 'Email', width: 200 },
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
          <CardHeader style={{ textAlign: 'center' }} title="Turma" subheader={classGroup.name} />
          <CardContent>Alunos</CardContent>

          <DataGrid
            rows={classGroup.students}
            columns={columns}
            // pageSize={5}
            // rowsPerPageOptions={[5]}
            autoPageSize
            checkboxSelection
            autoHeight
          />
        </Card>
      </Grid>
    </Grid>
  );
};

export default ClassView;
