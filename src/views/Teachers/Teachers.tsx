import { Card, CardActions, CardContent, CardHeader, Grid, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { AppButton, AppLink } from '../../components';
import { teachersService } from '../../services/teachers.service';

/**
 * Renders "Teachers" view
 * url: /professores/*
 */
const TeachersView = () => {
  const [teachers, setTeachers] = useState<any[]>();
  const [loading, setLoading] = useState(true);

  const loadTeacherList = useCallback(async () => {
    // try{
    const response = await teachersService.getAll();
    console.log(response);
    setTeachers(response.data.result);
    setLoading(false);

    // } catch(err:any){
    //     throw new Error('err')
    //   }
  }, []);

  useEffect(() => {
    loadTeacherList();
  }, [loadTeacherList]);

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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardHeader title="Professores" subheader="Lista de professores" />
          <CardContent>Detailed description of the application here...</CardContent>
          <ul>
            {teachers?.map((teacher) => {
              return <li key={teacher.id}>{teacher.name}</li>;
            })}
          </ul>
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

export default TeachersView;
