import { Card, CardActions, CardContent, CardHeader, Grid , CircularProgress } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useCallback, useEffect, useState } from 'react';
import { AppButton, AppLink } from '../../components';
import { classGroupsService } from '../../services/classGroups.service';

/**
 * Renders "ClassGroups" view
 * url: /professores/*
 */
const ClassGroupsView = () => {
  const [classGroups, setClassGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadClassGroupsList = useCallback(async () => {
    // try{
    const response = await classGroupsService.getAll();
    console.log(response);
    setClassGroups(response.data.classGroups);
    setLoading(false);

    // } catch(err:any){
    //     throw new Error('err')
    //   }
  }, []);

  useEffect(() => {
    loadClassGroupsList();
  }, []);

  if (loading) return <CircularProgress />;

  const columns = [
    { field: 'name', headerName: 'Nome', width: 150 },
    { field: 'grade', headerName: 'Ano', width: 150 },
    { field: 'students_count', headerName: 'Alunos', width: 150 },
  ];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title="Turmas" subheader="Lista de turmas" />
          <CardContent>Detailed description of the application here...</CardContent>
          {/* <ul>
            {ClassGroups?.map((teacher) => {
              return <ClassGroupItem key={teacher.id} />;
            })}
            
          </ul> */}
          <DataGrid
            
            rows={classGroups}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            autoHeight
          />
          <CardActions>
            <AppLink to="/">
              <AppButton color="primary">OK</AppButton>
            </AppLink>
          </CardActions>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ClassGroupsView;
